import {
  useLocation,
  normalizeHrefInRuntime as normalizeHref,
} from "rspress/runtime";
import data from "../data/topArticles.json";

import { Link } from "rspress/theme";
import { H3 } from "../theme/docComponents/title";

const excludePaths = [
  "/index",
  "/",
  "/articles/2.%20Area",
  "/articles/3.%20Resource",
];

interface TopArticles {
  content?: React.ReactNode;
  limit?: number;
  position?: "default" | "footer";
}

const TopArticles = ({ limit, position }: TopArticles) => {
  const { pathname } = useLocation();

  if (excludePaths.includes(pathname) && position === "footer") return null;

  const topArticles = data.slice(0, limit);

  if (position === "footer") {
    return (
      <div className="pt-5">
        <H3>주간 인기 TOP {limit}</H3>
        <ul className="mt-4">
          {topArticles.map((article) => {
            return (
              <li
                key={article.url}
                className="[&:not(:first-child)]:mt-2 flex justify-between gap-2"
              >
                <Link href={normalizeHref(article.url)} className="flex-1">
                  {article.title}
                </Link>
                <span className="text-gray-500">{article.views}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  } else {
    return (
      <ul className="my-4 leading-7">
        {topArticles.map((article) => {
          return (
            <li
              key={article.url}
              className="[&:not(:first-child)]:mt-2 flex justify-between gap-2"
            >
              <Link href={normalizeHref(article.url)}>{article.title}</Link>
              <span className="text-gray-500">{article.views}</span>
            </li>
          );
        })}
      </ul>
    );
  }
};

export default TopArticles;
