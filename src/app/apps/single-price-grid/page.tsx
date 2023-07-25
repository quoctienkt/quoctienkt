import { SinglePriceGrid } from "@/components/single-price-grid/View";
import { DesignPreview } from "@/components/design_preview/View";

import desktopDesign from "./design/desktop-design.jpg";

export default function Page() {
  return (
    <>
      {/* <head>
        <link rel="icon" type="image/png" sizes="32x32" href="./images/favicon-32x32.png "/>
        <title>Frontend Mentor | Single Price Grid Component</title>
      </head> */}
      {/* <DesignPreview designImgSrc={desktopDesign}> */}
        <SinglePriceGrid></SinglePriceGrid>
      {/* </DesignPreview> */}
    </>
  );
}
