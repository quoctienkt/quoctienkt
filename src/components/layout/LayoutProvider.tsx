"use client";

// Use usePathname for catching route name.
import { usePathname } from "next/navigation";
import { DefaultLayout } from "./defaultLayout/DefaultLayout";
import { NoLayout } from "./noLayout/NoLayout";

type LayoutProviderProps = {
  children: React.ReactNode;
};

export function LayoutProvider(props: LayoutProviderProps) {
  const pathname = usePathname();
  return (
    <>
      {pathname === "/" && <DefaultLayout>{props.children}</DefaultLayout>}
      {pathname?.startsWith("/previews") && <>{props.children}</>}
    </>
  );
}
