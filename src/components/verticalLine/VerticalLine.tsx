import { classes } from "@/utils/toggle";
import styles from "./VerticalLine.module.css";

type VerticalLineProps = {
  className?: string;
};
export function VerticalLine({ className }: VerticalLineProps) {
  return <div className={classes(className ?? "", styles.wrapper)}></div>;
}
