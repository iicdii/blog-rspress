import path from "node:path";

export const pluginFontPretendard = () => {
  return {
    name: "plugin-font-pretendard",
    builderConfig: {
      source: {
        preEntry: [path.join(__dirname, "pretendard.css")],
      },
      html: {
        tags: [
          {
            tag: "link",
            attrs: {
              rel: "stylesheet",
              as: "style",
              crossorigin: true,
              href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css",
            },
          },
        ],
      },
    },
  };
};
