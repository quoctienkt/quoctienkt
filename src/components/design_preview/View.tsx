import styles from "./View.module.css";
import Image, { StaticImageData } from "next/image";

type DesignPreviewProps = {
  designImgSrc: StaticImageData;
  children: React.ReactNode;
};

export function DesignPreview(props: DesignPreviewProps) {
  return (
    <div className={styles.wrapper}>
      <div>
        <div>Original</div>
        <div>
          <Image alt="Design image" src={props.designImgSrc}></Image>
        </div>
      </div>
      <div>
        <div>Preview</div>
        <div>{props.children}</div>
      </div>
    </div>
  );
}
