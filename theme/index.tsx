import Theme, {
  getCustomMDXComponent as originalGetCustomMDXComponent,
} from "rspress/theme";
import { H1, H2, H3 } from "./docComponents/title";
import { Hr } from "./docComponents/hr";
import { Blockquote } from "./docComponents/paragraph";
import ArticleHelmet from "../components/ArticleHelmet";
import TopArticles from "../components/TopArticles";

const Layout = () => (
  <Theme.Layout
    top={<ArticleHelmet />}
    afterDocContent={<TopArticles limit={7} position="footer" />}
  />
);

export default {
  ...Theme,
  Layout,
};

export function getCustomMDXComponent() {
  return {
    ...originalGetCustomMDXComponent(),
    h1: H1,
    h2: H2,
    h3: H3,
    hr: Hr,
    blockquote: Blockquote,
  };
}

export * from "rspress/theme";
