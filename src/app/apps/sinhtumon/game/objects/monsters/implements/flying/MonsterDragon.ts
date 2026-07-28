import * as Phaser from 'phaser';
import { MonsterBase, MonsterContext } from '../../MonsterBase';

import * as C from '../../../../constants';

/**
 * Dragon — large flying unit, immune to fire (DAMAGE_FIRE does 0 damage).
 * High HP and moderate speed.
 */
export class MonsterDragon extends MonsterBase {
  constructor(scene: Phaser.Scene, ctx: MonsterContext) {
    super(scene, ctx);
  }

  protected prepareSpriteAsset(): void {
    this.setupAnimations();
  }

  takeDamage(amount: number, damageType: string): void {
    // Fire immunity
    if (damageType === C.DAMAGE_FIRE) return;
    super.takeDamage(amount, damageType);
  }
}
