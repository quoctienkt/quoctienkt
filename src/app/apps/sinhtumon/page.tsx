"use client";

import { useEffect } from "react";
import { UseScriptStatus, useScript } from "usehooks-ts";
import urlJoin from "url-join";

const appPrefix = `${process.env.NEXT_PUBLIC_BASE_URL}/sinhtumon`;

export default function Page() {
  useEffect(() => {
    document.title = "Game: Sinh tử môn";
    (window as any).appPrefix = appPrefix;
  }, []);

  const phaserScriptStatus: UseScriptStatus = useScript(
    "https://cdn.jsdelivr.net/npm/phaser@3.22.0/dist/phaser.min.js"
  );

  const mazePuzzleScriptStatus: UseScriptStatus = useScript(
    urlJoin(appPrefix, "/js/mazePuzzle.js")
  );
  const towerScriptStatus: UseScriptStatus = useScript(
    urlJoin(appPrefix, "/js/tower.js")
  );
  const squareScriptStatus: UseScriptStatus = useScript(
    urlJoin(appPrefix, "/js/square.js")
  );

  const monsterBaseScriptStatus: UseScriptStatus = useScript(
    urlJoin(appPrefix, "/js/monsters/monsterBase.js")
  );

  const monsterButterflyScriptStatus: UseScriptStatus = useScript(
    urlJoin(appPrefix, "/js/monsters/implements/butterfly.js")
  );

  const monsterThiefScriptStatus: UseScriptStatus = useScript(
    urlJoin(appPrefix, "/js/monsters/implements/thief.js")
  );

  const bulletScriptStatus: UseScriptStatus = useScript(
    urlJoin(appPrefix, "/js/bullet.js")
  );
  const coreScriptStatus: UseScriptStatus = useScript(
    urlJoin(appPrefix, "/js/core.js")
  );
  const gameStateServiceScriptStatus: UseScriptStatus = useScript(
    urlJoin(appPrefix, "/js//services/gameStateService.js")
  );
  const gameMapServiceBaseScriptStatus: UseScriptStatus = useScript(
    urlJoin(appPrefix, "/js/maps/gameMapServiceBase.js")
  );
  const HoTuThanScriptStatus: UseScriptStatus = useScript(
    urlJoin(appPrefix, "/js/maps/implements/HoTuThan.js")
  );
  const mainScriptStatus: UseScriptStatus = useScript(
    urlJoin(appPrefix, "/js/main.js")
  );

  useEffect(() => {
    const allScriptsReady =
      phaserScriptStatus === "ready" &&
      mazePuzzleScriptStatus === "ready" &&
      towerScriptStatus === "ready" &&
      squareScriptStatus === "ready" &&
      monsterBaseScriptStatus === "ready" &&
      monsterButterflyScriptStatus === "ready" &&
      monsterThiefScriptStatus === "ready" &&
      bulletScriptStatus === "ready" &&
      coreScriptStatus === "ready" &&
      gameStateServiceScriptStatus === "ready" &&
      gameMapServiceBaseScriptStatus === "ready" &&
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
    monsterBaseScriptStatus,
    monsterButterflyScriptStatus,
    monsterThiefScriptStatus,
    bulletScriptStatus,
    coreScriptStatus,
    gameStateServiceScriptStatus,
    gameMapServiceBaseScriptStatus,
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
