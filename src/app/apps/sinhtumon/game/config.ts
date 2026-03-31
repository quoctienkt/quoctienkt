import * as C from './constants';
import type { GameCoreConfig, AmmoData } from './types';

export const gameCoreConfig: GameCoreConfig = {
  towers: {
    [C.TOWER_FROST]: {
      minLevel: 1,
      maxLevel: 5,
      upgradeCostPerLevel: [80, 120, 180, 240, 320],
      sellPricePerLevel: [40, 110, 150, 170, 220],
      attackDamagePerLevel: [80, 130, 190, 280, 400],
      attackSpeedPerLevel: [200, 205, 210, 215, 220],
      attackReloadPerLevel: [350, 320, 280, 240, 180],
      attackRangePerLevel: [80, 100, 125, 150, 175],
      towerDisplaySizePerLevel: [
        [35, 35],
        [40, 40],
        [35, 35],
        [40, 40],
        [40, 40],
      ],
      ammoDisplaySizePerLevel: [null, null, null, [20, 15], [20, 15]],
      ammoDisplayTintPerLevel: [null, null, null, '0xffa500', '0xffa500'],
    },
  },
  monsters: {
    [C.MONSTER_GRUNT]: {
      goldOnDead: 15,
      moveType: C.MONSTER_MOVE_TYPE_GROUND,
    },
    [C.MONSTER_HARPY]: {
      goldOnDead: 10,
      moveType: C.MONSTER_MOVE_TYPE_FLY,
    },
  },
};

export function getTowerAssetName(towerType: string, level: number): string {
  return `${towerType}_level_${level}`;
}

export function getTowerAmmoAssetName(towerType: string, level: number): string {
  return `${towerType}_level_${level}_ammo`;
}

export function getTowerUpgradeCost(towerType: string, nextLevel: number): number {
  return gameCoreConfig.towers[towerType].upgradeCostPerLevel[nextLevel - 1];
}

export function getTowerSellPrice(towerType: string, level: number): number {
  return gameCoreConfig.towers[towerType].sellPricePerLevel[level - 1];
}

export function getTowerDisplaySize(towerType: string, level: number): [number, number] {
  const size = gameCoreConfig.towers[towerType]?.towerDisplaySizePerLevel?.[level - 1];
  return (size as [number, number]) ?? [35, 35];
}

export function getTowerAttackRange(towerType: string, level: number): number {
  return gameCoreConfig.towers[towerType].attackRangePerLevel[level - 1];
}

export function getTowerAttackReload(towerType: string, level: number): number {
  return gameCoreConfig.towers[towerType].attackReloadPerLevel[level - 1];
}

export function getAmmoData(towerType: string, level: number): AmmoData {
  const t = gameCoreConfig.towers[towerType];
  return {
    attackDamage: t.attackDamagePerLevel[level - 1],
    attackSpeed: t.attackSpeedPerLevel[level - 1],
    attackReload: t.attackReloadPerLevel[level - 1],
    ammoDisplaySize: t.ammoDisplaySizePerLevel[level - 1] as [number, number] | null,
    ammoDisplayTint: t.ammoDisplayTintPerLevel[level - 1],
  };
}

export function getMonsterGoldOnDead(monsterType: string): number {
  return gameCoreConfig.monsters[monsterType].goldOnDead;
}

export function getMonsterAnimationAssetName(
  monsterType: string,
  direction: string,
): string {
  return `${monsterType}_MOVETO_${direction}`;
}

export function getTowerFrostData() {
  return {
    ...gameCoreConfig.towers[C.TOWER_FROST],
    towerType: C.TOWER_FROST,
  };
}
