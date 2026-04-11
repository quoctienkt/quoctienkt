import * as C from '../constants';
import type { WaveDefinition } from '../types';

/**
 * Scripted wave definitions per map.
 * Each map has 20 waves. Bosses appear at waves 10 and 20.
 * Flying + ground mixes start at wave 5.
 */

// Helper: quick spawn group builder
function sg(type: string, count: number, interval = 650, delay = 0) {
  return { type, count, interval, delay };
}

// ─── Crossroads ──────────────────────────────────────────────────────────────
const CROSSROADS_WAVES: WaveDefinition[] = [
  { waveNumber: 1, spawns: [sg(C.MONSTER_GRUNT, 8)] },
  { waveNumber: 2, spawns: [sg(C.MONSTER_GRUNT, 12)] },
  {
    waveNumber: 3,
    spawns: [sg(C.MONSTER_GRUNT, 10), sg(C.MONSTER_MUMMY, 4, 800, 3000)],
  },
  {
    waveNumber: 4,
    spawns: [sg(C.MONSTER_GRUNT, 8), sg(C.MONSTER_HARPY, 6, 700)],
  },
  {
    waveNumber: 5,
    spawns: [sg(C.MONSTER_ORC, 6), sg(C.MONSTER_HARPY, 8, 600)],
  },
  {
    waveNumber: 6,
    spawns: [sg(C.MONSTER_ORC, 8), sg(C.MONSTER_GRUNT, 6, 500, 4000)],
  },
  {
    waveNumber: 7,
    spawns: [sg(C.MONSTER_MUMMY, 10), sg(C.MONSTER_BAT, 8, 400)],
  },
  {
    waveNumber: 8,
    spawns: [sg(C.MONSTER_SPIDER, 12), sg(C.MONSTER_ORC, 5, 800, 5000)],
  },
  {
    waveNumber: 9,
    spawns: [sg(C.MONSTER_TROLL, 4, 1200), sg(C.MONSTER_HARPY, 10, 500, 2000)],
  },
  {
    waveNumber: 10,
    spawns: [sg(C.BOSS_GOLEM, 1, 0), sg(C.MONSTER_GRUNT, 15, 400, 3000)],
  },
  {
    waveNumber: 11,
    spawns: [sg(C.MONSTER_TROLL, 5, 1000), sg(C.MONSTER_BAT, 15, 350)],
  },
  {
    waveNumber: 12,
    spawns: [sg(C.MONSTER_ORC, 12), sg(C.MONSTER_SPIDER, 10, 400, 3000)],
  },
  {
    waveNumber: 13,
    spawns: [sg(C.MONSTER_DRAGON, 3, 2000), sg(C.MONSTER_GRUNT, 15, 400, 2000)],
  },
  {
    waveNumber: 14,
    spawns: [sg(C.MONSTER_TROLL, 6, 1000), sg(C.MONSTER_MUMMY, 8, 600, 4000)],
  },
  {
    waveNumber: 15,
    spawns: [sg(C.MONSTER_DRAGON, 4, 1800), sg(C.MONSTER_ORC, 10, 600, 3000)],
  },
  {
    waveNumber: 16,
    spawns: [sg(C.MONSTER_SPIDER, 20, 300), sg(C.MONSTER_TROLL, 4, 1200, 6000)],
  },
  {
    waveNumber: 17,
    spawns: [sg(C.MONSTER_DRAGON, 5, 1500), sg(C.MONSTER_BAT, 20, 300, 2000)],
  },
  {
    waveNumber: 18,
    spawns: [sg(C.MONSTER_TROLL, 8, 900), sg(C.MONSTER_ORC, 12, 500, 5000)],
  },
  {
    waveNumber: 19,
    spawns: [
      sg(C.MONSTER_DRAGON, 6, 1200),
      sg(C.MONSTER_TROLL, 5, 1000, 8000),
      sg(C.MONSTER_BAT, 15, 300, 3000),
    ],
  },
  {
    waveNumber: 20,
    spawns: [sg(C.BOSS_DEMON, 1, 0), sg(C.MONSTER_ORC, 20, 350, 5000)],
  },
];

// ─── Volcano ─────────────────────────────────────────────────────────────────
const VOLCANO_WAVES: WaveDefinition[] = [
  { waveNumber: 1, spawns: [sg(C.MONSTER_ORC, 8)] },
  {
    waveNumber: 2,
    spawns: [sg(C.MONSTER_ORC, 12), sg(C.MONSTER_HARPY, 4, 700)],
  },
  {
    waveNumber: 3,
    spawns: [sg(C.MONSTER_TROLL, 3, 1200), sg(C.MONSTER_ORC, 8, 600, 3000)],
  },
  {
    waveNumber: 4,
    spawns: [sg(C.MONSTER_DRAGON, 2, 2500), sg(C.MONSTER_ORC, 12, 500, 3000)],
  },
  {
    waveNumber: 5,
    spawns: [sg(C.MONSTER_TROLL, 5, 1000), sg(C.MONSTER_DRAGON, 2, 2000, 5000)],
  },
  {
    waveNumber: 6,
    spawns: [sg(C.MONSTER_ORC, 15), sg(C.MONSTER_SPIDER, 10, 400, 4000)],
  },
  {
    waveNumber: 7,
    spawns: [sg(C.MONSTER_DRAGON, 4, 1800), sg(C.MONSTER_TROLL, 4, 1100, 4000)],
  },
  {
    waveNumber: 8,
    spawns: [sg(C.MONSTER_TROLL, 8, 900), sg(C.MONSTER_BAT, 18, 320, 2000)],
  },
  {
    waveNumber: 9,
    spawns: [sg(C.MONSTER_DRAGON, 5, 1500), sg(C.MONSTER_ORC, 15, 450, 3000)],
  },
  {
    waveNumber: 10,
    spawns: [sg(C.BOSS_GOLEM, 1, 0), sg(C.MONSTER_DRAGON, 3, 2000, 5000)],
  },
  {
    waveNumber: 11,
    spawns: [sg(C.MONSTER_TROLL, 8, 800), sg(C.MONSTER_DRAGON, 4, 1600, 5000)],
  },
  {
    waveNumber: 12,
    spawns: [sg(C.MONSTER_ORC, 18), sg(C.MONSTER_BAT, 22, 280, 3000)],
  },
  {
    waveNumber: 13,
    spawns: [sg(C.MONSTER_DRAGON, 6, 1400), sg(C.MONSTER_TROLL, 6, 900, 5000)],
  },
  {
    waveNumber: 14,
    spawns: [sg(C.MONSTER_TROLL, 10, 750), sg(C.MONSTER_SPIDER, 18, 300, 4000)],
  },
  {
    waveNumber: 15,
    spawns: [sg(C.MONSTER_DRAGON, 7, 1200), sg(C.MONSTER_ORC, 18, 400, 5000)],
  },
  {
    waveNumber: 16,
    spawns: [sg(C.MONSTER_TROLL, 12, 700), sg(C.MONSTER_DRAGON, 5, 1500, 8000)],
  },
  {
    waveNumber: 17,
    spawns: [sg(C.MONSTER_BAT, 30, 250), sg(C.MONSTER_TROLL, 8, 800, 5000)],
  },
  {
    waveNumber: 18,
    spawns: [sg(C.MONSTER_DRAGON, 8, 1100), sg(C.MONSTER_TROLL, 10, 700, 8000)],
  },
  {
    waveNumber: 19,
    spawns: [
      sg(C.BOSS_GOLEM, 1, 0),
      sg(C.MONSTER_DRAGON, 6, 1300, 4000),
      sg(C.MONSTER_TROLL, 10, 700, 10000),
    ],
  },
  {
    waveNumber: 20,
    spawns: [sg(C.BOSS_DEMON, 1, 0), sg(C.MONSTER_DRAGON, 10, 1000, 6000)],
  },
];

// ─── Ice Valley ───────────────────────────────────────────────────────────────
const ICE_VALLEY_WAVES: WaveDefinition[] = [
  { waveNumber: 1, spawns: [sg(C.MONSTER_GRUNT, 10)] },
  {
    waveNumber: 2,
    spawns: [sg(C.MONSTER_GRUNT, 15), sg(C.MONSTER_SPIDER, 5, 500, 3000)],
  },
  {
    waveNumber: 3,
    spawns: [sg(C.MONSTER_MUMMY, 8), sg(C.MONSTER_BAT, 8, 450)],
  },
  {
    waveNumber: 4,
    spawns: [sg(C.MONSTER_SPIDER, 15), sg(C.MONSTER_GRUNT, 10, 500, 5000)],
  },
  {
    waveNumber: 5,
    spawns: [sg(C.MONSTER_MUMMY, 12), sg(C.MONSTER_BAT, 12, 400, 2000)],
  },
  {
    waveNumber: 6,
    spawns: [sg(C.MONSTER_ORC, 8), sg(C.MONSTER_SPIDER, 15, 380, 3000)],
  },
  {
    waveNumber: 7,
    spawns: [sg(C.MONSTER_BAT, 20), sg(C.MONSTER_ORC, 8, 700, 5000)],
  },
  {
    waveNumber: 8,
    spawns: [sg(C.MONSTER_MUMMY, 15), sg(C.MONSTER_TROLL, 4, 1200, 4000)],
  },
  {
    waveNumber: 9,
    spawns: [sg(C.MONSTER_SPIDER, 20), sg(C.MONSTER_HARPY, 10, 500, 4000)],
  },
  {
    waveNumber: 10,
    spawns: [sg(C.BOSS_GOLEM, 1, 0), sg(C.MONSTER_SPIDER, 20, 350, 4000)],
  },
  {
    waveNumber: 11,
    spawns: [sg(C.MONSTER_TROLL, 6, 950), sg(C.MONSTER_BAT, 20, 320, 3000)],
  },
  {
    waveNumber: 12,
    spawns: [sg(C.MONSTER_ORC, 15), sg(C.MONSTER_MUMMY, 12, 600, 5000)],
  },
  {
    waveNumber: 13,
    spawns: [sg(C.MONSTER_HARPY, 15), sg(C.MONSTER_TROLL, 6, 950, 5000)],
  },
  {
    waveNumber: 14,
    spawns: [
      sg(C.MONSTER_DRAGON, 3, 2000),
      sg(C.MONSTER_SPIDER, 20, 320, 4000),
    ],
  },
  {
    waveNumber: 15,
    spawns: [sg(C.MONSTER_TROLL, 8, 850), sg(C.MONSTER_DRAGON, 3, 1800, 7000)],
  },
  {
    waveNumber: 16,
    spawns: [sg(C.MONSTER_MUMMY, 20), sg(C.MONSTER_DRAGON, 4, 1700, 8000)],
  },
  {
    waveNumber: 17,
    spawns: [sg(C.MONSTER_DRAGON, 5, 1500), sg(C.MONSTER_TROLL, 8, 800, 6000)],
  },
  {
    waveNumber: 18,
    spawns: [sg(C.MONSTER_BAT, 35, 240), sg(C.MONSTER_TROLL, 10, 750, 8000)],
  },
  {
    waveNumber: 19,
    spawns: [sg(C.MONSTER_DRAGON, 7, 1300), sg(C.MONSTER_TROLL, 10, 750, 9000)],
  },
  {
    waveNumber: 20,
    spawns: [
      sg(C.BOSS_DEMON, 1, 0),
      sg(C.MONSTER_BAT, 35, 240, 5000),
      sg(C.MONSTER_DRAGON, 8, 1200, 10000),
    ],
  },
];

// ─── Cursed Forest ────────────────────────────────────────────────────────────
const CURSED_FOREST_WAVES: WaveDefinition[] = [
  { waveNumber: 1, spawns: [sg(C.MONSTER_GRUNT, 12)] },
  {
    waveNumber: 2,
    spawns: [sg(C.MONSTER_GRUNT, 10), sg(C.MONSTER_HARPY, 6, 650)],
  },
  { waveNumber: 3, spawns: [sg(C.MONSTER_ORC, 8), sg(C.MONSTER_BAT, 8, 450)] },
  {
    waveNumber: 4,
    spawns: [sg(C.MONSTER_SPIDER, 12), sg(C.MONSTER_HARPY, 10, 550)],
  },
  {
    waveNumber: 5,
    spawns: [sg(C.MONSTER_MUMMY, 10), sg(C.MONSTER_ORC, 8, 700, 3000)],
  },
  {
    waveNumber: 6,
    spawns: [sg(C.MONSTER_ORC, 12), sg(C.MONSTER_DRAGON, 2, 2200, 4000)],
  },
  {
    waveNumber: 7,
    spawns: [sg(C.MONSTER_TROLL, 5, 1100), sg(C.MONSTER_BAT, 18, 320, 2000)],
  },
  {
    waveNumber: 8,
    spawns: [sg(C.MONSTER_SPIDER, 18), sg(C.MONSTER_DRAGON, 3, 1900, 5000)],
  },
  {
    waveNumber: 9,
    spawns: [sg(C.MONSTER_TROLL, 7, 950), sg(C.MONSTER_HARPY, 15, 450, 3000)],
  },
  {
    waveNumber: 10,
    spawns: [sg(C.BOSS_GOLEM, 1, 0), sg(C.MONSTER_HARPY, 20, 380, 3000)],
  },
  {
    waveNumber: 11,
    spawns: [sg(C.MONSTER_DRAGON, 4, 1800), sg(C.MONSTER_TROLL, 6, 950, 5000)],
  },
  {
    waveNumber: 12,
    spawns: [sg(C.MONSTER_ORC, 20), sg(C.MONSTER_DRAGON, 4, 1700, 6000)],
  },
  {
    waveNumber: 13,
    spawns: [sg(C.MONSTER_TROLL, 8, 850), sg(C.MONSTER_SPIDER, 22, 320, 4000)],
  },
  {
    waveNumber: 14,
    spawns: [sg(C.MONSTER_DRAGON, 5, 1600), sg(C.MONSTER_MUMMY, 15, 550, 5000)],
  },
  {
    waveNumber: 15,
    spawns: [sg(C.BOSS_GOLEM, 1, 0), sg(C.MONSTER_DRAGON, 5, 1500, 4000)],
  },
  {
    waveNumber: 16,
    spawns: [sg(C.MONSTER_TROLL, 12, 750), sg(C.MONSTER_BAT, 28, 260, 4000)],
  },
  {
    waveNumber: 17,
    spawns: [sg(C.MONSTER_DRAGON, 7, 1300), sg(C.MONSTER_TROLL, 8, 800, 7000)],
  },
  {
    waveNumber: 18,
    spawns: [sg(C.MONSTER_ORC, 25), sg(C.MONSTER_DRAGON, 6, 1400, 6000)],
  },
  {
    waveNumber: 19,
    spawns: [sg(C.BOSS_GOLEM, 2, 5000), sg(C.MONSTER_DRAGON, 8, 1200, 8000)],
  },
  {
    waveNumber: 20,
    spawns: [
      sg(C.BOSS_DEMON, 1, 0),
      sg(C.BOSS_GOLEM, 1, 0, 6000),
      sg(C.MONSTER_DRAGON, 10, 1100, 10000),
    ],
  },
];

export const wavesConfig: Record<string, WaveDefinition[]> = {
  [C.MAP_CROSSROADS]: CROSSROADS_WAVES,
  [C.MAP_VOLCANO]: VOLCANO_WAVES,
  [C.MAP_ICE_VALLEY]: ICE_VALLEY_WAVES,
  [C.MAP_CURSED_FOREST]: CURSED_FOREST_WAVES,
};
