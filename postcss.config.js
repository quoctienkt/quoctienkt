const { basePath } = require("./next.config.js");

const urlOption = {
  // import { Options } from "postcss-url";
  basePath: basePath,
  url: (asset, dir) => {
    if (asset.url !== undefined && asset.url.startsWith("/")) {
      return `${basePath}/${asset.url}`;
    }
    return asset.url;
  },
};

const config = {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
    "postcss-url": urlOption,
  },
};

module.exports = config;
