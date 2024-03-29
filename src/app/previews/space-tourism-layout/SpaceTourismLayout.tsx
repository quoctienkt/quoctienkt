import styles from "./SpaceTourismLayout.module.css";
import { NavItemActiveTypes, Navbar } from "./Navbar";
import { classes } from "@/utils/toggle";
import { Suspense } from "react";

type SpaceTourismLayoutProps = {
  children: React.ReactNode;
  basePath: string;
  navItemActive: NavItemActiveTypes;
  backgroundMobileUrl: string;
  backgroundTabletUrl: string;
  backgroundDesktopUrl: string;
};

export function SpaceTourismLayout({
  basePath,
  children,
  navItemActive,
  backgroundMobileUrl,
  backgroundTabletUrl,
  backgroundDesktopUrl,
}: SpaceTourismLayoutProps) {
  const backgroundMobileCss = `url(${basePath}${backgroundMobileUrl})`;
  const backgroundTabletCss = `url(${basePath}${backgroundTabletUrl})`;
  const backgroundDesktopCss = `url(${basePath}${backgroundDesktopUrl})`;
  return (
    <div className={classes(styles.wrapper)}>
      <div>
        <div
          className={classes(
            "absolute top-0 bottom-0 left-0 right-0 bg-center bg-no-repeat bg-cover z-0",
            "hidden max-sm:block"
          )}
          style={{ backgroundImage: backgroundMobileCss }}
        ></div>
        <div
          className={classes(
            "absolute top-0 bottom-0 left-0 right-0  bg-center bg-no-repeat bg-cover z-0",
            "hidden max-lg:block"
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
        <Navbar navItemActive={navItemActive}></Navbar>
        {/* <Suspense fallback={<>loading....</>}> */}
        {children}
        {/* </Suspense> */}
      </div>
    </div>
  );
}
