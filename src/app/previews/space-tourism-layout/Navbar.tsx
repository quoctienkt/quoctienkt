"use client";

import { AppImage } from "@/components/core_components/image/Image";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { useAtom } from "jotai";
import { classes, toggle } from "@/utils/toggle";
import { useState } from "react";

const appPrefix = "/previews/space-tourism-layout";

export type NavItemActiveTypes = "home" | "destination" | null;
type NavbarProps = {
  navItemActive: NavItemActiveTypes;
};

export function Navbar({ navItemActive }: NavbarProps) {
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);
  const handleHamburgerClicked = (): void => {
    setNavbarOpen(true);
  };

  const closeNavbarToggle = (): void => {
    setNavbarOpen(false);
  };

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

        {!navbarOpen && (
          <div
            className={styles.hamburger}
            onClick={() => handleHamburgerClicked()}
          >
            <AppImage
              alt="Icon hamburger"
              src="/previews/space-tourism-layout/assets/shared/icon-hamburger.svg"
              width={24}
              height={22}
            ></AppImage>
          </div>
        )}
        {navbarOpen && (
          <>
            <div
              className={styles.navbarToggleClose}
              onClick={() => closeNavbarToggle()}
            >
              <AppImage
                alt="Icon close"
                src="/previews/space-tourism-layout/assets/shared/icon-close.svg"
                width={24}
                height={22}
              ></AppImage>
            </div>
            <div
              className={styles.backdrop}
              onClick={() => closeNavbarToggle()}
            ></div>
          </>
        )}
        <ol
          className={classes(
            styles.navLinks,
            toggle(navbarOpen, styles.navbarOpen)
          )}
        >
          <li
            className={toggle(navItemActive === "home", styles.navLinkActive)}
            onClick={() => closeNavbarToggle()}
          >
            <Link href={`${appPrefix}`}>
              <span className={styles.navItemMarker}></span>Home
            </Link>
          </li>
          <li
            className={toggle(
              navItemActive === "destination",
              styles.navLinkActive
            )}
            onClick={() => closeNavbarToggle()}
          >
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
