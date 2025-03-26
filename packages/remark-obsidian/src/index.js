import { remark } from "remark";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import { toMarkdown } from "mdast-util-to-markdown";
import { gfmFootnoteToMarkdown } from "mdast-util-gfm-footnote";
import { gfmStrikethroughToMarkdown } from "mdast-util-gfm-strikethrough";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";
import { toHtml } from "hast-util-to-html";
import { toHast } from "mdast-util-to-hast";

import GithubSlugger from "github-slugger";
import {
  EMBED_LINK_REGEX,
  BRACKET_LINK_REGEX,
  CALLOUT_REGEX,
  ICONS,
} from "./constants";
import {
  removeIgnoreParts,
  addPaywall,
  titleToUrl,
  fetchEmbedContent,
} from "./utils";

const slugger = new GithubSlugger();

const plugin =
  (options = {}) =>
  (tree) => {
    const {
      markdownFolder = `${process.cwd()}/docs`,
      paywall = "<p>Paywall</p>",
    } = options;

    removeIgnoreParts(tree);
    addPaywall(tree, paywall);

    visit(tree, "paragraph", (node, index, parent) => {
      const markdown = toMarkdown(node, {
        extensions: [gfmFootnoteToMarkdown(), gfmStrikethroughToMarkdown],
      });
      const paragraph = String(
        unified().use(remarkParse).use(remarkHtml).processSync(markdown)
      );

      if (paragraph.match(EMBED_LINK_REGEX)) {
        const [, fileName] = EMBED_LINK_REGEX.exec(paragraph);

        if (node.children.some(({ type }) => type === "inlineCode")) {
          return node;
        }

        const content = fetchEmbedContent(fileName, options);

        if (!content) return node;

        if (fileName.endsWith(".md")) {
          const embedTree = remark()
            .use(remarkFrontmatter)
            .use(remarkGfm)
            .parse(content);

          plugin(options)(embedTree);

          parent.children.splice(index, 1, embedTree);
        } else {
          const html = {
            type: "html",
            value: content,
          };

          parent.children.splice(index, 1, html);
        }

        return node;
      }

      if (paragraph.match(BRACKET_LINK_REGEX)) {
        const html = paragraph.replace(
          BRACKET_LINK_REGEX,
          (bracketLink, link, heading, text) => {
            const href = titleToUrl(link, markdownFolder);

            if (
              node.children.some(
                ({ value, type }) =>
                  value === bracketLink && type === "inlineCode"
              )
            ) {
              return bracketLink;
            }

            if (heading && text) {
              return `<a href="${href}#${slugger.slug(heading)}" title="${text}">${text}</a>`;
            }

            if (heading) {
              return `<a href="${href}#${slugger.slug(heading)}" title="${link}">${link}</a>`;
            }

            if (text) {
              return `<a href="${href}" title="${text}">${text}</a>`;
            }

            return `<a href="${href}" title="${link}">${link}</a>`;
          }
        );

        if (html === paragraph) return node;

        delete node.children; // eslint-disable-line

        return Object.assign(node, { type: "html", value: html });
      }

      return node;
    });

    visit(tree, "blockquote", (node, index, parent) => {
      const blockquote = node.children?.[0].children?.[0]?.value;
      if (blockquote.match(CALLOUT_REGEX)) {
        const [, type, title] = CALLOUT_REGEX.exec(
          node.children?.[0].children?.[0].value
        );
        const icon = ICONS[type.toLowerCase()];

        // children 노드를 HTML로 변환
        let childrenHtml = node.children
          .map((child, i) => {
            const hast = toHast(child);
            let html = toHtml(hast);

            if (i === 0) {
              html = html.replace(CALLOUT_REGEX, "").trim().replace(/\n/g, " ");
            }

            return html;
          })
          .join("");

        const html = {
          type: "html",
          value: `<blockquote class="callout ${type.toLowerCase()}">
                    ${
                      icon
                        ? `<div class="callout-title">
                                ${
                                  icon
                                    ? `<div class="callout-icon">${icon}</div>`
                                    : ""
                                }
                                <div class="callout-title-inner">${
                                  title || type.toLowerCase()
                                }</div>
                              </div>`
                        : ""
                    }
                    <div class="callout-content">${childrenHtml}</div>
                  </blockquote>`,
        };

        parent.children.splice(index, 1, html);
      }
    });

    visit(tree, "paragraph", (node) => {
      const paragraph = toString(node);
      const highlightRegex = /==(.*)==/g;

      if (paragraph.match(highlightRegex)) {
        const html = paragraph.replace(highlightRegex, (markdown, text) => {
          if (
            node.children.some(
              ({ value, type }) => value === markdown && type === "inlineCode"
            )
          ) {
            return markdown;
          }

          if (
            node.children.some(
              (n) => n.type === "strong" && text === toString(n)
            )
          ) {
            return `<mark><b>${text}</b></mark>`;
          }

          return `<mark>${text}</mark>`;
        });

        if (html === paragraph) return node;

        delete node.children; // eslint-disable-line

        return Object.assign(node, { type: "html", value: `<p>${html}</p>` });
      }

      return node;
    });
  };

export { parseBracketLink, extractBracketLinks } from "./utils";

export default plugin;
