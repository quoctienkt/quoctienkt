import { ResultSummary } from "@/components/result-summary/View";
import { Metadata } from "next";

const assetPrefix = "/apps/single-price-grid";
const appPrefix = "/apps/result-summary";
const favicon = "/favicon-32x32.png";

export const metadata: Metadata = {
  title: "Frontend Mentor | Results summary component",
  description: "All TienDang's app",
  icons: {
    icon: assetPrefix + favicon,
  },
};

export default function Page() {
  return (
    <section className="flex justify-center w-full h-full bg-[#ffffff] overflow-auto relative sm:items-center">
      <div className="sm:w-[721px] h-fit">
        <ResultSummary
          className="sm:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
          appPrefix={appPrefix}
        ></ResultSummary>
      </div>
    </section>
  );
}
