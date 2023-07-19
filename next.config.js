/** @type {import('next').NextConfig} */

const isGithubActions = process.env.GITHUB_ACTIONS || false

let assetPrefix = ""
let basePath = ""
let outputMode = undefined

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')

  assetPrefix = `/${repo}`
  basePath = `/${repo}`
  outputMode = "export"
}

const nextConfig = {
    assetPrefix: assetPrefix,
    basePath: basePath,
    output: outputMode,
    // serverRuntimeConfig: {
    //   // Will only be available on the server side
    // },
    // publicRuntimeConfig: {
    //   // Will be available on both server and client
    //   assetPrefix: assetPrefix,
    //   basePath: basePath,
    // },
}

module.exports = nextConfig
