import {
  useLocation,
  normalizeHrefInRuntime as normalizeHref,
} from "rspress/runtime";
import data from "../data/topArticles.json";

import { Link } from "rspress/theme";
import { H3 } from "../theme/docComponents/title";
import styles from "./TopArticles.module.scss";

interface TopArticles {
  content?: React.ReactNode;
  limit?: number;
  position?: "default" | "footer";
}

const TopArticles = ({ limit, position }: TopArticles) => {
  const { pathname } = useLocation();

  if (pathname === "/index" && position === "footer") return null;

  const topArticles = data.slice(0, limit);

  if (position === "footer") {
    return (
      <div className={styles.container}>
        <H3>주간 인기 TOP {limit}</H3>
        <ul className={styles.list}>
          {topArticles.map((article) => {
            return (
              <li
                key={article.url}
                className="[&:not(:first-child)]:mt-2 flex justify-between"
              >
                <Link href={normalizeHref(article.url)}>{article.title}</Link>
                <span>{article.views}</span>
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
              className="[&:not(:first-child)]:mt-2 flex justify-between"
            >
              <Link href={normalizeHref(article.url)}>{article.title}</Link>
              <span>{article.views}</span>
            </li>
          );
        })}
      </ul>
    );
  }
};

export default TopArticles;
