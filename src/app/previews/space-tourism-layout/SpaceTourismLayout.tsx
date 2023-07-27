import Image from "next/image";
import styles from "./SpaceTourismLayout.module.css";
import { AppImage } from "@/components/core_components/image/Image";

const appPrefix = "/previews/space-tourism-layout";

export function SpaceTourismLayout() {
  return (
    <div className={styles.wrapper}>
      <nav>
        <div className={styles.appLogo}>
          <AppImage
            src={`${appPrefix}/assets/shared/logo.svg`}
            alt="Space tourism logo"
            width={48}
            height={48}
          ></AppImage>
        </div>

      <div className={styles.line}></div>

        <ol className={styles.navLinks}>
          <li className={styles.navLinkActive}><span className={styles.navItemMarker}></span>Home</li>
          <li><span className={styles.navItemMarker}></span>Destination</li>
          <li><span className={styles.navItemMarker}></span>Crew</li>
          <li><span className={styles.navItemMarker}></span>Technology</li>
        </ol>
      </nav>

      <main>
        <section className={styles.content}>
          <div className={styles.leadingText}>So, you want to travel to</div>
          <div className={styles.mainText}>Space</div>
          <div className={styles.desc}>
            Let’s face it; if you want to go to space, you might as well
            genuinely go to outer space and not hover kind of on the edge of it.
            Well sit back, and relax because we’ll give you a truly out of this
            world experience!
          </div>
        </section>
        <section className={"invisible h-full w-0"}></section>
        <section className={styles.exploreSection}>
          <div className={styles.explore}>Explore</div>
        </section>
      </main>
    </div>
  );
}
