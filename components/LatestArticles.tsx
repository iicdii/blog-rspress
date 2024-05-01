import {
  usePageData,
  normalizeHrefInRuntime as normalizeHref,
} from "rspress/runtime";
import dayjs from "dayjs";

import { Link } from "rspress/theme";

interface LatestArticles {
  content?: React.ReactNode;
  limit?: number;
  routePrefix?: string;
}

const LatestArticles = ({ routePrefix, limit = 10 }: LatestArticles) => {
  const {
    siteData: { pages },
  } = usePageData();

  const latestArticles = [...pages]
    .filter(
      (page) =>
        page.routePath.startsWith(
          "/articles" + (routePrefix ? routePrefix : "")
        ) && page.frontmatter.created
    )
    .sort(
      (a, b) =>
        new Date(b.frontmatter.created as string).getTime() -
        new Date(a.frontmatter.created as string).getTime()
    )
    .slice(0, limit);

  return (
    <ul className="my-4 leading-7">
      {latestArticles.map((article) => {
        const paths = article.routePath.split("/");
        const title = paths[paths.length - 1];

        return (
          <li
            key={article.routePath}
            className="[&:not(:first-child)]:mt-2 flex justify-between gap-2"
          >
            <Link href={normalizeHref(article.routePath)} className="flex-1">
              {title}
            </Link>
            <span className="text-gray-500">
              {dayjs(article.frontmatter.created as string).format(
                "YY. M. DD."
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default LatestArticles;
