export const toggle = (
  state: boolean,
  activeClassName: string,
  hiddenClassName = ""
): string => {
  return state ? activeClassName : hiddenClassName;
};

export const classes = (...arr: string[]): string => {
  return arr.join(" ");
};
