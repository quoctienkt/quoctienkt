"use client";

import Link from "next/link";
import styles from "./Navbar.module.css";
import { AppImage } from "../core_components/image/Image";

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <AppImage
        src="/vercel.svg"
        alt="App Logo"
        className={styles.logo}
        width={200}
        height={50}
        priority
      />

      {/* <button
        data-collapse-toggle="navbar-default"
        type="button"
        className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        aria-controls="navbar-default"
        aria-expanded="false"
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
      </button> */}

      <div className={styles.nav_links}>
        <Link href="/apps/handwritingclassification">
          Hand-writing classification
        </Link>
        <Link href="/apps/sinhtumon">Sinh tử môn</Link>
      </div>
    </div>
  );
}
