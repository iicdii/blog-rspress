import {
  usePageData,
  normalizeHrefInRuntime as normalizeHref,
} from "rspress/runtime";

import { Link } from "rspress/theme";

interface LatestArticles {
  content: React.ReactNode;
}

const LatestArticles = (props?: LatestArticles) => {
  const {
    siteData: { pages },
  } = usePageData();

  const latestArticles = [...pages]
    .filter(
      (page) =>
        page.routePath.startsWith("/articles") && page.frontmatter.created
    )
    .sort(
      (a, b) =>
        new Date(b.frontmatter.created as string).getTime() -
        new Date(a.frontmatter.created as string).getTime()
    )
    .slice(0, 10);

  return (
    <ul className="list-disc pl-5 my-4 leading-7">
      {latestArticles.map((article) => {
        const paths = article.routePath.split("/");
        const title = paths[paths.length - 1];

        return (
          <li
            key={article.routePath}
            className="[&:not(:first-child)]:mt-2"
            title={
              article.frontmatter.created
                ? new Date(
                    article.frontmatter.created as string
                  ).toLocaleDateString()
                : ""
            }
          >
            <Link href={normalizeHref(article.routePath)}>{title}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default LatestArticles;
