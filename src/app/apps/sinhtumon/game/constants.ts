export const CONSTANTS = {
  TOWER_SNOWFLAKE_NAME: 'Tower_Snowflake',

  MONSTER_MOVE_TYPE_GROUND: 'Monster_ground',
  MONSTER_MOVE_TYPE_FLY: 'Monster_fly',

  MONSTER_MOVE_DIRECTION_TO_TOP: 'TO_TOP',
  MONSTER_MOVE_DIRECTION_TO_RIGHT: 'TO_RIGHT',
  MONSTER_MOVE_DIRECTION_TO_BOTTOM: 'TO_BOTTOM',
  MONSTER_MOVE_DIRECTION_TO_LEFT: 'TO_LEFT',
  MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT: 'TO_BOTTOM_RIGHT',

  MONSTER_THIEF: 'Monster_Thief',
  MONSTER_BUTTERFLY: 'Monster_Butterfly',
} as const;

export type TowerType = typeof CONSTANTS.TOWER_SNOWFLAKE_NAME;
export type MonsterType = typeof CONSTANTS.MONSTER_THIEF | typeof CONSTANTS.MONSTER_BUTTERFLY;

export const gameCoreConfig = {
  towers: {
    Tower_Snowflake: {
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
      ] as [number, number][],
      ammoDisplaySizePerLevel: [null, null, null, [20, 15], [20, 15]] as ([number, number] | null)[],
      ammoDisplayTintPerLevel: [null, null, null, '0xffa500', '0xffa500'] as (string | null)[],
    },
  },
  monsters: {
    Monster_Thief: {
      goldOnDead: 15,
      moveType: CONSTANTS.MONSTER_MOVE_TYPE_GROUND,
    },
    Monster_Butterfly: {
      goldOnDead: 10,
      moveType: CONSTANTS.MONSTER_MOVE_TYPE_FLY,
    },
  },
};

export function getTowerSnowFlakeData() {
  return {
    ...gameCoreConfig.towers[CONSTANTS.TOWER_SNOWFLAKE_NAME],
    towerType: CONSTANTS.TOWER_SNOWFLAKE_NAME,
  };
}

export function getTowerAssetName(towerType: string, level: number): string {
  return `${towerType}_level_${level}`;
}

export function getTowerAmmoAssetName(towerType: string, level: number): string {
  return `${towerType}_level_${level}_ammo`;
}

export function getTowerUpgradeCost(towerType: string, nextLevel: number): number {
  return (gameCoreConfig.towers as Record<string, typeof gameCoreConfig.towers.Tower_Snowflake>)[towerType].upgradeCostPerLevel[nextLevel - 1];
}

export function getTowerSellPrice(towerType: string, level: number): number {
  return (gameCoreConfig.towers as Record<string, typeof gameCoreConfig.towers.Tower_Snowflake>)[towerType].sellPricePerLevel[level - 1];
}

export function getTowerDisplaySize(towerType: string, level: number): [number, number] {
  return (gameCoreConfig.towers as Record<string, typeof gameCoreConfig.towers.Tower_Snowflake>)[towerType].towerDisplaySizePerLevel[level - 1];
}

export function getTowerAttackRange(towerType: string, level: number): number {
  return (gameCoreConfig.towers as Record<string, typeof gameCoreConfig.towers.Tower_Snowflake>)[towerType].attackRangePerLevel[level - 1];
}

export function getTowerAttackReload(towerType: string, level: number): number {
  return (gameCoreConfig.towers as Record<string, typeof gameCoreConfig.towers.Tower_Snowflake>)[towerType].attackReloadPerLevel[level - 1];
}

export function getAmmoData(towerType: string, level: number) {
  const t = (gameCoreConfig.towers as Record<string, typeof gameCoreConfig.towers.Tower_Snowflake>)[towerType];
  return {
    attackDamage: t.attackDamagePerLevel[level - 1],
    attackSpeed: t.attackSpeedPerLevel[level - 1],
    attackReload: t.attackReloadPerLevel[level - 1],
    ammoDisplaySize: t.ammoDisplaySizePerLevel[level - 1],
    ammoDisplayTint: t.ammoDisplayTintPerLevel[level - 1],
  };
}

export function getMonsterGoldOnDead(monsterType: string): number {
  return (gameCoreConfig.monsters as Record<string, { goldOnDead: number; moveType: string }>)[monsterType].goldOnDead;
}

export function getMonsterAnimationAssetName(monsterType: string, direction: string): string {
  return `${monsterType}_MOVETO_${direction}`;
}
