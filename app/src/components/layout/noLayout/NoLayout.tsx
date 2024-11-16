import React from "react";

interface NoLayoutProps {
  children: React.ReactNode;
}

export function NoLayout({ children }: NoLayoutProps) {
  return { children };
}
