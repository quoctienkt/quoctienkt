window.getAssetPath = (path) => {
  let basePath = document.getElementById("basePath").innerText ?? "";
  return `${basePath}/${path}`;
};
