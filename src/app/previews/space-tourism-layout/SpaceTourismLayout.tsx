"use client";

import styles from "./SpaceTourismLayout.module.css";
import { Navbar } from "./Navbar";
import { atom } from "jotai";
import { classes } from "@/utils/toggle";

const appPrefix = "/previews/space-tourism-layout";
type NavItemActiveTypes = "home" | "destination" | null;
export const navItemActiveAtom = atom<NavItemActiveTypes>(null);

type SpaceTourismLayoutProps = {
  basePath: string;
  children: React.ReactNode;
  backgroundMobileUrl: string;
  backgroundTabletUrl: string;
  backgroundDesktopUrl: string;
};

export function SpaceTourismLayout({
  basePath,
  children,
  backgroundMobileUrl,
  backgroundTabletUrl,
  backgroundDesktopUrl,
}: SpaceTourismLayoutProps) {
  const backgroundMobileCss = `url(${basePath}${backgroundMobileUrl})`;
  const backgroundTabletCss = `url(${basePath}${backgroundTabletUrl})`;
  const backgroundDesktopCss = `url(${basePath}${backgroundDesktopUrl})`;
  return (
    <div className={classes(styles.wrapper, "relative")}>
      <div
        className={classes(
          "absolute top-0 bottom-0 left-0 right-0  bg-center bg-no-repeat bg-cover z-0",
          "hidden max-sm:block"
        )}
        style={{ backgroundImage: backgroundMobileCss }}
      ></div>
      <div
        className={classes(
          "absolute top-0 bottom-0 left-0 right-0  bg-center bg-no-repeat bg-cover z-0",
          "hidden sm:block"
        )}
        style={{ backgroundImage: backgroundTabletCss }}
      ></div>
      <div
        className={classes(
          "absolute top-0 bottom-0 left-0 right-0  bg-center bg-no-repeat bg-cover z-0",
          "hidden lg:block"
        )}
        style={{ backgroundImage: backgroundDesktopCss }}
      ></div>
      <Navbar></Navbar>
      {children}
    </div>
  );
}
