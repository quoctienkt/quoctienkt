"use client";

import { useEffect } from "react";
import { navItemActiveAtom } from "../SpaceTourismLayout";
import { useAtom } from "jotai";
import styles from "./Moon.module.css";

export function Moon() {
  const [navItemActive, setNavItemActive] = useAtom(navItemActiveAtom);
  useEffect(() => {
    setNavItemActive("destination");
  }, [setNavItemActive]);

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
        <section className={"invisible h-full w-0"}></section>
        <section className={styles.exploreSection}>
          <div className={styles.explore}>Explore</div>
        </section>
      </main>
    </>
  );
}
