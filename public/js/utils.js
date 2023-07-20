window.getAssetPath = (path) => {
  let basePath = document.getElementById("basePath").innerText ?? "";
  return `${basePath}${path}`;
};

window.getAssetPathWithAppPrefix = (appPrefix, path) => {
  let basePath = document.getElementById("basePath").innerText ?? "";
  let _appPrefix = appPrefix ?? "";
  return `${basePath}${_appPrefix}${path}`;
};
