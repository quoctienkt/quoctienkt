"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import NextLogo from "@/assets/img/next.svg";

type NavbarProps = {
  className: string;
};

export default function Navbar(props: NavbarProps) {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <div
      className={[
        "relative flex flex-row flex-wrap items-center w-full h-fit border-none p-4",
        "shadow-[rgba(0,0,0,0.35)_0px_5px_15px]",
        "bg-gradient-to-l from-[rgb(var(--background-end-rgb))] to-[rgb(var(--background-start-rgb))]",
        "lg:flex-[0_0_300px] lg:gap-2 lg:flex-col",
        "max-lg:px-[15px] max-lg:justify-between max-lg:py-[8px]",
        props.className,
      ].join(" ")}
    >
      <Link href="/">
        <Image
          src={NextLogo}
          alt="App Logo"
          className="mt-1 lg:mt-8 lg:mb-8 lg:m-auto max-lg:w-[100px] dark:invert"
          width={200}
          height={50}
          priority
        />
      </Link>

      <button
        data-collapse-toggle="navbar-default"
        type="button"
        className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        aria-controls="navbar-default"
        aria-expanded="false"
        onClick={() => setNavbarOpen((prev) => !prev)}
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
      </button>

      <div
        className={[
          "flex flex-col w-full",
          "lg:block max-lg:hidden",
          "[&>*]:flex [&>*]:w-full [&>*]:p-2 [&>*]:border-amber-500",
          "[&>*]:border-t [&>*]:border-b [&>*]:border-white",
          "[&>*]:lg:block [&>*]:max-lg:bg-[#f8f9fa] [&>*]:max-lg:text-stone-900",
          "[&>*]:hover:text-[rgb(var(--vivid-rgb))] [&>*]:hover:font-bold",
          navbarOpen ? "p-2 mt-3 max-lg:flex bg-slate-300" : "",
        ].join(" ")}
      >
        <Link href="/apps/handwritingclassification" target="_self">
          Hand-writing classification
        </Link>
        <Link href="/apps/sinhtumon">Sinh tử môn</Link>
        <Link href="/previews/single-price-grid" target="_self">
          Single Price Grid
        </Link>
        <Link href="/previews/result-summary" target="_self">
          Result summary
        </Link>
        <Link href="/previews/space-tourism-layout" target="_self">
          Space Tourism Layout
        </Link>
      </div>
    </div>
  );
}
