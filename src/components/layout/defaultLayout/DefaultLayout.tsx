"use client";

import styles from "./DefaultLayout.module.css";
import Navbar from "@/components/navbar/Navbar";
import React from "react";
import BackgroundBubble from "../w_background/BackgroundBubble";
import Link from "next/link";
import { AppImage } from "../../core_components/image/Image";

interface LayoutProps {
  children: React.ReactNode,
  basePath: string;
}

export function DefaultLayout({ children, basePath }: LayoutProps) {
  return (
    <>
      <div className={styles.appWrapper}>
        <Navbar basePath={basePath} />

        <div className={styles.mainPage}>
          <BackgroundBubble>
            <main>{children}</main>

            <footer>
              TienDang Apps <br />
              <Link
                className="flex flex-row items-center gap-1"
                href="https://github.com/quoctienkt/quoctienkt/"
                target="_blank"
              >
                Give me a star
                <AppImage
                  src="/img/github-6980894_1280.png"
                  alt="Github Icon"
                  width={35}
                  height={15}
                ></AppImage>
              </Link>
            </footer>
          </BackgroundBubble>
        </div>
      </div>
    </>
  );
}
