import * as Phaser from 'phaser';
import { TowerBase, TowerContext } from '../TowerBase';
import { BulletBase } from '../../bullets/BulletBase';
import { MonsterBase } from '../../monsters/MonsterBase';

/**
 * Archer Tower — fast single-target. At level 3+ shoots an extra bullet per volley.
 */
export class TowerArcher extends TowerBase {
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

  protected specialAbility(target: MonsterBase, _bullet: BulletBase): void {
    // Level 3+: fire a second arrow at the same target after 80ms
    if (this.level >= 3 && target.active) {
      this.scene.time.delayedCall(80, () => {
        if (!target.active || !this.active) return;
        const bullet2 = this.createBullet();
        bullet2.target = target;
        target.aimed.push(bullet2);
        this.scene.physics.add.overlap(
          bullet2 as any,
          target,
          () => {
            this.cb.dealDamage(bullet2, target);
          },
          undefined,
          this.scene,
        );
        this.stateService.savedData!.bullets.push(bullet2);
      });
    }
  }
}
