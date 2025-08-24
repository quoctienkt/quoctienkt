import styles from "./SpaceTourismLayout.module.css";
import { NavItemActiveTypes, Navbar } from "./Navbar";
import { classes } from "@/utils/toggle";
import backgroundMobile from "@/assets/previews/space-tourism-layout/assets/destination/background-destination-mobile.jpg";
import backgroundTablet from "@/assets/previews/space-tourism-layout/assets/destination/background-destination-tablet.jpg";
import backgroundDesktop from "@/assets/previews/space-tourism-layout/assets/destination/background-destination-desktop.jpg";

type SpaceTourismLayoutProps = {
  children: React.ReactNode;
  navItemActive: NavItemActiveTypes;
};

export function SpaceTourismLayout({
  children,
  navItemActive,
}: SpaceTourismLayoutProps) {
  const backgroundMobileCss = `url(${backgroundMobile.src})`;
  const backgroundTabletCss = `url(${backgroundTablet.src})`;
  const backgroundDesktopCss = `url(${backgroundDesktop.src})`;
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
        {children}
      </div>
    </div>
  );
}
