import styles from "./View.module.css";
import { SummaryItem } from "./SummaryItem";
import { classes } from "@/utils/toggle";

type ResultSummaryProps = {
  appPrefix: string;
  className: string;
};

export function ResultSummary({ appPrefix, className }: ResultSummaryProps) {
  return (
    <div className={classes(styles.wrapper, className)}>
      <div className={styles.result}>
        <div className={styles.title}>Your Result</div>
        <div className={styles.score}>
          <div className={styles.amount}>76</div>
          <div className={styles.percent}>of 100</div>
        </div>
        <div className={styles.desc}>
          <div className={styles.header}>Great</div>
          <div className={styles.detail}>
            You scored higher than 65% of the people who have taken these test.
          </div>
        </div>
      </div>
      <div className={styles.summary}>
        <div className={styles.summaryTitle}>Summary</div>
        <div className={styles.summaryDetail}>
          <SummaryItem
            text="Memory"
            variant="red"
            appPrefix={appPrefix}
            iconSrc="/assets/images/icon-memory.svg"
            percentValue={80}
          />
          <SummaryItem
            text="Reaction"
            variant="yellow"
            appPrefix={appPrefix}
            iconSrc="/assets/images/icon-reaction.svg"
            percentValue={92}
          />
          <SummaryItem
            text="Verbal"
            variant="green"
            appPrefix={appPrefix}
            iconSrc="/assets/images/icon-verbal.svg"
            percentValue={61}
          />
          <SummaryItem
            text="Visual"
            variant="blue"
            appPrefix={appPrefix}
            iconSrc="/assets/images/icon-visual.svg"
            percentValue={72}
          />
        </div>
        <div className={styles.continueBtn}>Continue</div>
      </div>
    </div>
  );
}
