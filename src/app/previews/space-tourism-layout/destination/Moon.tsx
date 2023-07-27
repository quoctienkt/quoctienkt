"use client";

import { useEffect } from "react";
import { navItemActiveAtom } from "../SpaceTourismLayout";
import { useAtom } from "jotai";
import styles from "./Moon.module.css";
import { AppImage } from "@/components/core_components/image/Image";

export function Moon() {
  const [navItemActive, setNavItemActive] = useAtom(navItemActiveAtom);
  useEffect(() => {
    setNavItemActive("destination");
  }, [setNavItemActive]);

  return (
    <>
      <main className={styles.main}>
        <header>Pick your destination</header>
        <section className={styles.contentWrapper}>
          <div className={styles.demoImg}>
            <AppImage
              src="/previews/space-tourism-layout/assets/destination/image-moon.png"
              alt="Moon image"
              width="430"
              height="430"
            ></AppImage>
          </div>
          <div className={styles.content}>
            <div className={styles.tabs}>
              <div>Moon</div>
              <div>Mars</div>
              <div>Europa</div>
              <div>Titan</div>
            </div>
            <div className={styles.tabContent}>
              <div className={styles.largeText}>Moon</div>
              <div className={styles.desc}>
                See our planet as you’ve never seen it before. A perfect
                relaxing trip away to help regain perspective and come back
                refreshed. While you’re there, take in some history by visiting
                the Luna 2 and Apollo 11 landing sites.
              </div>
              <div className={styles.hr}></div>
              <div className={styles.statistic}>
                <div className={styles.distanceContainer}>
                  <div className={styles.statisticLabel}>AVG. DISTANCE</div>
                  <div className={styles.statisticNumber}>384,400 km</div>
                </div>
                <div className={styles.travelTimeContainer}>
                  <div className={styles.statisticLabel}>Est. travel time</div>
                  <div className={styles.statisticNumber}>3 days</div>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </section>
      </main>
    </>
  );
}
