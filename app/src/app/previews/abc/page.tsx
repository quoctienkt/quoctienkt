// "use client"

import { TEST } from "@quoctienkt/abc-module/src/utils/constants";
// import App from "@quoctienkt/abc-module/src/App";

export default function Page() {
  return (
    <>
      <section className="flex justify-center w-full h-full bg-[#ffffff] overflow-auto relative sm:items-center">
        <div className="sm:w-[721px] h-fit">{TEST}</div>
      </section>
      {/* <App /> */}
    </>
  );
}
