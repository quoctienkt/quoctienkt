"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import FacebookIcon from "@/assets/img/icons8-facebook-48.png";
import GithubIcon from "@/assets/img/github-6980894_1280.png";
import BrightnessIcon from "@/assets/img/brightness-and-contrast.png";
import MoonIcon from "@/assets/img/moon.png";

export function AboutUs() {
  const [mount, setMount] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) {
    return null;
  }

  return (
    <footer className="mt-auto px-6 py-5 bg-black/20 border-t border-white/10 flex flex-col items-center gap-4 rounded-b-xl">
      <div className="flex items-center justify-between w-full max-w-[800px] max-sm:flex-col max-sm:gap-4">
        {/* Brand */}
        <div className="font-bold text-[1.1rem]">
          <span
            className="bg-gradient-to-r from-[#a3e635] to-[#4ade80] bg-clip-text text-transparent"
          >
            TienDang Collection
          </span>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-4">
          <Link
            href="https://www.facebook.com/dangquoctienvktl/"
            target="_blank"
            className="opacity-80 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:opacity-100"
          >
            <Image src={FacebookIcon} alt="Facebook" width={32} height={32} />
          </Link>
          <Link
            href="https://github.com/quoctienkt/quoctienkt/"
            target="_blank"
            className="opacity-80 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:opacity-100"
          >
            <Image src={GithubIcon} alt="Github" width={28} height={28} />
          </Link>
        </div>

        {/* Theme toggle */}
        <div className="flex items-center">
          <button
            className="bg-none border-none cursor-pointer p-2 rounded-full transition-colors duration-200 flex items-center justify-center hover:bg-white/10"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle Theme"
          >
            <Image
              src={theme === "dark" ? BrightnessIcon : MoonIcon}
              alt="Toggle Theme"
              width={28}
              height={28}
              className="drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]"
            />
          </button>
        </div>
      </div>

      <div className="text-[0.8rem] opacity-50 text-center">
        © {new Date().getFullYear()} Quoc Tien. Open Source Software.
      </div>
    </footer>
  );
}