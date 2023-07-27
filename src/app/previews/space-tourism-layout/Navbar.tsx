"use client"

import { AppImage } from "@/components/core_components/image/Image";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { useAtom } from 'jotai'
import { navItemActiveAtom } from "./SpaceTourismLayout";
import { toggle } from "@/utils/toggle";

const appPrefix = "/previews/space-tourism-layout";
export function Navbar() {
  const [navItemActive, setNavItemActive] = useAtom(navItemActiveAtom) ;
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.appLogo}>
          <AppImage
            src={`${appPrefix}/assets/shared/logo.svg`}
            alt="Space tourism logo"
            width={48}
            height={48}
          ></AppImage>
        </div>

        <div className={styles.line}></div>

        <ol className={styles.navLinks}>
          <li className={toggle(navItemActive === "home", styles.navLinkActive)}>
            <Link href={`${appPrefix}`}>
              <span className={styles.navItemMarker}></span>Home
            </Link>
          </li>
          <li className={toggle(navItemActive === "destination", styles.navLinkActive)}>
            <Link href={`${appPrefix}/destination`}>
              <span className={styles.navItemMarker}></span>Destination
            </Link>
          </li>
          <li>
            <span className={styles.navItemMarker}></span>Crew
          </li>
          <li>
            <span className={styles.navItemMarker}></span>Technology
          </li>
        </ol>
      </nav>
    </>
  );
}
