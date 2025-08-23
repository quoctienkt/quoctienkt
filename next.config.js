const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix = "/";
let basePath = "/";
let outputMode = undefined;

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, "");
  assetPrefix = `/${repo}`;
  basePath = `/${repo}`;
  outputMode = "export";
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build",
  assetPrefix: assetPrefix,
  basePath: basePath,
  output: outputMode,
};

module.exports = nextConfig;
