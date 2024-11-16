import Image from "next/image";
import type { ImageProps } from "next/image";
import { basePath } from "@/utils/assetUtil";

export function AppImage(props: ImageProps) {
  const localProps = {
    ...props,
    src: `${basePath}${props.src}`,
  };

  return <Image {...localProps} />;
}
