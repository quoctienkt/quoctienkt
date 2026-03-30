'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

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
    <div className="mt-auto pt-6 border-t border-[rgba(var(--color-rgb),0.1)] flex flex-col items-center gap-3 w-full pb-2">
      <div className="font-medium text-[0.7rem] text-[rgba(var(--color-rgb),0.5)] whitespace-nowrap uppercase tracking-widest max-lg:hidden">
        By Tien Dang
      </div>

      <div className="flex items-center gap-4 w-full justify-center max-lg:flex-col">
        <Link
          href="https://www.facebook.com/dangquoctienvktl/"
          target="_blank"
          className="text-[rgba(var(--color-rgb),0.6)] transition-all hover:text-[rgb(var(--vivid-rgb))] hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </Link>
        <Link
          href="https://github.com/quoctienkt/quoctienkt/"
          target="_blank"
          className="text-[rgba(var(--color-rgb),0.6)] transition-all hover:text-[rgb(var(--vivid-rgb))] hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.8c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
            <path d="M9 18c-4.5 1-5-2.5-5-2.5" />
          </svg>
        </Link>

        <div className="w-px h-3 bg-[rgba(var(--color-rgb),0.2)] max-lg:hidden"></div>
        <div className="h-px w-3 bg-[rgba(var(--color-rgb),0.2)] lg:hidden"></div>

        <button
          className="text-[rgba(var(--color-rgb),0.6)] transition-all hover:text-[rgb(var(--vivid-rgb))] hover:scale-110 flex items-center justify-center"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  );
}
