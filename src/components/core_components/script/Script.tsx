import Script from "next/script";
import type { ScriptProps } from "next/script";
import { basePath } from "../../../../next.config";

export function AppScript(props: ScriptProps) {
  const localProps = {
    ...props,
    src: `${basePath}${props.src}`,
  };

  return <Script {...localProps} />;
}
