import * as C from '../constants';
import type { MonsterConfig, MonsterActionDef } from '../types';

/**
 * Creates a standard set of 4-direction walk animations.
 */
const createWalkActions = (
  frameWidth: number,
  frameHeight: number,
  frameCount = 8,
): MonsterActionDef[] => [
  {
    action: C.MONSTER_ACTION_WALK,
    direction: C.MONSTER_MOVE_DIRECTION_TO_RIGHT,
    frameCount,
    frameWidth,
    frameHeight,
  },
  {
    action: C.MONSTER_ACTION_WALK,
    direction: C.MONSTER_MOVE_DIRECTION_TO_LEFT,
    frameCount,
    frameWidth,
    frameHeight,
  },
  {
    action: C.MONSTER_ACTION_WALK,
    direction: C.MONSTER_MOVE_DIRECTION_TO_TOP,
    frameCount,
    frameWidth,
    frameHeight,
  },
  {
    action: C.MONSTER_ACTION_WALK,
    direction: C.MONSTER_MOVE_DIRECTION_TO_BOTTOM,
    frameCount,
    frameWidth,
    frameHeight,
  },
];

const createAttackActions = (
  frameWidth: number,
  frameHeight: number,
  directions?: string[],
  frameCount = 8,
): MonsterActionDef[] => {
  if (!directions) {
    return [
      {
        action: C.MONSTER_ACTION_ATTACK,
        frameCount,
        frameWidth,
        frameHeight,
      },
    ];
  }
  return directions.map((dir) => ({
    action: C.MONSTER_ACTION_ATTACK,
    direction: dir,
    frameCount,
    frameWidth,
    frameHeight,
  }));
};

const createStandardActions = (
  frameWidth: number,
  frameHeight: number,
  hasAttack = true,
  hasDeath = false,
): MonsterActionDef[] => {
  const dirs = [
    C.MONSTER_MOVE_DIRECTION_TO_RIGHT,
    C.MONSTER_MOVE_DIRECTION_TO_LEFT,
    C.MONSTER_MOVE_DIRECTION_TO_TOP,
    C.MONSTER_MOVE_DIRECTION_TO_BOTTOM,
  ];
  const acts = [...createWalkActions(frameWidth, frameHeight)];
  if (hasAttack) {
    acts.push(...createAttackActions(frameWidth, frameHeight, dirs));
  }
  if (hasDeath) {
    acts.push({
      action: C.MONSTER_ACTION_DEATH,
      frameCount: 8,
      frameWidth,
      frameHeight,
    });
  }
  return acts;
};

/**
 * All monster stat/asset definitions.
 * baseHp + hpScalePerWave * waveNumber = actual HP each wave.
 * Sprites live under public/quoctienkt/sinhtumon/monsters/<Monster_Key>/<Action>_<Direction>.png
 */
export const monstersConfig: Record<string, MonsterConfig> = {
  // ── Ground Monsters ──────────────────────────────────────────────
  [C.MONSTER_GRUNT]: {
    goldOnDead: 15,
    moveType: C.MONSTER_MOVE_TYPE_GROUND,
    armor: 0,
    spriteBaseKey: C.MONSTER_GRUNT,
    actions: createStandardActions(64, 64),
    baseSpeed: 75,
    baseHp: 80,
    hpScalePerWave: 40,
    attackRange: 40,
  },

  [C.MONSTER_ORC]: {
    goldOnDead: 25,
    moveType: C.MONSTER_MOVE_TYPE_GROUND,
    armor: 0,
    spriteBaseKey: C.MONSTER_ORC,
    actions: createStandardActions(64, 64),
    baseSpeed: 60,
    baseHp: 180,
    hpScalePerWave: 65,
    attackRange: 40,
  },

  [C.MONSTER_TROLL]: {
    goldOnDead: 35,
    moveType: C.MONSTER_MOVE_TYPE_GROUND,
    armor: 0.35,
    spriteBaseKey: C.MONSTER_TROLL,
    actions: createStandardActions(64, 64),
    baseSpeed: 40,
    baseHp: 350,
    hpScalePerWave: 120,
    attackRange: 50,
  },

  [C.MONSTER_MUMMY]: {
    goldOnDead: 20,
    moveType: C.MONSTER_MOVE_TYPE_GROUND,
    armor: 0,
    regenPerSec: 8,
    spriteBaseKey: C.MONSTER_MUMMY,
    actions: createStandardActions(64, 64),
    baseSpeed: 55,
    baseHp: 120,
    hpScalePerWave: 50,
    attackRange: 40,
  },

  [C.MONSTER_SPIDER]: {
    goldOnDead: 12,
    moveType: C.MONSTER_MOVE_TYPE_GROUND,
    armor: 0,
    spriteBaseKey: C.MONSTER_SPIDER,
    actions: createStandardActions(64, 64),
    baseSpeed: 115,
    baseHp: 55,
    hpScalePerWave: 22,
    attackRange: 35,
  },

  [C.MONSTER_LARVA]: {
    goldOnDead: 22,
    moveType: C.MONSTER_MOVE_TYPE_GROUND,
    armor: 0.1,
    spriteBaseKey: C.MONSTER_LARVA,
    actions: createStandardActions(64, 64),
    baseSpeed: 45,
    baseHp: 160,
    hpScalePerWave: 55,
    attackRange: 40,
  },

  [C.MONSTER_SKELETON]: {
    goldOnDead: 18,
    moveType: C.MONSTER_MOVE_TYPE_GROUND,
    armor: 0.1,
    spriteBaseKey: C.MONSTER_SKELETON,
    actions: createStandardActions(64, 64),
    baseSpeed: 70,
    baseHp: 80,
    hpScalePerWave: 35,
    attackRange: 40,
  },

  [C.MONSTER_ICE_ELEMENTAL]: {
    goldOnDead: 30,
    moveType: C.MONSTER_MOVE_TYPE_GROUND,
    armor: 0,
    spriteBaseKey: C.MONSTER_ICE_ELEMENTAL,
    actions: createStandardActions(64, 64),
    baseSpeed: 50,
    baseHp: 140,
    hpScalePerWave: 60,
    attackRange: 150, // Ranged
  },

  [C.MONSTER_WOLF]: {
    goldOnDead: 10,
    moveType: C.MONSTER_MOVE_TYPE_GROUND,
    armor: 0,
    spriteBaseKey: C.MONSTER_WOLF,
    actions: createStandardActions(64, 64),
    baseSpeed: 160,
    baseHp: 45,
    hpScalePerWave: 20,
    attackRange: 30,
  },

  // ── Flying Monsters ──────────────────────────────────────────────
  [C.MONSTER_HARPY]: {
    goldOnDead: 10,
    moveType: C.MONSTER_MOVE_TYPE_FLY,
    isFlying: true,
    armor: 0,
    spriteBaseKey: C.MONSTER_HARPY,
    actions: [
      {
        action: C.MONSTER_ACTION_WALK,
        direction: C.MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT,
        frameCount: 8,
        frameWidth: 64,
        frameHeight: 64,
      },
      ...createAttackActions(64, 64),
    ],
    baseSpeed: 90,
    baseHp: 60,
    hpScalePerWave: 28,
    attackRange: 40,
  },

  [C.MONSTER_BAT]: {
    goldOnDead: 8,
    moveType: C.MONSTER_MOVE_TYPE_FLY,
    isFlying: true,
    armor: 0,
    spriteBaseKey: C.MONSTER_BAT,
    actions: [
      {
        action: C.MONSTER_ACTION_WALK,
        direction: C.MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT,
        frameCount: 8,
        frameWidth: 64,
        frameHeight: 64,
      },
      ...createAttackActions(64, 64),
    ],
    baseSpeed: 145,
    baseHp: 35,
    hpScalePerWave: 14,
    attackRange: 30,
  },

  [C.MONSTER_DRAGON]: {
    goldOnDead: 55,
    moveType: C.MONSTER_MOVE_TYPE_FLY,
    isFlying: true,
    armor: 0,
    spriteBaseKey: C.MONSTER_DRAGON,
    actions: [
      {
        action: C.MONSTER_ACTION_WALK,
        direction: C.MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT,
        frameCount: 8,
        frameWidth: 128,
        frameHeight: 128,
      },
      ...createAttackActions(128, 128),
    ],
    baseSpeed: 65,
    baseHp: 400,
    hpScalePerWave: 160,
    attackRange: 80,
  },

  [C.MONSTER_VULTURE]: {
    goldOnDead: 20,
    moveType: C.MONSTER_MOVE_TYPE_FLY,
    isFlying: true,
    armor: 0,
    spriteBaseKey: C.MONSTER_VULTURE,
    actions: [
      {
        action: C.MONSTER_ACTION_WALK,
        direction: C.MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT,
        frameCount: 8,
        frameWidth: 64,
        frameHeight: 64,
      },
      ...createAttackActions(64, 64),
    ],
    baseSpeed: 120,
    baseHp: 65,
    hpScalePerWave: 25,
    attackRange: 60,
  },

  // ── Bosses ───────────────────────────────────────────────────────
  [C.BOSS_GOLEM]: {
    goldOnDead: 150,
    moveType: C.MONSTER_MOVE_TYPE_GROUND,
    isBoss: true,
    armor: 0.25,
    spriteBaseKey: C.BOSS_GOLEM,
    actions: [...createWalkActions(128, 128), ...createAttackActions(128, 128)],

    baseSpeed: 35,
    baseHp: 2000,
    hpScalePerWave: 0,
    attackRange: 70,
  },

  [C.BOSS_DEMON]: {
    goldOnDead: 200,
    moveType: C.MONSTER_MOVE_TYPE_FLY,
    isBoss: true,
    isFlying: true,
    armor: 0.15,
    spriteBaseKey: C.BOSS_DEMON,
    actions: [
      {
        action: C.MONSTER_ACTION_WALK,
        direction: C.MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT,
        frameCount: 8,
        frameWidth: 128,
        frameHeight: 128,
      },
      ...createAttackActions(128, 128),
    ],
    baseSpeed: 50,
    baseHp: 3200,
    hpScalePerWave: 0,
    attackRange: 100,
  },

  [C.BOSS_BEHOLDER]: {
    goldOnDead: 300,
    moveType: C.MONSTER_MOVE_TYPE_FLY,
    isBoss: true,
    isFlying: true,
    armor: 0.1,
    spriteBaseKey: C.BOSS_BEHOLDER,
    actions: [
      {
        action: C.MONSTER_ACTION_WALK,
        direction: C.MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT,
        frameCount: 8,
        frameWidth: 128,
        frameHeight: 128,
      },
      {
        action: C.MONSTER_ACTION_ATTACK,
        frameCount: 16,
        frameWidth: 128,
        frameHeight: 128,
      },
    ],
    baseSpeed: 40,
    baseHp: 4800,
    hpScalePerWave: 0,
    attackRange: 200,
  },
};
