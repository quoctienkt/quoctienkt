import * as Phaser from 'phaser';
import { MonsterBase, MonsterContext } from '../../MonsterBase';

import * as C from '../../../../constants';

/**
 * Spider — very fast, small hitbox.
 * Special: every 8 seconds it webs the nearest tower (emits an event GameScene handles).
 */
export class MonsterSpider extends MonsterBase {
  private webCooldown = 4000; // first web happens quickly

  constructor(scene: Phaser.Scene, ctx: MonsterContext) {
    super(scene, ctx);
  }

  protected prepareSpriteAsset(): void {
    this.setupAnimations();
  }

  tick(delta: number, graphics: Phaser.GameObjects.Graphics): void {
    super.tick(delta, graphics);
    // Web ability — slow a nearby tower
    this.webCooldown -= delta;
    if (this.webCooldown <= 0) {
      this.webCooldown = 8000;
      this.eventBus.emit(C.STATUS_WEB, {
        x: this.x,
        y: this.y,
        radius: 60,
        duration: 2000,
      });
    }
  }
}
