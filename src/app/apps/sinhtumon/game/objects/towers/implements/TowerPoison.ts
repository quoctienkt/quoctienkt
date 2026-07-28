import * as Phaser from 'phaser';
import { TowerBase, TowerContext } from '../TowerBase';
import { BulletBase } from '../../bullets/BulletBase';
import { MonsterBase } from '../../monsters/MonsterBase';
import * as C from '../../../constants';

/**
 * Poison Tower — applies DoT slow on hit. At lvl 3+ leaves a toxic puddle.
 */
export class TowerPoison extends TowerBase {
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
    // Apply poison DoT + slow
    const dotDps = bullet.damage * 0.15; // 15% of damage per second
    target.applyStatus({
      type: C.STATUS_POISON_DOT,
      duration: bullet.dotDuration || 2000,
      speedMultiplier: 0.65,
      dotDps,
    });

    // Toxic puddle at lvl 3+ — damages all monsters walking over it
    if (this.level >= 3) {
      this.createPuddle(
        target.x,
        target.y,
        bullet.damage,
        bullet.dotDuration || 2000,
      );
    }
  }

  private createPuddle(px: number, py: number, dmg: number, dur: number): void {
    const r = 30 + this.level * 5;
    const g = this.scene.add.graphics();
    g.fillStyle(0x22cc22, 0.4);
    g.fillCircle(px, py, r);
    g.setDepth(1);

    // Every 500ms tick damage to monsters inside
    const tickEvent = this.scene.time.addEvent({
      delay: 500,
      repeat: Math.floor(dur / 500),
      callback: () => {
        for (const m of this.cb.getMonsters()) {
          if (!m.active) continue;
          if (this.cb.getDistance({ x: px, y: py }, m) <= r) {
            m.takeDamage(dmg * 0.05, C.DAMAGE_POISON);
            m.applyStatus({
              type: C.STATUS_SLOW,
              duration: 700,
              speedMultiplier: 0.65,
            });
          }
        }
      },
    });

    this.scene.time.delayedCall(dur, () => {
      g.destroy();
      tickEvent.destroy();
    });
  }
}
