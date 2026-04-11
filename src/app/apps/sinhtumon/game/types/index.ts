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

// ─── Monster Configs ──────────────────────────────────────────────────────────
export interface MonsterWalkFrames {
  right?: [number, number];
  left?: [number, number];
  up?: [number, number];
  down?: [number, number];
  fly?: [number, number]; // single-direction for flying monsters
}

export interface MonsterConfig {
  goldOnDead: number;
  moveType: string;
  armor?: number; // 0–1 physical damage reduction
  isBoss?: boolean;
  isFlying?: boolean;
  regenPerSec?: number; // HP regeneration per second (mummy)
  spriteKey: string;
  assetPath: string;
  frameWidth: number;
  frameHeight: number;
  displayWidth?: number;
  displayHeight?: number;
  hitCircleRadius?: number;
  hitCircleOffsetX?: number;
  hitCircleOffsetY?: number;
  walkFrames: MonsterWalkFrames;
  deathFrames?: [number, number];
  baseSpeed: number;
  baseHp: number;
  hpScalePerWave: number;
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
