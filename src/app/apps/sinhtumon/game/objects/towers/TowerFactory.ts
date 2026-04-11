import * as Phaser from 'phaser';
import { TowerBase, TowerContext } from './TowerBase';
import { TowerFrost } from './implements/TowerFrost';
import { TowerArcher } from './implements/TowerArcher';
import { TowerCannon } from './implements/TowerCannon';
import { TowerLightning } from './implements/TowerLightning';
import { TowerPoison } from './implements/TowerPoison';
import * as C from '../../constants';

export class TowerFactory {
  static create(scene: Phaser.Scene, ctx: TowerContext): TowerBase {
    switch (ctx.towerType) {
      case C.TOWER_FROST:
        return new TowerFrost(scene, ctx);
      case C.TOWER_ARCHER:
        return new TowerArcher(scene, ctx);
      case C.TOWER_CANNON:
        return new TowerCannon(scene, ctx);
      case C.TOWER_LIGHTNING:
        return new TowerLightning(scene, ctx);
      case C.TOWER_POISON:
        return new TowerPoison(scene, ctx);
      default:
        throw new Error(`Unknown tower type: ${ctx.towerType}`);
    }
  }
}
