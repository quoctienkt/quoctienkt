import { ResultSummary } from "@/components/result-summary/View";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frontend Mentor | Results summary component",
};

export default function Page() {
  return (
    <section className="flex justify-center w-full h-full bg-[#ffffff] overflow-auto relative sm:items-center">
      <div className="sm:w-[721px] h-fit">
        <ResultSummary className="sm:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"></ResultSummary>
      </div>
    </section>
  );
}
