"use client";

import { ThemeProvider } from "next-themes";

export const ThemeModeLocalStorageKey = "theme-mode";

type GlobalProviderProps = {
  children: React.ReactNode;
};
export function GlobalProvider({ children }: GlobalProviderProps) {
  return (
    <ThemeProvider
      enableSystem={false}
      attribute="data-theme"
      storageKey={ThemeModeLocalStorageKey}
    >
      {children}
    </ThemeProvider>
  );
}
