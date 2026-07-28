import * as C from '../constants';
import type { TowerLevelConfig } from '../types';

/**
 * All tower stat/asset definitions.
 * Asset paths live under public/quoctienkt/sinhtumon/img/towers/<type>/<level>.png
 */
export interface TowerFullConfig extends TowerLevelConfig {
  displayName: string;
  description: string;
  baseCost: number;
  assetPathFn: (lvl: number) => string;
  ammoAssetPathFn: (lvl: number) => string;
  damageType: string;
}

export const towersConfig: Record<string, TowerFullConfig> = {
  [C.TOWER_FROST]: {
    displayName: 'Frost Tower',
    description: 'Slows enemies. Freezes at lvl 5.',
    baseCost: 70,
    minLevel: 1,
    maxLevel: 5,
    defaultPriority: 'nearest',
    damageType: C.DAMAGE_ICE,
    upgradeCostPerLevel: [70, 100, 150, 200, 280],
    sellPricePerLevel: [35, 85, 135, 175, 235],
    attackDamagePerLevel: [90, 150, 230, 330, 480],
    attackSpeedPerLevel: [200, 205, 210, 215, 220],
    attackReloadPerLevel: [350, 320, 280, 240, 180],
    attackRangePerLevel: [85, 105, 130, 155, 180],
    towerDisplaySizePerLevel: [
      [35, 35],
      [40, 40],
      [35, 35],
      [40, 40],
      [40, 40],
    ],
    ammoDisplaySizePerLevel: [null, null, null, [20, 15], [20, 15]],
    ammoDisplayTintPerLevel: [null, null, null, '0xffa500', '0xffa500'],
    assetPathFn: (lvl) => `/towers/frozen/${lvl}.png`,
    ammoAssetPathFn: (lvl) => `/bullets/frozenTower/${lvl}.png`,
  },

  [C.TOWER_ARCHER]: {
    displayName: 'Archer Tower',
    description: 'Fast single-target. Double shot at lvl 3+.',
    baseCost: 55,
    minLevel: 1,
    maxLevel: 5,
    defaultPriority: 'first',
    damageType: C.DAMAGE_PHYSICAL,
    upgradeCostPerLevel: [55, 80, 120, 180, 250],
    sellPricePerLevel: [25, 65, 95, 135, 185],
    attackDamagePerLevel: [45, 80, 130, 200, 280],
    attackSpeedPerLevel: [300, 310, 320, 330, 340],
    attackReloadPerLevel: [250, 220, 190, 160, 120],
    attackRangePerLevel: [95, 115, 135, 160, 185],
    towerDisplaySizePerLevel: [
      [32, 48],
      [36, 52],
      [36, 52],
      [40, 56],
      [40, 60],
    ],
    ammoDisplaySizePerLevel: [
      [10, 3],
      [10, 3],
      [12, 3],
      [12, 3],
      [14, 4],
    ],
    ammoDisplayTintPerLevel: [
      '0xd4a257',
      '0xd4a257',
      '0xd4a257',
      '0xd4a257',
      '0xffe066',
    ],
    assetPathFn: (lvl) => `/towers/archer/${lvl}.png`,
    ammoAssetPathFn: (lvl) => `/bullets/commonTower/${lvl}.png`,
  },

  [C.TOWER_CANNON]: {
    displayName: 'Cannon Tower',
    description: 'AoE splash damage. Slow reload.',
    baseCost: 90,
    minLevel: 1,
    maxLevel: 5,
    defaultPriority: 'nearest',
    damageType: C.DAMAGE_PHYSICAL,
    upgradeCostPerLevel: [90, 130, 190, 260, 350],
    sellPricePerLevel: [45, 110, 160, 220, 290],
    attackDamagePerLevel: [140, 240, 380, 560, 800],
    attackSpeedPerLevel: [150, 155, 160, 165, 170],
    attackReloadPerLevel: [650, 580, 500, 440, 350],
    attackRangePerLevel: [75, 95, 115, 135, 160],
    towerDisplaySizePerLevel: [
      [40, 40],
      [44, 44],
      [44, 44],
      [48, 48],
      [52, 52],
    ],
    ammoDisplaySizePerLevel: [
      [14, 14],
      [16, 16],
      [16, 16],
      [18, 18],
      [20, 20],
    ],
    ammoDisplayTintPerLevel: [
      '0x888888',
      '0x888888',
      '0x666666',
      '0x444444',
      '0x222222',
    ],
    splashRadius: [40, 50, 62, 74, 88],
    assetPathFn: (lvl) => `/towers/cannon/${lvl}.png`,
    ammoAssetPathFn: (lvl) => `/bullets/commonTower/${lvl}.png`,
  },

  [C.TOWER_LIGHTNING]: {
    displayName: 'Lightning Tower',
    description: 'Slows and chains to 2 additional targets.',
    baseCost: 110,
    minLevel: 1,
    maxLevel: 5,
    defaultPriority: 'nearest',
    damageType: C.DAMAGE_LIGHTNING,
    upgradeCostPerLevel: [110, 160, 230, 320, 420],
    sellPricePerLevel: [55, 135, 200, 270, 350],
    attackDamagePerLevel: [110, 180, 270, 400, 580],
    attackSpeedPerLevel: [250, 255, 260, 265, 270],
    attackReloadPerLevel: [450, 400, 360, 320, 270],
    attackRangePerLevel: [80, 100, 125, 150, 175],
    towerDisplaySizePerLevel: [
      [36, 48],
      [40, 52],
      [40, 52],
      [44, 56],
      [44, 60],
    ],
    ammoDisplaySizePerLevel: [
      [8, 8],
      [8, 8],
      [10, 10],
      [10, 10],
      [12, 12],
    ],
    ammoDisplayTintPerLevel: [
      '0xffd700',
      '0xffd700',
      '0xffff00',
      '0xffff00',
      '0xffffff',
    ],
    chainCount: [2, 2, 2, 2, 2],
    assetPathFn: (lvl) => `/towers/lightning/${lvl}.png`,
    ammoAssetPathFn: (lvl) => `/towers/power/${lvl}.png`,
  },

  [C.TOWER_POISON]: {
    displayName: 'Poison Tower',
    description: 'DoT + slow. Leaves toxic puddle at lvl 3+.',
    baseCost: 80,
    minLevel: 1,
    maxLevel: 5,
    defaultPriority: 'first',
    damageType: C.DAMAGE_POISON,
    upgradeCostPerLevel: [80, 120, 170, 240, 320],
    sellPricePerLevel: [40, 100, 145, 195, 260],
    attackDamagePerLevel: [40, 70, 110, 165, 230],
    attackSpeedPerLevel: [180, 185, 190, 195, 200],
    attackReloadPerLevel: [400, 350, 300, 260, 210],
    attackRangePerLevel: [90, 110, 133, 157, 183],
    towerDisplaySizePerLevel: [
      [36, 48],
      [36, 48],
      [40, 52],
      [40, 52],
      [44, 56],
    ],
    ammoDisplaySizePerLevel: [
      [12, 12],
      [12, 12],
      [14, 14],
      [14, 14],
      [16, 16],
    ],
    ammoDisplayTintPerLevel: [
      '0x44ff44',
      '0x44ff44',
      '0x22ee22',
      '0x22ee22',
      '0x00cc00',
    ],
    dotDuration: [2000, 2500, 3000, 3500, 4000],
    assetPathFn: (lvl) => `/towers/poison/${lvl}.png`,
    ammoAssetPathFn: (lvl) => `/bullets/toxicTower/${lvl}.png`,
  },
};
