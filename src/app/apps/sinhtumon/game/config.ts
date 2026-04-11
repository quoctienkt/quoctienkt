/**
 * Backward-compat shim — imports from the new config/ directory.
 * All existing `import { xxx } from '../config'` imports continue to work unchanged.
 */
export { towersConfig } from './config/towers.config';
export { monstersConfig } from './config/monsters.config';
export { wavesConfig } from './config/waves.config';
export { heroesConfig, skillsConfig } from './config/heroes.config';

export {
  gameCoreConfig,
  getTowerConfig,
  getTowerAssetName,
  getTowerAmmoAssetName,
  getTowerUpgradeCost,
  getTowerSellPrice,
  getTowerDisplaySize,
  getTowerAttackRange,
  getTowerAttackReload,
  getTowerDefaultPriority,
  getAmmoData,
  getMonsterGoldOnDead,
  getMonsterConfig,
  getMonsterAnimationAssetName,
  getTowerFrostData,
} from './config/index';

// Keep the old GameCoreConfig type export for any remaining references
export type { GameCoreConfig } from './types';
