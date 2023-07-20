import Image from "next/image";
import type { ImageProps } from "next/image";
import { basePath } from "../../../../next.config";

export function AppImage(props: ImageProps) {
  const localProps = {
    ...props,
    src: `${basePath}${props.src}`,
  };

  return <Image {...localProps} />;
}
