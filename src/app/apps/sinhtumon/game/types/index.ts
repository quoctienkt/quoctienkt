export interface TowerLevelConfig {
  upgradeCostPerLevel: number[];
  sellPricePerLevel: number[];
  attackDamagePerLevel: number[];
  attackSpeedPerLevel: number[];
  attackReloadPerLevel: number[];
  attackRangePerLevel: number[];
  towerDisplaySizePerLevel: ([number, number] | null)[];
  ammoDisplaySizePerLevel: ([number, number] | null)[];
  ammoDisplayTintPerLevel: (string | null)[];
  minLevel: number;
  maxLevel: number;
}

export interface MonsterConfig {
  goldOnDead: number;
  moveType: string;
}

export interface GameCoreConfig {
  towers: Record<string, TowerLevelConfig>;
  monsters: Record<string, MonsterConfig>;
}

export interface SavedData {
  towers: any[];
  monsters: any[];
  bullets: any[];
  wave: number;
  life: number;
  gold: number;
}

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
}

export interface AmmoData {
  attackDamage: number;
  attackSpeed: number;
  attackReload: number;
  ammoDisplaySize: [number, number] | null;
  ammoDisplayTint: string | null;
}
