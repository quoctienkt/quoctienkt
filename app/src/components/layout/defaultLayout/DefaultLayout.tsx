"use client";

import styles from "./DefaultLayout.module.css";
import Navbar from "@/components/layout/navbar/Navbar";
import React from "react";
import BackgroundBubble from "../w_background/BackgroundBubble";
import Link from "next/link";
import { AppImage } from "../../core_components/image/Image";
import { AboutUs } from "../aboutUs/AboutUs";

interface LayoutProps {
  children: React.ReactNode;
  basePath: string;
}

export function DefaultLayout({ children, basePath }: LayoutProps) {
  return (
    <>
      <div className={styles.appWrapper}>
        <Navbar basePath={basePath} className={styles.navbar} />

        <div className={styles.mainPage}>
          <main className={styles.main}>{children}</main>
        </div>

        <AboutUs></AboutUs>
      </div>
    </>
  );
}
