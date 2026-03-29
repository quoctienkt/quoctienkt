"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import NextLogo from "@/assets/img/next.svg";

const navLinks = [
  { href: "/apps/handwritingclassification", label: "Hand-writing classification", icon: "✏️" },
  { href: "/apps/sinhtumon", label: "Sinh tử môn", icon: "⚔️" },
  { href: "/previews/single-price-grid", label: "Single Price Grid", icon: "💲" },
  { href: "/previews/result-summary", label: "Result Summary", icon: "📊" },
  { href: "/previews/space-tourism-layout", label: "Space Tourism Layout", icon: "🚀" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={[
        "flex flex-col w-[260px] min-w-[260px] shrink-0 h-screen overflow-y-auto z-10",
        "bg-gradient-to-b from-[rgb(var(--background-start-rgb))] to-[rgb(var(--background-end-rgb))]",
        "border-r border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.2)]",
        "px-4 py-6 gap-0",
        "max-lg:w-[72px] max-lg:min-w-[72px] max-lg:items-center max-lg:px-2.5",
        "max-md:hidden",
      ].join(" ")}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center justify-center px-2 pb-5 pt-3 transition-opacity hover:opacity-80 max-lg:p-2"
      >
        <Image
          src={NextLogo}
          alt="App Logo"
          width={140}
          height={35}
          priority
          className="drop-shadow-lg dark:invert max-lg:w-10 max-lg:h-10 max-lg:object-contain"
        />
      </Link>

      {/* Divider */}
      <div className="h-px my-2 mb-5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Navigation */}
      <nav className="flex-1 flex flex-col">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[rgba(var(--color-rgb),0.4)] px-3 mb-2.5 max-lg:hidden">
          Navigation
        </p>
        <ul className="list-none p-0 m-0 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={[
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-sm font-medium no-underline",
                    "transition-all duration-200 ease-in-out relative overflow-hidden",
                    isActive
                      ? "text-[rgb(var(--vivid-rgb))] bg-[rgba(var(--vivid-rgb),0.15)] font-semibold shadow-[inset_3px_0_0_rgb(var(--vivid-rgb))]"
                      : "text-[rgba(var(--color-rgb),0.75)] hover:text-[rgb(var(--vivid-rgb))] hover:bg-[rgba(var(--vivid-rgb),0.1)] hover:translate-x-1",
                    "max-lg:justify-center max-lg:p-2.5 max-lg:w-12 max-lg:h-12",
                    isActive && "max-lg:shadow-[0_0_0_2px_rgb(var(--vivid-rgb))]",
                  ].join(" ")}
                >
                  <span className="text-[1.1rem] w-6 text-center shrink-0">{link.icon}</span>
                  <span className="leading-snug max-lg:hidden">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
