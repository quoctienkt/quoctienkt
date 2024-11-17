"use client";

import UserList from "@/components/UserList";
import { TEST } from "@quoctienkt/abc-module/src/utils/constants";
// import App from "@quoctienkt/abc-module/src/App";
import { useState } from "react";
import React from "react";

export default function Page() {
  const [count, setCount] = useState(0);

  return (
    <>
      <UserList />
      <br />
      <section className="flex justify-center w-full h-full bg-[#ffffff] overflow-auto relative sm:items-center">
        <div className="sm:w-[721px] h-fit">
          {TEST}
          <br />
          {count}
        </div>
      </section>

      {/* <App /> */}
    </>
  );
}
