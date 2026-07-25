'use client';

import { useEffect, useRef, useState } from 'react';

export default function Page() {
  const gameRef = useRef<any>(null);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    document.title = 'Kingdom Rush — Tower Defense';

    const checkOrientation = () => {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      setIsPortrait(isMobile && window.innerHeight > window.innerWidth);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

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

    const lockScreen = () => {
      if (screen.orientation && (screen.orientation as any).lock) {
        (screen.orientation as any).lock('landscape').catch(() => {});
      }
    };
    window.addEventListener('pointerdown', lockScreen, { once: true });

    return () => {
      gameRef.current?.destroy(false);
      gameRef.current = null;
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      window.removeEventListener('pointerdown', lockScreen);
    };
  }, []);

  return (
    <section className="relative w-screen h-screen bg-[#050711] overflow-hidden flex items-center justify-center p-2 sm:p-4">
      <div
        className="relative flex justify-center items-center w-full h-full"
        style={{
          maxWidth: 'min(640px, calc(92vh * 560 / 680))',
          aspectRatio: '560/680',
        }}
      >
        <canvas
          id="myCustomCanvas"
          className="w-full h-full object-contain block bg-[#0a0e1a] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.85)] border border-slate-800/80"
        />
      </div>

      {isPortrait && (
        <div className="absolute inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0e1a]/95 text-white p-6 text-center">
          <div className="animate-bounce mb-6 text-5xl">🔄</div>
          <h2 className="text-2xl font-bold mb-2 font-serif text-[#4af7a0]">
            Rotate Your Device
          </h2>
          <p className="text-slate-400 max-w-xs text-sm">
            Please rotate your device to landscape (horizontal) mode for the
            best gaming experience.
          </p>
        </div>
      )}
    </section>
  );
}
