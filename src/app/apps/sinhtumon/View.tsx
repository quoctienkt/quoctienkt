"use client";

import { useEffect } from "react";
import { getAssetPathWithBasePath } from "@/utils/assetUtil";
import Script from "next/script";

const appPrefix = "/apps/sinhtumon";

interface ViewProps {
  basePath: string;
}

export default function Page({ basePath }: ViewProps) {
  useEffect(() => {
    document.title = "Game: Sinh tử môn";
    (window as any).appPrefix = appPrefix;
  }, []);

  useEffect(() => {
    (window as any).setupGame(appPrefix);
  }, []);

  return (
    <>
      <section className="app_sinhtumon">
        <canvas id="myCustomCanvas"></canvas>
      </section>

      <Script src={"https://cdn.jsdelivr.net/npm/phaser@3.22.0/dist/phaser.min.js"} strategy="beforeInteractive"></Script>
      <Script src={getAssetPathWithBasePath(basePath, appPrefix, "/js/mazePuzzle.js")} strategy="beforeInteractive"></Script>
      <Script src={getAssetPathWithBasePath(basePath, appPrefix, "/js/core.js")} strategy="beforeInteractive"></Script>
      <Script src={getAssetPathWithBasePath(basePath, appPrefix, "/js/services/gameStateService.js")} strategy="beforeInteractive"></Script>
      <Script src={getAssetPathWithBasePath(basePath, appPrefix, "/js/maps/gameMapServiceBase.js")} strategy="beforeInteractive"></Script>
      <Script src={getAssetPathWithBasePath(basePath, appPrefix, "/js/maps/implements/HoTuThan.js")} strategy="beforeInteractive"></Script>
      <Script src={getAssetPathWithBasePath(basePath, appPrefix, "/js/square.js")} strategy="beforeInteractive"></Script>
      <Script src={getAssetPathWithBasePath(basePath, appPrefix, "/js/monsters/monsterBase.js")} strategy="beforeInteractive"></Script>
      <Script src={getAssetPathWithBasePath(basePath, appPrefix, "/js/monsters/implements/butterfly.js")} strategy="beforeInteractive"></Script>
      <Script src={getAssetPathWithBasePath(basePath, appPrefix, "/js/monsters/implements/thief.js")} strategy="beforeInteractive"></Script>
      <Script src={getAssetPathWithBasePath(basePath, appPrefix, "/js/bullet.js")} strategy="beforeInteractive"></Script>
      <Script src={getAssetPathWithBasePath(basePath, appPrefix, "/js/tower.js")} strategy="beforeInteractive"></Script>
      <Script src={getAssetPathWithBasePath(basePath, appPrefix, "/js/main.js")} strategy="beforeInteractive"></Script>
    </>
  );
}
