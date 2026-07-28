import * as Phaser from 'phaser';
import { TowerBase, TowerContext } from '../TowerBase';
import { BulletBase } from '../../bullets/BulletBase';
import { MonsterBase } from '../../monsters/MonsterBase';
import * as C from '../../../constants';

export class TowerFrost extends TowerBase {
  constructor(scene: Phaser.Scene, ctx: TowerContext) {
    super(scene, ctx);
  }

  protected createBullet(): BulletBase {
    return new BulletBase(
      this.scene,
      this.x,
      this.y,
      this,
      this.level,
      this.stateService,
      this.mapService,
    );
  }

  // Frost: apply slow status on hit
  protected specialAbility(target: MonsterBase, bullet: BulletBase): void {
    const slowDuration = 1500 + this.level * 300;
    const speedMult = this.level >= 5 ? 0 : 0.4 + (5 - this.level) * 0.08; // 0 = freeze at lvl5
    const statusType = this.level >= 5 ? C.STATUS_FREEZE : C.STATUS_SLOW;
    target.applyStatus({
      type: statusType,
      duration: speedMult === 0 ? 1200 : slowDuration,
      speedMultiplier: speedMult === 0 ? 0.01 : speedMult,
    });
  }
}
