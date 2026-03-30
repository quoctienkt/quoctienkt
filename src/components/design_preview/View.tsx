import Image, { StaticImageData } from 'next/image';

type DesignPreviewProps = {
  designImgSrc: StaticImageData;
  children: React.ReactNode;
};

export function DesignPreview(props: DesignPreviewProps) {
  return (
    <div className="flex flex-row w-full h-full">
      <div className="flex-auto p-3 basis-96">
        <div>Original</div>
        <div>
          <Image alt="Design image" src={props.designImgSrc}></Image>
        </div>
      </div>
      <div className="flex-auto p-3 basis-96">
        <div>Preview</div>
        <div>{props.children}</div>
      </div>
    </div>
  );
}
