import path from "node:path";

export const pluginFontPretendard = () => {
  return {
    name: "plugin-font-pretendard",
    builderConfig: {
      source: {
        preEntry: [path.join(__dirname, "pretendard.css")],
      },
    },
  };
};
