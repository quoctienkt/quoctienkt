'use client';

import { useEffect, useRef } from 'react';

const appPrefix = `${process.env.NEXT_PUBLIC_BASE_URL}/sinhtumon`;

export default function Page() {
  const gameRef = useRef<any>(null);

  useEffect(() => {
    document.title = 'Game: Tower Defense';

    // Dynamically import the game module — Phaser requires browser APIs
    let cancelled = false;
    import('./game/main').then(({ startGame }) => {
      if (cancelled) return;
      gameRef.current = startGame(appPrefix, 'myCustomCanvas');
    });

    return () => {
      cancelled = true;
      // Properly destroy the Phaser game instance on unmount
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <section className="app_sinhtumon">
      <canvas id="myCustomCanvas" />
    </section>
  );
}
