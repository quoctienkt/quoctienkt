import { TEST } from "abc-module/src/utils/constants";

export default function Page() {
  return (
    <section className="flex justify-center w-full h-full bg-[#ffffff] overflow-auto relative sm:items-center">
      <div className="sm:w-[721px] h-fit">{TEST}</div>
    </section>
  );
}
