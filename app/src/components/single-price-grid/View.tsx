import { classes } from "@/utils/toggle";
import styles from "./View.module.css";

type SinglePriceGridProps = {
  className: string;
};

export function SinglePriceGrid(props: SinglePriceGridProps) {
  return (
    <div className={classes(styles.wrapper, props.className)}>
      <div className={styles.overview}>
        <div className={styles.title}>Join our community</div>
        <div className={styles.subTitle}>
          30-day, hassle-free money back guarantee
        </div>
        <div className={styles.desc}>
          <span>
            Gain access to our full library of tutorials along with expert code
            reviews.
          </span>
          <span>
            Perfect for any developers who are serious about honing their
            skills.
          </span>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.subscription}>
          <div className={styles.header2}>Monthly Subscription</div>
          <div className={styles.prices}>
            <div className={styles.number}>&#36;29</div>
            <div className={styles.annual}>per month</div>
          </div>
          <div>Full access for less than &#36;1 a day</div>
          <div className={styles.signUp}>Sign Up</div>
        </div>
        <div className={styles.whyUs}>
          <div className={styles.header2}>Why Us</div>
          <ul>
            <li>Tutorials by industry experts</li>
            <li>Peer &amp; expert code review</li>
            <li>Coding exercises</li>
            <li>Access to our GitHub repos</li>
            <li>Community forum</li>
            <li>Flashcard decks</li>
            <li>New videos every week</li>
          </ul>
        </div>
      </div>

      {/* <footer>
        <p className="attribution">
          Challenge by{" "}
          <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">
            Frontend Mentor
          </a>
          . Coded by <a href="#">Your Name Here</a>.
        </p>
      </footer> */}
    </div>
  );
}
