'use client';

import { useEffect, useRef, useState } from 'react';

export default function Page() {
  const gameRef = useRef<any>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [selectedMonster, setSelectedMonster] = useState('Monster_Grunt');
  const [spawnCount, setSpawnCount] = useState(10);

  const monsters = [
    { type: 'Monster_Grunt', label: 'Grunt (🐗)' },
    { type: 'Monster_Orc', label: 'Orc (👹)' },
    { type: 'Monster_Troll', label: 'Troll (👹)' },
    { type: 'Monster_Mummy', label: 'Mummy (🧟)' },
    { type: 'Monster_Spider', label: 'Spider (🕷)' },
    { type: 'Monster_Larva', label: 'Larva (🐛)' },
    { type: 'Monster_Harpy', label: 'Harpy (🦅)' },
    { type: 'Monster_Bat', label: 'Bat (🦇)' },
    { type: 'Monster_Skeleton', label: 'Skeleton (💀)' },
    { type: 'Monster_IceElemental', label: 'Ice Elemental (❄️)' },
    { type: 'Monster_Wolf', label: 'Wolf (🐺)' },
    { type: 'Monster_Vulture', label: 'Vulture (🦅)' },
    { type: 'Boss_Golem', label: 'Golem Boss (🪨)' },
    { type: 'Boss_Demon', label: 'Demon Boss (😈)' },
    { type: 'Boss_Beholder', label: 'Beholder Boss (👁)' },
  ];

  useEffect(() => {
    document.title = 'Kingdom Rush — Tower Defense';

    const checkOrientation = () => {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      setIsMobileDevice(isMobile);
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

  const emitDevEvent = (eventName: string, payload?: any) => {
    const eventBus = gameRef.current?.registry.get('eventBus');
    if (eventBus) {
      eventBus.emit(eventName, payload);
    } else {
      console.warn(`[DevTool] EventBus not ready yet to emit ${eventName}`);
    }
  };

  return (
    <section className="relative w-screen h-screen overflow-hidden flex items-center justify-center p-0 md:p-4 bg-[#050711]">
      <style>{`
        .game-container {
          width: calc(100vh * 680 / 760);
          max-width: 100vw;
          height: 100vh;
        }
        @media (min-width: 768px) {
          .game-container {
            width: 100%;
            max-width: min(960px, calc(88vh * 680 / 760));
            height: auto;
          }
        }
      `}</style>

      <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-6 w-full max-w-5xl h-full md:h-auto">
        {/* Game Canvas Container */}
        <div
          className="relative flex justify-center items-center game-container"
          style={{
            aspectRatio: '680/760',
          }}
        >
          <canvas
            id="myCustomCanvas"
            className="w-full h-full object-contain block bg-[#0a0e1a] rounded-none md:rounded-xl overflow-hidden shadow-none md:shadow-[0_0_50px_rgba(0,0,0,0.85)] border-0 md:border md:border-slate-800/80"
          />
        </div>

        {/* Developer Controls Panel (Placed to the right) */}
        {!isMobileDevice && (
          <div className="hidden md:flex w-full md:w-64 bg-[#0a0f1d]/90 backdrop-blur-md rounded-xl p-4 border border-slate-800 flex-col gap-4 text-white shadow-2xl">
            <div>
              <h3 className="text-md font-bold text-[#4af7a0] font-serif border-b border-slate-800 pb-2 mb-2 flex items-center gap-2">
                🛠️ Developer Panel
              </h3>
              <p className="text-slate-400 text-xs">Test spawner, cheat codes, and values here.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-bold">SPAWN MONSTER</label>
              <select
                value={selectedMonster}
                onChange={(e) => setSelectedMonster(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded p-2 outline-none focus:border-[#4af7a0]"
              >
                {monsters.map((m) => (
                  <option key={m.type} value={m.type}>
                    {m.label}
                  </option>
                ))}
              </select>
              
              <label className="text-xs text-slate-400 font-bold mt-1">SPAWN COUNT</label>
              <input
                type="number"
                min="1"
                max="100"
                value={spawnCount}
                onChange={(e) => setSpawnCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded p-2 outline-none focus:border-[#4af7a0]"
              />

              <button
                onClick={() => emitDevEvent('DEV_SPAWN_MONSTER', { type: selectedMonster, count: spawnCount })}
                className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] text-[#4af7a0] border border-[#2d6a4f] rounded py-1.5 px-3 text-xs font-bold transition duration-150"
              >
                ⚡ Spawn Selected
              </button>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              <label className="text-xs text-slate-400 font-bold">RESOURCES</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => emitDevEvent('DEV_ADD_GOLD', { amount: 100 })}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-yellow-400 rounded py-1.5 px-3 text-xs font-bold transition duration-150 text-center"
                >
                  +100 Gold
                </button>
                <button
                  onClick={() => emitDevEvent('DEV_CLEAR_MONSTERS')}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-blue-400 rounded py-1.5 px-3 text-xs font-bold transition duration-150 text-center"
                >
                  🧹 Clear Mobs
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-1 border-t border-slate-800/80 pt-4">
              <label className="text-xs text-slate-400 font-bold">CHEAT CODES</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => emitDevEvent('DEV_TRIGGER_VICTORY')}
                  className="bg-[#112a46] hover:bg-[#1a3f66] text-blue-300 border border-blue-800 rounded py-1.5 px-3 text-xs font-bold transition duration-150 text-center"
                >
                  🏆 Win Game
                </button>
                <button
                  onClick={() => emitDevEvent('DEV_TRIGGER_DEFEAT')}
                  className="bg-[#4a1212] hover:bg-[#661a1a] text-red-300 border border-red-900 rounded py-1.5 px-3 text-xs font-bold transition duration-150 text-center"
                >
                  💀 Die Instantly
                </button>
              </div>
            </div>
          </div>
        )}
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
