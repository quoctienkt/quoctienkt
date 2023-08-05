import { ResultSummary } from "@/components/result-summary/View";
import { basePath } from "@/utils/assetUtil";
import { Metadata } from "next";
import { getAssetPath } from "@/utils/assetUtil";

const assetPrefix = "/apps/single-price-grid";
const appPrefix = "/apps/result-summary";
const favicon = "/favicon-32x32.png";

export const metadata: Metadata = {
  title: "Frontend Mentor | Results summary component",
  description: "All TienDang's app",
  icons: {
    icon: getAssetPath(assetPrefix + favicon),
  },
};

export default function Page() {
  return (
    <section className="flex justify-center w-full h-full bg-[#ffffff] overflow-auto relative sm:w-[721px] sm:items-center">
      <ResultSummary
        className="sm:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
        basePath={basePath}
        appPrefix={appPrefix}
      ></ResultSummary>
    </section>
  );
}
