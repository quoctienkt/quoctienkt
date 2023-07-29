"use client";

import { useEffect, useState } from "react";
import { navItemActiveAtom } from "../SpaceTourismLayout";
import { useAtom } from "jotai";
import styles from "./Destination.module.css";
import { AppImage } from "@/components/core_components/image/Image";
import { classes, toggle } from "@/utils/toggle";
import pageData from "./data.json";

type TabTypes = "Moon" | "Mars" | "Europa" | "Titan";
const destinationsData = pageData.destinations;
const appPrefix = "/previews/space-tourism-layout";

export function Moon() {
  const [navItemActive, setNavItemActive] = useAtom(navItemActiveAtom);
  const [tabActive, setTabActive] = useState<TabTypes>("Moon");

  const handleTabClicked = (tab: TabTypes) => {
    setTabActive(tab);
  };

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
              src={`${appPrefix}${destinationsData.find((i) => i.name === tabActive)?.images.png ?? "undefined"}`}
              alt="Moon image"
              width="430"
              height="430"
            ></AppImage>
          </div>
          <div className={styles.content}>
            <div className={styles.tabs}>
              <div
                className={toggle(tabActive === "Moon", styles.tabActive)}
                onClick={() => handleTabClicked("Moon")}
              >
                Moon
              </div>
              <div
                className={toggle(tabActive === "Mars", styles.tabActive)}
                onClick={() => handleTabClicked("Mars")}
              >
                Mars
              </div>
              <div
                className={toggle(tabActive === "Europa", styles.tabActive)}
                onClick={() => handleTabClicked("Europa")}
              >
                Europa
              </div>
              <div
                className={toggle(tabActive === "Titan", styles.tabActive)}
                onClick={() => handleTabClicked("Titan")}
              >
                Titan
              </div>
            </div>
            <div className={styles.tabContents}>
              {destinationsData.map((destination) => {
                return (
                  <div
                    key={destination.name}
                    className={classes(
                      styles.tabContent,
                      toggle(
                        tabActive === destination.name,
                        styles.tabContentActive
                      )
                    )}
                  >
                    <div className={styles.largeText}>{destination.name}</div>
                    <div className={styles.desc}>{destination.description}</div>
                    <div className={styles.hr}></div>
                    <div className={styles.statistic}>
                      <div className={styles.distanceContainer}>
                        <div className={styles.statisticLabel}>
                          AVG. DISTANCE
                        </div>
                        <div className={styles.statisticNumber}>
                          {destination.distance}
                        </div>
                      </div>
                      <div className={styles.travelTimeContainer}>
                        <div className={styles.statisticLabel}>
                          Est. travel time
                        </div>
                        <div className={styles.statisticNumber}>
                          {destination.travel}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
