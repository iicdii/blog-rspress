import fs from "fs";
import path from "path";
import { parse } from "yaml";
import { slug } from "github-slugger";
import { normalizeSlash } from "@rspress/shared";
import sizeOf from "image-size";

import { CODE_BLOCK_REGEX, BRACKET_LINK_REGEX } from "./constants";

export const extractFrontmatter = (markdown) => {
  const frontmatter = markdown.match(/^---([\s\S]+?)---/);

  if (!frontmatter) return {};

  const [, frontmatterString] = frontmatter;

  return parse(frontmatterString);
};

function findAllFilesInDir(dir, filelist = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      filelist = findAllFilesInDir(filePath, filelist);
    } else {
      filelist.push(filePath);
    }
  });

  return filelist;
}

export const titleToUrl = (title, folder) => {
  const titleFilename = `${title}.md`;
  const allFiles = findAllFilesInDir(folder);
  const foundFilePath = allFiles.find(
    (filePath) => path.basename(filePath) === titleFilename
  );

  if (foundFilePath) {
    let relativePath = foundFilePath.substring(folder.length);
    relativePath = normalizeSlash(relativePath);

    // 파일 확장자 제거
    relativePath = relativePath.replace(
      new RegExp(`${path.extname(relativePath)}$`),
      ""
    );

    return relativePath;
  }

  return "";
};

export const removeIgnoreParts = (tree) => {
  const start = tree.children.findIndex(
    ({ commentValue }) => commentValue?.trim() === "ignore"
  );
  const end = tree.children.findIndex(
    ({ commentValue }) => commentValue?.trim() === "end ignore"
  );

  if (start === -1) return;

  const elementsToDelete =
    (end === -1 ? tree.children.length : end) - start + 1;
  tree.children.splice(start, elementsToDelete);

  removeIgnoreParts(tree);
};

export const addPaywall = (tree, paywall) => {
  if (!paywall) return;

  const start = tree.children.findIndex(
    ({ commentValue }) => commentValue?.trim() === "private"
  );
  const end = tree.children.findIndex(
    ({ commentValue }) => commentValue?.trim() === "end private"
  );

  if (start === -1) return;

  const elementsToReplace =
    (end === -1 ? tree.children.length : end) - start + 1;
  tree.children.splice(start, elementsToReplace, {
    type: "html",
    value: paywall,
  });

  addPaywall(tree);
};

export const fetchEmbedContent = (fileName) => {
  const filePath = `docs/public/${fileName}`;

  if (!fs.existsSync(filePath)) return null;

  const [, ext] = fileName.split(".");

  if (ext === "md") {
    return fs.readFileSync(filePath, "utf8");
  } else if (["jpg", "jpeg", "png", "gif", "webp", "avif"].includes(ext)) {
    const { width, height } = sizeOf(filePath);
    return `<img src="/${fileName}" width="${width}" height="${height}" />`;
  } else if (["mp4", "webm", "ogg"].includes(ext)) {
    return `<video src="/${fileName}" controls></video>`;
  }
};

export const parseBracketLink = (bracketLink, titleToUrlFn = titleToUrl) => {
  const [match] = bracketLink.matchAll(BRACKET_LINK_REGEX);

  if (!match) return bracketLink;

  const [, link, heading, text] = match;
  const href = titleToUrlFn(link);

  return {
    href: heading ? `${href}#${slug(heading)}` : href,
    title: text || (heading ? link : link),
    slug: href.replace(/\//g, ""),
  };
};

export const extractBracketLinks = (content, titleToUrlFn = titleToUrl) => {
  const links =
    content.replace(CODE_BLOCK_REGEX, "").match(BRACKET_LINK_REGEX) || [];
  return links.map((link) => parseBracketLink(link, titleToUrlFn));
};

export default {
  extractFrontmatter,
  extractBracketLinks,
  parseBracketLink,
  fetchEmbedContent,
  removeIgnoreParts,
  titleToUrl,
  addPaywall,
};
