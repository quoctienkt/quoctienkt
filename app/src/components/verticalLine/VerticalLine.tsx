import { classes } from "@/utils/toggle";
import styles from "./VerticalLine.module.css";

type VerticalLineProps = {
  className?: string;
  background: string;
};
export function VerticalLine({ className, background }: VerticalLineProps) {
  return (
    <div
      className={classes(
        styles.wrapper,
        className ?? "",
        background ?? "bg-white"
      )}
    ></div>
  );
}
