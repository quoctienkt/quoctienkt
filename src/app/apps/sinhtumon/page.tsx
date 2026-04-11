'use client';

import { useEffect, useRef } from 'react';

export default function Page() {
  const gameRef = useRef<any>(null);

  useEffect(() => {
    document.title = 'Kingdom Rush — Tower Defense';

    const canvas = document.getElementById(
      'myCustomCanvas',
    ) as HTMLCanvasElement;
    if (!canvas) return;

    // Dynamic import keeps Phaser (~3MB) out of the initial bundle.
    // It only loads when the user visits this page.
    import('./game').then(({ createGame }) => {
      if (!gameRef.current) {
        gameRef.current = createGame(canvas);
      }
    });

    return () => {
      gameRef.current?.destroy(false);
      gameRef.current = null;
    };
  }, []);

  return (
    <section className="app_sinhtumon justify-center flex items-center min-h-screen">
      <canvas id="myCustomCanvas" />
    </section>
  );
}
