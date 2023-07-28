"use client";

import styles from "./SpaceTourismLayout.module.css";
import Image from "next/image";
import { AppImage } from "@/components/core_components/image/Image";
import { Navbar } from "./Navbar";
import { atom } from 'jotai'

const appPrefix = "/previews/space-tourism-layout";

type NavItemActiveTypes = "home" | "destination" | null;
export const navItemActiveAtom = atom<NavItemActiveTypes>(null);

export function SpaceTourismLayout({
  children,
  backgroundDesktopUrl,
  basePath,
}: any) {
  return (
    <div
      className={styles.wrapper}
      style={{
        background: `url('${backgroundDesktopUrl}')`,
        backgroundSize: "cover",
      }}
    >
      <Navbar></Navbar>
      {children}
    </div>
  );
}
