window.constants = {
  TOWER_SNOWFLAKE_NAME: "Tower_Snowflake",
};

window.gameCoreConfig = {
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
      ],
      ammoDisplaySizePerLevel: [null, null, null, [20, 15], [20, 15]],
      ammoDisplayTintPerLevel: [null, null, null, "0xffa500", "0xffa500"],
    },
  },
};

window.getConstants = () => {
  return window.constants;
};

window.getTowerSnowFlakeData = () => {
  return {
    ...gameCoreConfig.towers[getConstants().TOWER_SNOWFLAKE_NAME],
    towerType: getConstants().TOWER_SNOWFLAKE_NAME,
  };
};

window.getTowerAssetName = (towerType, level) => {
  return `${towerType}_level_${level}`;
};

window.getTowerAmmoAssetName = (towerType, level) => {
  return `${towerType}_level_${level}_ammo`;
};

window.getTowerUpgradeCost = (towerType, nextLevel) => {
  return gameCoreConfig.towers[towerType].upgradeCostPerLevel[nextLevel - 1];
};

window.getTowerSellPrice = (towerType, level) => {
  return gameCoreConfig.towers[towerType].sellPricePerLevel[level - 1];
};

window.getTowerDisplaySize = (towerType, level) => {
  return gameCoreConfig.towers[towerType].towerDisplaySizePerLevel[level - 1];
};

window.getTowerAttackRange = (towerType, level) => {
  return gameCoreConfig.towers[towerType].attackRangePerLevel[level - 1];
};

window.getTowerAttackReload = (towerType, level) => {
  return gameCoreConfig.towers[towerType].attackReloadPerLevel[level - 1];
}

window.getAmmoData = (towerType, level) => {
  return {
    attackDamage: gameCoreConfig.towers[towerType].attackDamagePerLevel[level - 1],
    attackSpeed: gameCoreConfig.towers[towerType].attackSpeedPerLevel[level - 1],
    attackReload: gameCoreConfig.towers[towerType].attackReloadPerLevel[level - 1],
    ammoDisplaySize: gameCoreConfig.towers[towerType].ammoDisplaySizePerLevel[level - 1],
    ammoDisplayTint: gameCoreConfig.towers[towerType].ammoDisplayTintPerLevel[level - 1],
  };
};
