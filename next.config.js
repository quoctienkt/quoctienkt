/** @type {import('next').NextConfig} */

const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix = "/test";
let basePath = "/test";
let outputMode = undefined;

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, "");

  assetPrefix = `/${repo}`;
  basePath = `/${repo}`;
  outputMode = "export";
}

const nextConfig = {
  assetPrefix: assetPrefix,
  basePath: basePath,
  output: outputMode,
};

module.exports = nextConfig;
