"use client";

import { useEffect, useState } from "react";
import styles from "./Destination.module.css";
import { classes, toggle } from "@/utils/toggle";
import pageData from "./data.json";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useImmer } from "use-immer";
import Image from "next/image";

import moonPng from "@/assets/previews/space-tourism-layout/assets/destination/image-moon.png";
import marsPng from "@/assets/previews/space-tourism-layout/assets/destination/image-mars.png";
import europaPng from "@/assets/previews/space-tourism-layout/assets/destination/image-europa.png";
import titanPng from "@/assets/previews/space-tourism-layout/assets/destination/image-titan.png";

const destinationsData = pageData.destinations;

const destinationImages = {
  Moon: moonPng,
  Mars: marsPng,
  Europa: europaPng,
  Titan: titanPng,
};

type TabTypes = "Moon" | "Mars" | "Europa" | "Titan";
type TabStatus =
  | "hidden"
  | "transitioning-in-start"
  | "active"
  | "transitioning-out";

type DestinationStates = {
  tabActive: TabTypes;
  tabTransitioningInStart: TabTypes | null;
  tabTransitioningOut: TabTypes | null;
};

const defaultState: DestinationStates = {
  tabActive: "Moon",
  tabTransitioningInStart: null,
  tabTransitioningOut: null,
};

export function Destination() {
  const [state, setState] = useImmer<DestinationStates>(defaultState);

  const getTabStatus = (tab: TabTypes): TabStatus => {
    if (tab === state.tabTransitioningInStart) {
      return "transitioning-in-start";
    }

    if (tab === state.tabActive) {
      return "active";
    }

    if (tab === state.tabTransitioningOut) {
      return "transitioning-out";
    }

    return "hidden";
  };

  const getTabCss = (tab: string): string => {
    const tabStatus = getTabStatus(tab as TabTypes);
    if (tabStatus === "transitioning-in-start") {
      return styles.tabTransitioningInStart;
    } else if (tabStatus === "active") {
      return styles.tabContentActive;
    } else if (tabStatus === "transitioning-out") {
      return styles.tabTransitioningOut;
    }
    return "hidden";
  };

  const handleTabClicked = (tab: TabTypes) => {
    if (tab !== state.tabActive) {
      setState((prev) => {
        prev.tabTransitioningInStart = tab;
      });
      setTimeout(() => {
        setState((prev) => {
          prev.tabTransitioningOut = prev.tabActive;
          prev.tabActive = tab;
          prev.tabTransitioningInStart = null;
        });
      }, 1);
    }
  };

  return (
    <>
      <main className={styles.main}>
        <header>Pick your destination</header>
        <section className={styles.contentWrapper}>
          <div className={styles.demoImg}>
            <Image
              className={classes(styles.img)}
              src={destinationImages[state.tabActive]}
              alt={`${state.tabActive} image`}
              width="430"
              height="430"
            />
          </div>
          <div className={styles.content}>
            <div className={styles.tabs}>
              <div
                className={toggle(state.tabActive === "Moon", styles.tabActive)}
                onClick={() => handleTabClicked("Moon")}
              >
                Moon
              </div>
              <div
                className={toggle(state.tabActive === "Mars", styles.tabActive)}
                onClick={() => handleTabClicked("Mars")}
              >
                Mars
              </div>
              <div
                className={toggle(
                  state.tabActive === "Europa",
                  styles.tabActive
                )}
                onClick={() => handleTabClicked("Europa")}
              >
                Europa
              </div>
              <div
                className={toggle(
                  state.tabActive === "Titan",
                  styles.tabActive
                )}
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
                    // onAnimationEnd={() => {}}
                    onTransitionEnd={() => {
                      if (state.tabTransitioningInStart !== destination.name) {
                        setState((prev) => {
                          prev.tabTransitioningInStart = null;
                        });
                      }

                      if (state.tabTransitioningOut !== destination.name) {
                        setState((prev) => {
                          prev.tabTransitioningOut = null;
                        });
                      }
                    }}
                    className={classes(
                      styles.tabContent,
                      getTabCss(destination.name)
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
