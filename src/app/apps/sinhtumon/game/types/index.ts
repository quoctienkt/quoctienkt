// ─── Status Effects ───────────────────────────────────────────────────────────
export interface StatusEffect {
  type: string;
  duration: number; // remaining ms
  speedMultiplier?: number; // 0.5 = half speed
  dotDps?: number; // damage per second (poison)
}

// ─── Tower Configs ────────────────────────────────────────────────────────────
export type TargetPriority = 'first' | 'last' | 'strongest' | 'nearest';

export interface TowerLevelConfig {
  minLevel: number;
  maxLevel: number;
  displayName?: string;
  description?: string;
  upgradeCostPerLevel: number[];
  sellPricePerLevel: number[];
  attackDamagePerLevel: number[];
  attackSpeedPerLevel: number[];
  attackReloadPerLevel: number[];
  attackRangePerLevel: number[];
  towerDisplaySizePerLevel: ([number, number] | null)[];
  ammoDisplaySizePerLevel: ([number, number] | null)[];
  ammoDisplayTintPerLevel: (string | null)[];
  defaultPriority?: TargetPriority;
  splashRadius?: number[];
  chainCount?: number[];
  dotDuration?: number[];
}

/**
 * The actual monster body rect within ONE frame cell.
 * Defines where the real pixels are inside the 64x64 or 128x128 slot.
 */
export interface ContentRect {
  x: number; // left padding to skip
  y: number; // top padding to skip
  w: number; // actual monster body width
  h: number; // actual monster body height
}

/**
 * Definition for one animation strip (e.g. "walk_right")
 */
export interface MonsterActionDef {
  action: string; // 'walk', 'attack', 'skill', 'idle', 'death'
  direction?: string; // 'TO_RIGHT', 'TO_LEFT', etc. (optional for generic actions)
  frameCount: number; // number of frames in the horizontal strip
  frameWidth: number; // width of each frame
  frameHeight: number; // height of each frame
}

/**
 * Framing and scaling data for a monster.
 */
export interface SpriteFrameData {
  contentRect: ContentRect;
  displayScale: number;
}

// ─── Monster Configs ──────────────────────────────────────────────────────────

export interface MonsterConfig {
  goldOnDead: number;
  moveType: string;
  armor?: number; // 0–1 physical damage reduction
  isBoss?: boolean;
  isFlying?: boolean;
  regenPerSec?: number; // HP regeneration per second (mummy)
  spriteBaseKey: string; // The base folder name, e.g. 'Monster_Orc'
  actions: MonsterActionDef[]; // List of available animation strips
  baseSpeed: number;
  baseHp: number;
  hpScalePerWave: number;
  attackRange?: number; // For attack animation trigger
  attackCooldown?: number;
}



// ─── Hero Configs ──────────────────────────────────────────────────────────────
export interface HeroSkillDef {
  skillId: string;
  displayName: string;
  cooldown: number;
}

export interface HeroConfig {
  heroType: string;
  displayName: string;
  maxHp: number;
  attackDamage: number;
  attackRange: number;
  attackReload: number;
  moveSpeed: number;
  spriteKey: string;
  assetPath: string;
  frameWidth: number;
  frameHeight: number;
  respawnDelay: number;
  skills: HeroSkillDef[];
}

// ─── Skill Configs ─────────────────────────────────────────────────────────────
export interface SkillConfig {
  skillId: string;
  displayName: string;
  description: string;
  cooldown: number;
  iconKey: string;
}

// ─── Wave Definitions ─────────────────────────────────────────────────────────
export interface SpawnGroup {
  type: string;
  count: number;
  interval: number; // ms between each spawn in the group
  delay?: number; // ms before this group starts spawning
}

export interface WaveDefinition {
  waveNumber: number;
  prewaveDelay?: number; // delay before this wave starts
  spawns: SpawnGroup[];
}

// ─── Shared Game Config ───────────────────────────────────────────────────────
export interface GameCoreConfig {
  towers: Record<string, TowerLevelConfig>;
  monsters: Record<string, MonsterConfig>;
}

// ─── Save / State ─────────────────────────────────────────────────────────────
export interface SavedData {
  towers: any[];
  monsters: any[];
  bullets: any[];
  heroes: any[];
  wave: number;
  life: number;
  gold: number;
  score: number;
  mapKey: string;
}

// ─── Map Config ───────────────────────────────────────────────────────────────
export interface GameMapConfig {
  mapKey: string;
  map: number[][];
  GAME_BOARD_PADDING_TOP: number;
  CELL_WIDTH: number;
  CELL_HEIGHT: number;
  START_POSITION: [number, number];
  END_POSITION: [number, number];
  CELL_AVAILABLE: number;
  CELL_BLOCKED: number;
  backgroundKey: string;
  displayName: string;
  totalWaves: number;
}

// ─── Ammo Data ────────────────────────────────────────────────────────────────
export interface AmmoData {
  attackDamage: number;
  attackSpeed: number;
  attackReload: number;
  ammoDisplaySize: [number, number] | null;
  ammoDisplayTint: string | null;
  splashRadius?: number;
  damageType?: string;
  dotDuration?: number;
  chainCount?: number;
}
