import styles from "./SummaryItem.module.css";
import Image from "next/image";
import { classes } from "@/utils/toggle";

type SummaryItemProps = {
  text: string;
  appPrefix: string;
  iconSrc: string;
  percentValue: number;
  variant: "red" | "yellow" | "green" | "blue";
};

export function SummaryItem(props: SummaryItemProps) {
  return (
    <>
      <div className={classes(styles.item, styles[props.variant])}>
        <div className={styles.itemIcon}>
          <Image
            src={`${props.appPrefix}${props.iconSrc}`}
            height={30}
            width={30}
            alt={props.text}
          />
        </div>
        <div className={styles.itemTitle}>{props.text}</div>
        <div className={styles.itemPercent}>
          <div className={styles.itemPercentValue}>{props.percentValue}</div>
          <div className={styles.itemPercentSeparate}>/</div>
          <div className={styles.itemPercent100}>100</div>
        </div>
      </div>
    </>
  );
}
