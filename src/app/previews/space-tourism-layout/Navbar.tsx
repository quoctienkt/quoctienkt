"use client";

import styles from "./Navbar.module.css";
import Link from "next/link";
import { classes, toggle } from "@/utils/toggle";
import { useState } from "react";
import Image from "next/image";
import Logo from "@/assets/previews/space-tourism-layout/assets/shared/logo.svg";
import HamburgerIcon from "@/assets/previews/space-tourism-layout/assets/shared/icon-hamburger.svg";
import CloseIcon from "@/assets/previews/space-tourism-layout/assets/shared/icon-close.svg";

const appPrefix = "/previews/space-tourism-layout";

export type NavItemActiveTypes = "home" | "destination" | null;
type NavbarProps = {
  navItemActive: NavItemActiveTypes;
};

export function Navbar({ navItemActive }: NavbarProps) {
  const [navbarTransitioning, setNavbarTransitioning] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);
  const handleHamburgerClicked = (): void => {
    setNavbarTransitioning(true);
    setTimeout(() => {
      setNavbarTransitioning(false);
      setNavbarOpen(true);
    }, 1);
  };

  const closeNavbarToggle = (): void => {
    setNavbarTransitioning(true);
    setNavbarOpen(false);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.appLogo}>
          <Image
            src={Logo}
            alt="Space tourism logo"
            width={48}
            height={48}
          ></Image>
        </div>

        <div className={styles.line}></div>

        {!navbarOpen && (
          <div
            className={styles.hamburger}
            onClick={() => handleHamburgerClicked()}
          >
            <Image
              alt="Icon hamburger"
              src={HamburgerIcon}
              width={24}
              height={22}
            ></Image>
          </div>
        )}
        {navbarOpen && (
          <>
            <div
              className={styles.navbarToggleClose}
              onClick={() => closeNavbarToggle()}
            >
              <Image
                alt="Icon close"
                src={CloseIcon}
                width={24}
                height={22}
              ></Image>
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
            toggle(navbarTransitioning, styles.navbarTransitionInStart),
            toggle(navbarOpen, styles.navbarOpen)
          )}
          onTransitionEnd={() => {
            setNavbarTransitioning(false);
          }}
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