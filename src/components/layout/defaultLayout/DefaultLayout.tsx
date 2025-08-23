"use client";

import styles from "./DefaultLayout.module.css";
import Navbar from "@/components/layout/navbar/Navbar";
import React from "react";
import { AboutUs } from "../aboutUs/AboutUs";

interface LayoutProps {
  children: React.ReactNode;
}

export function DefaultLayout({ children }: LayoutProps) {
  return (
    <>
      <div className={styles.appWrapper}>
        <Navbar className={styles.navbar} />

        <div className={styles.mainPage}>
          <main className={styles.main}>{children}</main>
        </div>

        <AboutUs></AboutUs>
      </div>
    </>
  );
}
