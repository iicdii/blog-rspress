const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const fs = require("fs");

async function createAnalyticsClient() {
  let credentials;

  // "service_account.json" 파일이 있는지 확인
  const filePath = "./service_account.json";
  if (fs.existsSync(filePath)) {
    credentials = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } else {
    // 파일이 없을 경우, 환경 변수에서 JSON 파싱
    credentials = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
  }

  // 클라이언트 생성
  return new BetaAnalyticsDataClient({
    credentials,
  });
}

const propertyId = "437445226";
// Get the day 7 days ago
const today = new Date().getTime() - 60 * 60 * 24 * 7 * 1000;
// Get the day, month and year
const day = new Date(today).getDate();
const month = new Date(today).getMonth() + 1;
const year = new Date(today).getFullYear();
// Put it in Google's date format
const dayFormat = `${year}-${month}-${day}`;

async function fetchTopArticles() {
  const analyticsDataClient = await createAnalyticsClient();

  const [response] = await analyticsDataClient.runReport({
    property: "properties/" + propertyId,
    dateRanges: [
      {
        // Run from today to 7 days ago
        startDate: dayFormat,
        endDate: "today",
      },
    ],
    dimensions: [
      {
        // Get the page path
        name: "pagePathPlusQueryString",
      },
      {
        // And also get the page title
        name: "pageTitle",
      },
    ],
    metrics: [
      {
        // And tell me how many active users there were for each of those
        name: "activeUsers",
      },
    ],
  });

  // newObj will contain the views, url and title for all of our pages. You may have to adjust this for your own needs.
  let topRows = 10; // Number of items we want to return
  let pageTitle = " - Harim"; // The part off the front of the page title we want to remove, usually the domain name
  let blogUrl = "/articles/"; // The URLs we want to target.
  let newObj = [];

  response.rows.forEach((row) => {
    if (typeof row.dimensionValues[0].value.split("%")[1] !== "undefined") {
      row.dimensionValues[0].value = row.dimensionValues[0].value.split("%")[0];
    }

    if (
      typeof row.dimensionValues[1].value.split(pageTitle)[0] !== "undefined"
    ) {
      row.dimensionValues[1].value =
        row.dimensionValues[1].value.split(pageTitle)[0];
    }

    if (typeof row.dimensionValues[0].value.split(blogUrl)[1] !== "undefined") {
      if (typeof row.dimensionValues[0].value.split("?")[1] !== "undefined") {
        const findEl = newObj.find(
          (el) => el.url == row.dimensionValues[0].value.split("?")[0]
        );
        if (typeof findEl == "undefined") {
          newObj.push({
            url: row.dimensionValues[0].value.split("?")[0],
            views: row.metricValues[0].value,
            title: row.dimensionValues[1].value,
          });
        } else {
          findEl.views = `${
            parseFloat(findEl.views) + parseFloat(row.metricValues[0].value)
          }`;
        }
      } else {
        newObj.push({
          url: row.dimensionValues[0].value,
          views: row.metricValues[0].value,
          title: row.dimensionValues[1].value,
        });
      }
    }
  });

  newObj.sort((a, b) =>
    parseFloat(a.views) < parseFloat(b.views)
      ? 1
      : parseFloat(b.views) > parseFloat(a.views)
      ? -1
      : 0
  );
  newObj.splice(topRows, newObj.length);

  return newObj;
}

(async () => {
  const result = await fetchTopArticles();

  const outputFilePath = "data/topArticles.json";
  fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2));

  console.log(`Results saved to ${outputFilePath}`);
})();
