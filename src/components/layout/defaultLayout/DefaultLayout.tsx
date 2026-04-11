'use client';

import Sidebar from '@/components/layout/sidebar/Sidebar';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function DefaultLayout({ children }: LayoutProps) {
  return (
    <div className="flex flex-row h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />

      <div className="flex-1 h-screen overflow-hidden relative">
        <main>{children}</main>
      </div>
    </div>
  );
}
