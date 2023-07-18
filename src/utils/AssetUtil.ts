import { assetPrefix } from "../../next.config"

const getAssetPath = (path: string): string => {
  return `${assetPrefix}/${path}`
}

export {
  getAssetPath
}
