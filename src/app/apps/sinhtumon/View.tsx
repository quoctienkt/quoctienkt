"use client";

import { useEffect } from "react";
import { UseScriptStatus, useScript } from "usehooks-ts";
import { getAssetPathWithBasePath } from "@/utils/assetUtil";

const appPrefix = "/apps/sinhtumon";

interface ViewProps {
  basePath: string;
}

export default function Page({ basePath }: ViewProps) {
  useEffect(() => {
    document.title = "Game: Sinh tử môn";
    (window as any).appPrefix = appPrefix;
  }, []);

  const phaserScriptStatus: UseScriptStatus = useScript(
    "https://cdn.jsdelivr.net/npm/phaser@3.22.0/dist/phaser.min.js"
  );

  const mazePuzzleScriptStatus: UseScriptStatus = useScript(
    getAssetPathWithBasePath(basePath, appPrefix, "/js/mazePuzzle.js")
  );
  const towerScriptStatus: UseScriptStatus = useScript(
    getAssetPathWithBasePath(basePath, appPrefix, "/js/tower.js")
  );
  const squareScriptStatus: UseScriptStatus = useScript(
    getAssetPathWithBasePath(basePath, appPrefix, "/js/square.js")
  );
  const monsterScriptStatus: UseScriptStatus = useScript(
    getAssetPathWithBasePath(basePath, appPrefix, "/js/monster.js")
  );
  const bulletScriptStatus: UseScriptStatus = useScript(
    getAssetPathWithBasePath(basePath, appPrefix, "/js/bullet.js")
  );
  const coreScriptStatus: UseScriptStatus = useScript(
    getAssetPathWithBasePath(basePath, appPrefix, "/js/core.js")
  );
  const stateManagementScriptStatus: UseScriptStatus = useScript(
    getAssetPathWithBasePath(basePath, appPrefix, "/js/stateManagement.js")
  );
  const HoTuThanScriptStatus: UseScriptStatus = useScript(
    getAssetPathWithBasePath(basePath, appPrefix, "/js/maps/HoTuThan.js")
  );
  const mainScriptStatus: UseScriptStatus = useScript(
    getAssetPathWithBasePath(basePath, appPrefix, "/js/main.js")
  );

  useEffect(() => {
    const allScriptsReady =
      phaserScriptStatus === "ready" &&
      mazePuzzleScriptStatus === "ready" &&
      towerScriptStatus === "ready" &&
      squareScriptStatus === "ready" &&
      monsterScriptStatus === "ready" &&
      bulletScriptStatus === "ready" &&
      coreScriptStatus === "ready" &&
      stateManagementScriptStatus === "ready" &&
      HoTuThanScriptStatus === "ready" &&
      mainScriptStatus === "ready";

    if (allScriptsReady) {
      (window as any).setupGame(appPrefix);
    }
  }, [
    phaserScriptStatus,
    mazePuzzleScriptStatus,
    towerScriptStatus,
    squareScriptStatus,
    monsterScriptStatus,
    bulletScriptStatus,
    coreScriptStatus,
    stateManagementScriptStatus,
    HoTuThanScriptStatus,
    mainScriptStatus,
  ]);

  return (
    <>
      <section className="app_sinhtumon">
        <canvas id="myCustomCanvas"></canvas>
      </section>
    </>
  );
}
