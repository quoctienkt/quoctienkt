import { assetPrefix } from "../../next.config"

const getAssetPath = (path: string): string => {
  console.log("assetPrefix: ", assetPrefix)
  return `${assetPrefix}/${path}`
}

export {
  getAssetPath
}
