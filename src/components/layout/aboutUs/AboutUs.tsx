import Link from "next/link";
import { AppImage } from "../../core_components/image/Image";
import styles from "./AboutUs.module.css";

export function AboutUs() {
  return (
    <div className={styles.wrapper}>
      TienDang Apps <br />
      <Link
        className="flex flex-row items-center gap-1"
        href="https://github.com/quoctienkt/quoctienkt/"
        target="_blank"
      >
        Give me a star
        <AppImage
          src="/img/github-6980894_1280.png"
          alt="Github Icon"
          width={35}
          height={15}
        ></AppImage>
      </Link>
    </div>
  );
}
