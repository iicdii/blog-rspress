import * as path from "path";
import { defineConfig } from "rspress/config";
import remarkObsidian from "remark-obsidian";
import rehypeRaw from "rehype-raw";

const mdxNodeTypes = /** @type {const} */ [
  "mdxFlowExpression",
  "mdxJsxFlowElement",
  "mdxJsxTextElement",
  "mdxTextExpression",
  "mdxjsEsm",
];

export default defineConfig({
  root: path.join(__dirname, "docs"),
  title: "Harim",
  description: "개발과 라이프를 담은 공간",
  icon: "/favicon.png",
  logo: {
    light: "/light-logo.png",
    dark: "/dark-logo.png",
  },
  globalStyles: path.join(__dirname, "styles/index.css"),
  themeConfig: {
    socialLinks: [
      { icon: "github", mode: "link", content: "https://github.com/iicdii" },
    ],
  },
  markdown: {
    mdxRs: false,
    remarkPlugins: [remarkObsidian],
    rehypePlugins: [[rehypeRaw, { passThrough: mdxNodeTypes }]],
  },
});
