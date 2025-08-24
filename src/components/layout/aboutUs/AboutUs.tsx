"use client";

import Link from "next/link";
import styles from "./AboutUs.module.css";
import { VerticalLine } from "@/components/verticalLine/VerticalLine";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { classes, toggle } from "@/utils/toggle";
import Image from "next/image";
import FacebookIcon from "@/assets/img/icons8-facebook-48.png";
import GithubIcon from "@/assets/img/github-6980894_1280.png";
import BrightnessIcon from "@/assets/img/brightness-and-contrast.png";
import MoonIcon from "@/assets/img/moon.png";
import ToTopIcon from "@/assets/img/to_top.png";

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
    <VerticalLine background="bg-[rgb(var(--color-central)))]"></VerticalLine>
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
      <div className={styles.me}>TienDang Collection</div>
      <div className={styles.socialGroup}>
        {verticalLine}
        <Link href="https://www.facebook.com/dangquoctienvktl/" target="_blank">
          <Image
            src={FacebookIcon}
            alt="Facebook Icon"
            width={48}
            height={48}
          ></Image>
          <span></span>
        </Link>
        <Link href="https://github.com/quoctienkt/quoctienkt/" target="_blank">
          <Image
            src={GithubIcon}
            alt="Github Icon"
            width={40}
            height={40}
          ></Image>
        </Link>
      </div>

      <div className={styles.settingGroup}>
        {verticalLine}
        {theme === "dark" && (
          <div
            className={classes(styles.themeToggle, styles.flexItem)}
            onClick={() => {
              setTheme("light");
            }}
          >
            <Image
              src={BrightnessIcon}
              alt="Theme Config Light Icon"
              width={40}
              height={40}
            ></Image>
          </div>
        )}
        {theme === "light" && (
          <div
            className={classes(styles.themeToggle, styles.flexItem)}
            onClick={() => {
              setTheme("dark");
            }}
          >
            <Image
              src={MoonIcon}
              alt="Theme Config Moon Icon"
              width={40}
              height={40}
            ></Image>
          </div>
        )}

        <div
          className={classes(styles.aboutUsExpansion, styles.flexItem)}
          onClick={() => setAboutUsExpansion(!aboutUsExpansion)}
        >
          {aboutUsExpansion && (
            <Image
              className="rotate-180 invert"
              src={ToTopIcon}
              alt="About Us Collapse Icon"
              width={40}
              height={40}
            ></Image>
          )}
          {!aboutUsExpansion && (
            <Image
              className="invert"
              src={ToTopIcon}
              alt="About Us Expansion Icon"
              width={40}
              height={40}
            ></Image>
          )}
        </div>
      </div>
    </div>
  );
}