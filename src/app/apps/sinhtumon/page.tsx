"use client";

import { AppScript } from "@/components/core_components/script/Script";
import Script from "next/script";
import { useEffect } from "react";

const appPrefix = "/apps/sinhtumon";
export default function Page() {
  useEffect(() => {
    document.title = "Game: Sinh tử môn";
    (window as any).appPrefix = appPrefix;

    setTimeout(() => {
      (window as any).setupGame(appPrefix);
    }, 3000);
  }, []);

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/phaser@3.22.0/dist/phaser.min.js"></Script>
      <AppScript src={`${appPrefix}/js/mazePuzzle.js`}></AppScript>
      <AppScript src={`${appPrefix}/js/tower.js`}></AppScript>
      <AppScript src={`${appPrefix}/js/square.js`}></AppScript>
      <AppScript src={`${appPrefix}/js/monster.js`}></AppScript>
      <AppScript src={`${appPrefix}/js/bullet.js`}></AppScript>
      <AppScript src={`${appPrefix}/js/main.js`}></AppScript>

      <section className="app_sinhtumon">
        <canvas id="myCustomCanvas"></canvas>
      </section>
    </>
  );
}
