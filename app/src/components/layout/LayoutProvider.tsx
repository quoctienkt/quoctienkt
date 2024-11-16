"use client";

// Use usePathname for catching route name.
import { usePathname } from "next/navigation";
import { DefaultLayout } from "./defaultLayout/DefaultLayout";
import { NoLayout } from "./noLayout/NoLayout";

type LayoutProviderProps = {
  children: React.ReactNode;
  basePath: string;
};

export function LayoutProvider(props: LayoutProviderProps) {
  const pathname = usePathname();
  return (
    <>
      {pathname === props.basePath && (
        <DefaultLayout basePath={props.basePath}>
          {props.children}
        </DefaultLayout>
      )}
      {pathname?.startsWith(props.basePath + "/previews") && (
        <>{props.children}</>
      )}
    </>
  );
}
