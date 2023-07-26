import { ResultSummary } from "@/components/result-summary/View";
import { basePath } from "@/utils/assetUtil";
import { Metadata } from "next";
import { getAssetPath } from "@/utils/assetUtil";

const routeDir = "/apps/single-price-grid";
const appPrefix = "/apps/result-summary";
const favicon = "/favicon-32x32.png";

export const metadata: Metadata = {
  title: "Frontend Mentor | Results summary component",
  description: "All TienDang's app",
  icons: {
    icon: getAssetPath(routeDir + favicon),
  },
};

export default function Page() {
  return (
    <section className="w-[721px] h-[444px]">
      <ResultSummary basePath={basePath} appPrefix={appPrefix}></ResultSummary>
    </section>
  );
}
