"use client";

import Sidebar from "@/components/layout/sidebar/Sidebar";
import React from "react";
import { AboutUs } from "../aboutUs/AboutUs";

interface LayoutProps {
  children: React.ReactNode;
}

export function DefaultLayout({ children }: LayoutProps) {
  return (
    <div className="flex flex-row h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />

      <div className="grid grid-cols-[1fr_240px] gap-4 flex-1 h-screen p-4 overflow-hidden max-lg:grid-cols-[1fr]">
        {/* Middle Panel */}
        <div className="flex flex-col bg-white/5 rounded-xl border border-white/10 overflow-y-auto relative">
          <main className="flex-grow p-6">{children}</main>
          <AboutUs />
        </div>

        {/* Right Panel: Ads */}
        <aside className="bg-white/5 rounded-xl p-4 border border-white/10 overflow-y-auto flex flex-col max-lg:hidden">
          <div className="text-center opacity-70">
            <h4 className="text-sm uppercase tracking-widest mb-4">Sponsored</h4>
            <div className="border-2 border-dashed border-white/20 p-8 rounded-lg text-white/50 text-sm">
              Ads not yet available
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
