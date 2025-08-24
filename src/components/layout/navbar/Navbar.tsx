"use client";

import Link from "next/link";
import styles from "./Navbar.module.css";
import { useState } from "react";
import { classes, toggle } from "@/utils/toggle";
import Image from "next/image";
import NextLogo from "@/assets/img/next.svg";

type NavbarProps = {
  className: string;
};

export default function Navbar(props: NavbarProps) {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <div className={classes(styles.navbar, props.className)}>
      <Link href="/">
        <Image
          src={NextLogo}
          alt="App Logo"
          className={styles.logo}
          width={200}
          height={50}
          priority
        />
      </Link>

      <button
        data-collapse-toggle="navbar-default"
        type="button"
        className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        aria-controls="navbar-default"
        aria-expanded="false"
        onClick={() => setNavbarOpen((prev) => !prev)}
      >
        <span className="sr-only">Open main menu</span>
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>

      <div
        className={classes(styles.navLinks, toggle(navbarOpen, styles.active))}
      >
        <Link href="/apps/handwritingclassification" target="_self">
          Hand-writing classification
        </Link>
        <Link href="/apps/sinhtumon">Sinh tử môn</Link>
        <Link href="/previews/single-price-grid" target="_self">
          Single Price Grid
        </Link>
        <Link href="/previews/result-summary" target="_self">
          Result summary
        </Link>
        <Link href="/previews/space-tourism-layout" target="_self">
          Space Tourism Layout
        </Link>
      </div>
    </div>
  );
}
