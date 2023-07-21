import { assetPrefix, basePath } from "../../next.config";

/**server only function */
const getAssetPath = (path: string): string => {
  return `${assetPrefix}/${path}`;
};

export const getAssetPathWithBasePath = (
  basePath: string,
  appPrefix: string,
  path: string
): string => {
  return `${basePath}${appPrefix}${path}`;
};

export { getAssetPath, basePath };
