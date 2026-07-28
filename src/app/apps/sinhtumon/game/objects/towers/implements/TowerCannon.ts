import * as Phaser from 'phaser';
import { TowerBase, TowerContext } from '../TowerBase';
import { BulletBase } from '../../bullets/BulletBase';
import { MonsterBase } from '../../monsters/MonsterBase';

/**
 * Cannon Tower — AoE splash damage on impact.
 * specialAbility queries all monsters within splashRadius and deals half damage.
 */
export class TowerCannon extends TowerBase {
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

  protected specialAbility(target: MonsterBase, bullet: BulletBase): void {
    const splash = bullet.splashRadius;
    if (splash <= 0) return;

    // Splash circle visual
    const g = this.scene.add.graphics();
    g.fillStyle(0xff6600, 0.5);
    g.fillCircle(target.x, target.y, splash);
    this.scene.time.delayedCall(300, () => g.destroy());

    // Damage all monsters in splash radius (50% of bullet damage)
    const monsters = this.cb.getMonsters();
    for (const m of monsters) {
      if (m === target || !m.active) continue;
      const dist = this.cb.getDistance(target, m);
      if (dist <= splash) {
        m.takeDamage(bullet.damage * 0.5, bullet.damageType);
      }
    }
  }
}
