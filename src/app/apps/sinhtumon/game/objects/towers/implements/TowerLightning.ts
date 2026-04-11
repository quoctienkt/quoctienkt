import * as Phaser from 'phaser';
import { TowerBase, TowerContext } from '../TowerBase';
import { BulletBase } from '../../bullets/BulletBase';
import { MonsterBase } from '../../monsters/MonsterBase';
import * as C from '../../../constants';

/**
 * Lightning Tower — stuns primary target, chains to nearby enemies at lvl 4+.
 */
export class TowerLightning extends TowerBase {
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
    // Stun primary target for 600ms
    target.applyStatus({
      type: C.STATUS_STUN,
      duration: 600,
      speedMultiplier: 0.01,
    });

    // Lightning bolt drawing
    this.drawLightning(this.x, this.y, target.x, target.y);

    // Chain lightning at level 4+
    const chainCount = bullet.chainCount;
    if (chainCount > 0) {
      const monsters = this.cb.getMonsters();
      const chained = new Set<MonsterBase>([target]);
      let lastHit = target;
      for (let i = 0; i < chainCount; i++) {
        let nearest: MonsterBase | null = null;
        let nearestDist = 140;
        for (const m of monsters) {
          if (chained.has(m) || !m.active) continue;
          const d = this.cb.getDistance(lastHit, m);
          if (d < nearestDist) {
            nearestDist = d;
            nearest = m;
          }
        }
        if (!nearest) break;
        chained.add(nearest);
        nearest.takeDamage(bullet.damage * 0.5, bullet.damageType);
        nearest.applyStatus({
          type: C.STATUS_STUN,
          duration: 300,
          speedMultiplier: 0.01,
        });
        this.drawLightning(lastHit.x, lastHit.y, nearest.x, nearest.y);
        lastHit = nearest;
      }
    }
  }

  private drawLightning(x1: number, y1: number, x2: number, y2: number): void {
    const g = this.scene.add.graphics();
    g.lineStyle(2, 0xffffff, 1);
    g.beginPath();
    g.moveTo(x1, y1);
    // Add jagged midpoints
    const mx = (x1 + x2) / 2 + Phaser.Math.Between(-15, 15);
    const my = (y1 + y2) / 2 + Phaser.Math.Between(-15, 15);
    g.lineTo(mx, my);
    g.lineTo(x2, y2);
    g.strokePath();
    g.setDepth(10);
    this.scene.time.delayedCall(150, () => g.destroy());
  }
}
