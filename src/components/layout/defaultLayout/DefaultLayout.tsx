'use client';

import Sidebar from '@/components/layout/sidebar/Sidebar';
import React from 'react';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export function DefaultLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isGameRoute = pathname === '/apps/sinhtumon';

  if (isGameRoute) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-[#050711]">
        <main className="w-full h-full">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />

      <div className="flex-1 h-screen overflow-hidden relative">
        <main>{children}</main>
      </div>
    </div>
  );
}
