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
      <section className="flex justify-center w-full h-full bg-[#ffffff] overflow-auto relative sm:items-center">
        <div className="sm:w-[721px] h-fit">
          <SinglePriceGrid className="sm:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"></SinglePriceGrid>
        </div>
      </section>
    </>
  );
}
