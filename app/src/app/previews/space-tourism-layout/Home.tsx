import styles from "./Home.module.css";

export function Home() {
  return (
    <>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.leadingText}>So, you want to travel to</div>
          <div className={styles.mainText}>Space</div>
          <div className={styles.desc}>
            Let’s face it; if you want to go to space, you might as well
            genuinely go to outer space and not hover kind of on the edge of it.
            Well sit back, and relax because we’ll give you a truly out of this
            world experience!
          </div>
        </section>
        <section className={styles.exploreSection}>
          <div className={styles.explore}>Explore</div>
        </section>
      </main>
    </>
  );
}
