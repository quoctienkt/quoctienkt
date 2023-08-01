"use client";

import Link from "next/link";
import { AppImage } from "../../core_components/image/Image";
import styles from "./AboutUs.module.css";
import { VerticalLine } from "@/components/verticalLine/VerticalLine";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { classes, toggle } from "@/utils/toggle";

const AboutUsExpansionLocalStorageKey = "about-us-expansion";
const aboutUsExpansionAtom = atomWithStorage(
  AboutUsExpansionLocalStorageKey,
  true
);

export function AboutUs() {
  const [mount, setMount] = useState(false);
  const { theme, setTheme } = useTheme();
  const [aboutUsExpansion, setAboutUsExpansion] = useAtom(aboutUsExpansionAtom);
  const verticalLine = (
    <VerticalLine background="bg-[rgb(var(--color-central))]"></VerticalLine>
  );

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) {
    return null;
  }

  return (
    <div
      className={classes(
        styles.wrapper,
        toggle(!aboutUsExpansion, styles.wrapperCollapse)
      )}
    >
      <div>TienDang Collection</div>
      {verticalLine}
      <Link
        className="flex flex-row items-center gap-1"
        href="https://www.facebook.com/dangquoctienvktl/"
        target="_blank"
      >
        <AppImage
          src="/img/icons8-facebook-48.png"
          alt="Github Icon"
          width={48}
          height={48}
        ></AppImage>
        <span></span>
      </Link>
      <Link
        className="flex flex-row items-center gap-1"
        href="https://github.com/quoctienkt/quoctienkt/"
        target="_blank"
      >
        <AppImage
          src="/img/github-6980894_1280.png"
          alt="Github Icon"
          width={35}
          height={35}
        ></AppImage>
        <span className={styles.hideOnCollapse}>Give me a star</span>
      </Link>
      {verticalLine}
      {theme === "dark" && (
        <div
          className={styles.themeToggle}
          onClick={() => {
            setTheme("light");
          }}
        >
          <AppImage
            src="/img/brightness-and-contrast.png"
            alt="Theme Config Light Icon"
            width={35}
            height={35}
          ></AppImage>
        </div>
      )}
      {theme === "light" && (
        <div
          className={styles.themeToggle}
          onClick={() => {
            setTheme("dark");
          }}
        >
          <AppImage
            src="/img/moon.png"
            alt="Theme Config Moon Icon"
            width={40}
            height={40}
          ></AppImage>
        </div>
      )}

      <div
        className={styles.aboutUsExpansion}
        onClick={() => setAboutUsExpansion(!aboutUsExpansion)}
      >
        {aboutUsExpansion && (
          <AppImage
            className="rotate-180 invert"
            src="/img/to_top.png"
            alt="About Us Collapse Icon"
            width={40}
            height={40}
          ></AppImage>
        )}
        {!aboutUsExpansion && (
          <AppImage
            className="invert"
            src="/img/to_top.png"
            alt="About Us Expansion Icon"
            width={40}
            height={40}
          ></AppImage>
        )}
      </div>
    </div>
  );
}
