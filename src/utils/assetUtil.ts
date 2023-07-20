import { assetPrefix, basePath } from "../../next.config"

const getAssetPath = (path: string): string => {
  return `${assetPrefix}/${path}`;
};

export { getAssetPath, basePath };
