/**
 * Central config barrel.
 * Import from here throughout the game codebase.
 */
export { monstersConfig } from './monsters.config';
export { towersConfig } from './towers.config';
export { wavesConfig } from './waves.config';
export { heroesConfig, skillsConfig } from './heroes.config';

// ─── Accessor helpers (used like the old config.ts helpers) ──────────────────
import * as C from '../constants';
import { towersConfig, TowerFullConfig } from './towers.config';
import { monstersConfig } from './monsters.config';
import type { AmmoData, TargetPriority, TowerLevelConfig } from '../types';

export function getTowerConfig(towerType: string): TowerFullConfig {
  const cfg = towersConfig[towerType];
  if (!cfg) throw new Error(`Unknown tower type: ${towerType}`);
  return cfg;
}

export function getTowerAssetName(towerType: string, level: number): string {
  return `${towerType}_level_${level}`;
}

export function getTowerAmmoAssetName(
  towerType: string,
  level: number,
): string {
  return `${towerType}_level_${level}_ammo`;
}

export function getTowerUpgradeCost(
  towerType: string,
  nextLevel: number,
): number {
  return towersConfig[towerType].upgradeCostPerLevel[nextLevel - 1];
}

export function getTowerSellPrice(towerType: string, level: number): number {
  return towersConfig[towerType].sellPricePerLevel[level - 1];
}

export function getTowerDisplaySize(
  towerType: string,
  level: number,
): [number, number] {
  const size = towersConfig[towerType]?.towerDisplaySizePerLevel?.[level - 1];
  return (size as [number, number]) ?? [35, 35];
}

export function getTowerAttackRange(towerType: string, level: number): number {
  return towersConfig[towerType].attackRangePerLevel[level - 1];
}

export function getTowerAttackReload(towerType: string, level: number): number {
  return towersConfig[towerType].attackReloadPerLevel[level - 1];
}

export function getTowerDefaultPriority(towerType: string): TargetPriority {
  return towersConfig[towerType].defaultPriority ?? 'nearest';
}

export function getAmmoData(towerType: string, level: number): AmmoData {
  const t = towersConfig[towerType];
  const idx = level - 1;
  return {
    attackDamage: t.attackDamagePerLevel[idx],
    attackSpeed: t.attackSpeedPerLevel[idx],
    attackReload: t.attackReloadPerLevel[idx],
    ammoDisplaySize: t.ammoDisplaySizePerLevel[idx] as [number, number] | null,
    ammoDisplayTint: t.ammoDisplayTintPerLevel[idx],
    splashRadius: t.splashRadius?.[idx],
    damageType: (t as TowerFullConfig).damageType,
    dotDuration: t.dotDuration?.[idx],
    chainCount: t.chainCount?.[idx],
  };
}

export function getMonsterGoldOnDead(monsterType: string): number {
  return monstersConfig[monsterType]?.goldOnDead ?? 0;
}

export function getMonsterConfig(monsterType: string) {
  const cfg = monstersConfig[monsterType];
  if (!cfg) throw new Error(`Unknown monster type: ${monsterType}`);
  return cfg;
}

export function getMonsterAnimationAssetName(
  monsterType: string,
  direction: string,
): string {
  return `${monsterType}_MOVETO_${direction}`;
}

// ─── Kept for backward-compat with any code that still calls it ───────────────
export function getTowerFrostData() {
  return {
    ...towersConfig[C.TOWER_FROST],
    towerType: C.TOWER_FROST,
  };
}

/** Aggregate config object (backward compat with any code that used gameCoreConfig) */
export const gameCoreConfig = {
  get towers() {
    return towersConfig as Record<string, TowerLevelConfig>;
  },
  get monsters() {
    return monstersConfig;
  },
};
