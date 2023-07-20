"use client";

import styles from "./Layout.module.css";
import Navbar from "@/components/navbar/Navbar";
import React from "react";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={styles.appWrapper}>
        <div className={styles.sidebar}>
          <Navbar />
        </div>

        <div className={styles.mainPage}>
          <header className="">Main page header</header>

          <main>{children}</main>

          <footer className="bg-amber-900 color-white w-full h-9">
            TienDang Apps
          </footer>
        </div>
      </div>
    </>
  );
}
