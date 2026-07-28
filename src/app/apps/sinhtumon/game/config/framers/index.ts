import type { SpriteFrameData } from '../../types';
import * as C from '../../constants';

const RECT_64 = { x: 0, y: 0, w: 64, h: 64 };
const RECT_128 = { x: 0, y: 0, w: 128, h: 128 };
const RECT_MUMMY = { x: 0, y: 0, w: 37, h: 45 };

export const SpriteFrameRegistry: Record<string, SpriteFrameData> = {
  // ── Existing ───────────────────────────────────────────────────
  [C.MONSTER_GRUNT]: { contentRect: RECT_64, displayScale: 0.55 },
  [C.MONSTER_ORC]: { contentRect: RECT_64, displayScale: 0.6 },
  [C.MONSTER_TROLL]: { contentRect: RECT_64, displayScale: 0.65 },
  [C.MONSTER_MUMMY]: { contentRect: RECT_MUMMY, displayScale: 0.75 },
  [C.MONSTER_SPIDER]: { contentRect: RECT_64, displayScale: 0.5 },
  [C.MONSTER_LARVA]: { contentRect: RECT_64, displayScale: 0.55 },
  [C.MONSTER_HARPY]: { contentRect: RECT_64, displayScale: 0.5 },
  [C.MONSTER_BAT]: { contentRect: RECT_64, displayScale: 0.45 },
  [C.MONSTER_DRAGON]: { contentRect: RECT_128, displayScale: 0.35 },
  [C.BOSS_GOLEM]: { contentRect: RECT_128, displayScale: 0.35 },
  [C.BOSS_DEMON]: { contentRect: RECT_128, displayScale: 0.35 },

  // ── New 5 Monsters ─────────────────────────────────────────────
  [C.MONSTER_SKELETON]: { contentRect: RECT_64, displayScale: 0.55 },
  [C.MONSTER_ICE_ELEMENTAL]: { contentRect: RECT_64, displayScale: 0.6 },
  [C.MONSTER_WOLF]: { contentRect: RECT_64, displayScale: 0.5 },
  [C.MONSTER_VULTURE]: { contentRect: RECT_64, displayScale: 0.5 },
  [C.BOSS_BEHOLDER]: { contentRect: RECT_128, displayScale: 0.28 },
};
