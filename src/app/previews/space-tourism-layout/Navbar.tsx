"use client";

import Link from "next/link";
import { classes, toggle } from "@/utils/toggle";
import { useState } from "react";
import Image from "next/image";
import Logo from "@/assets/previews/space-tourism-layout/assets/shared/logo.svg";
import HamburgerIcon from "@/assets/previews/space-tourism-layout/assets/shared/icon-hamburger.svg";
import CloseIcon from "@/assets/previews/space-tourism-layout/assets/shared/icon-close.svg";

const appPrefix = "/previews/space-tourism-layout";

export type NavItemActiveTypes = "home" | "destination" | null;
type NavbarProps = {
  navItemActive: NavItemActiveTypes;
};

export function Navbar({ navItemActive }: NavbarProps) {
  const [navbarTransitioning, setNavbarTransitioning] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);

  const handleHamburgerClicked = (): void => {
    setNavbarTransitioning(true);
    setTimeout(() => {
      setNavbarTransitioning(false);
      setNavbarOpen(true);
    }, 1);
  };

  const closeNavbarToggle = (): void => {
    setNavbarTransitioning(true);
    setNavbarOpen(false);
  };

  return (
    <>
      <nav className="basis-24 flex-none z-20 flex flex-row w-full justify-between pt-6 items-center max-lg:pt-0">
        {/* Logo */}
        <div className="px-12 cursor-pointer basis-[144px] flex-none [&>*]:w-12 max-sm:basis-24 max-sm:px-0 max-sm:flex max-sm:justify-center">
          <Image src={Logo} alt="Space tourism logo" width={48} height={48} />
        </div>

        {/* Decorative line */}
        <div
          className="w-full relative z-[2] max-lg:hidden"
          style={{ opacity: 0.2514851987361908 }}
        >
          <span className="absolute block left-0 right-[-24px] h-px bg-white" />
        </div>

        {/* Hamburger (mobile only) */}
        {!navbarOpen && (
          <div
            className="hidden max-sm:flex w-24 h-full cursor-pointer justify-center items-center"
            onClick={() => handleHamburgerClicked()}
          >
            <Image
              alt="Icon hamburger"
              src={HamburgerIcon}
              width={24}
              height={22}
              className="w-12 p-2 hover:bg-slate-500 rounded-sm"
            />
          </div>
        )}

        {/* Close + backdrop (mobile open state) */}
        {navbarOpen && (
          <>
            <div
              className="hidden max-sm:flex w-24 h-full cursor-pointer justify-center items-center z-[61]"
              onClick={() => closeNavbarToggle()}
            >
              <Image alt="Icon close" src={CloseIcon} width={24} height={22} />
            </div>
            <div
              className="hidden max-sm:block fixed inset-0 z-40"
              onClick={() => closeNavbarToggle()}
            />
          </>
        )}

        {/* Nav links */}
        <ol
          className={classes(
            // base
            "flex flex-row h-full gap-12 pr-40 pl-24 list-none",
            "bg-[rgba(255,255,255,0.04)] backdrop-blur-[40px] [letter-spacing:2.7px]",
            // tablet
            "max-lg:px-10 select-none",
            // mobile
            "max-sm:fixed max-sm:right-0 max-sm:top-0 max-sm:bottom-0 max-sm:w-[250px] max-sm:z-[60] max-sm:gap-8",
            "max-sm:h-screen max-sm:flex-col max-sm:pt-32",
            "max-sm:transition-all max-sm:ease-in-out max-sm:duration-700",
            // hidden by default on mobile
            toggle(!navbarOpen && !navbarTransitioning, "max-sm:hidden"),
            toggle(navbarTransitioning && !navbarOpen, "max-sm:flex max-sm:translate-x-[100%]"),
            toggle(navbarOpen, "max-sm:flex max-sm:translate-x-0")
          )}
          onTransitionEnd={() => setNavbarTransitioning(false)}
        >
          {[
            { key: "home", label: "Home", href: `${appPrefix}` },
            { key: "destination", label: "Destination", href: `${appPrefix}/destination` },
            { key: null, label: "Crew", href: null },
            { key: null, label: "Technology", href: null },
          ].map((item, idx) => (
            <li
              key={idx}
              className={classes(
                "uppercase font-['Barlow_Condensed'] cursor-pointer relative flex flex-row items-center max-sm:pb-2",
                toggle(
                  navItemActive === item.key,
                  "after:content-[''] after:block after:absolute after:left-0 after:right-0 after:bottom-0 after:h-1 after:bg-white"
                )
              )}
              onClick={() => closeNavbarToggle()}
            >
              {item.href ? (
                <Link href={item.href}>
                  <span className="font-bold mr-2 sm:max-lg:hidden" aria-hidden>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              ) : (
                <>
                  <span className="font-bold mr-2 sm:max-lg:hidden" aria-hidden>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}