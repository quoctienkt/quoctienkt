import { SummaryItem } from "./SummaryItem";
import { classes } from "@/utils/toggle";
import MemoryIcon from "@/assets/previews/result-summary/assets/images/icon-memory.svg";
import ReactionIcon from "@/assets/previews/result-summary/assets/images/icon-reaction.svg";
import VerbalIcon from "@/assets/previews/result-summary/assets/images/icon-verbal.svg";
import VisualIcon from "@/assets/previews/result-summary/assets/images/icon-visual.svg";

type ResultSummaryProps = {
  className: string;
};

export function ResultSummary({ className }: ResultSummaryProps) {
  return (
    <div className={classes("flex flex-row text-black bg-white rounded-3xl max-sm:rounded-none max-sm:flex-col", className)}>
      {/* Result panel */}
      <div className="flex-1 basis-60 rounded-3xl max-sm:rounded-b-3xl text-white bg-[#5c3dfa] flex flex-col text-center justify-center items-center">
        <div className="my-8 text-2xl">Your Result</div>
        <div className="w-40 h-40 rounded-full bg-[#4925cf] p-8">
          <div className="text-7xl">76</div>
          <div>of 100</div>
        </div>
        <div className="relative flex flex-col items-center pt-6 pb-8 before:content-[''] before:absolute before:block before:left-0 before:right-0 before:h-16 before:bottom-full before:bg-gradient-to-t before:from-[rgba(92,61,250,0.9)] before:to-[rgba(87,61,248,0)]">
          <div className="py-3 text-3xl">Great</div>
          <div className="w-2/3">
            You scored higher than 65% of the people who have taken these test.
          </div>
        </div>
      </div>

      {/* Summary panel */}
      <div className="relative flex flex-col justify-center flex-1 px-10 basis-60">
        <div className="self-start py-4 text-2xl font-bold">Summary</div>
        <div className="flex flex-col">
          <SummaryItem text="Memory" variant="red" iconSrc={MemoryIcon} percentValue={80} />
          <SummaryItem text="Reaction" variant="yellow" iconSrc={ReactionIcon} percentValue={92} />
          <SummaryItem text="Verbal" variant="green" iconSrc={VerbalIcon} percentValue={61} />
          <SummaryItem text="Visual" variant="blue" iconSrc={VisualIcon} percentValue={72} />
        </div>
        <div className="bg-[#303b59] text-white p-4 rounded-full text-center my-5 hover:bg-[#4032ef] cursor-pointer">
          Continue
        </div>
      </div>
    </div>
  );
}
