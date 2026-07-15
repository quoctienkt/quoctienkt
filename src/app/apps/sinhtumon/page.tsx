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
    <section className="app_sinhtumon justify-center flex items-center min-h-screen bg-[#050711] p-2 sm:p-4">
      <div 
        className="relative flex justify-center items-center w-full aspect-[720/680] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.85)] border border-slate-800/80"
        style={{ maxWidth: 'min(720px, calc(92vh * 720 / 680))' }}
      >
        <canvas id="myCustomCanvas" className="w-full h-full object-contain block bg-[#0a0e1a]" />
      </div>
    </section>
  );
}
