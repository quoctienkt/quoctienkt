import { SinglePriceGrid } from "@/components/single-price-grid/View";
import { DesignPreview } from "@/components/design_preview/View";

const routeDir = "/apps/single-price-grid";
const favicon = "/favicon-32x32.png";

import { Metadata } from "next";
import { getAssetPath } from "@/utils/assetUtil";

export const metadata: Metadata = {
  title: "Frontend Mentor | Single Price Grid Component",
  description: "All TienDang's app",
  icons: {
    icon: getAssetPath(routeDir + favicon),
  },
};

export default function Page() {
  return (
    <>
      {/* <DesignPreview designImgSrc={desktopDesign}> */}
      <section className="w-[750px]">
        <SinglePriceGrid></SinglePriceGrid>
      </section>
      {/* </DesignPreview> */}
    </>
  );
}
