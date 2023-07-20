"use client";

import styles from "./Layout.module.css";
import Navbar from "@/components/navbar/Navbar";
import React from "react";
import BackgroundBubble from "./w_background/BackgroundBubble";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={styles.appWrapper}>
        <Navbar />

        <div className={styles.mainPage}>
          <BackgroundBubble>
            <main>{children}</main>

            <footer className="w-full bg-amber-900 color-white h-9">
              TienDang Apps
            </footer>
          </BackgroundBubble>
        </div>
      </div>
    </>
  );
}
