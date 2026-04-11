import * as Phaser from 'phaser';
import { MonsterBase, MonsterContext } from '../../MonsterBase';

import * as C from '../../../../constants';

/**
 * Boss Demon — flying boss, periodically lands to stomp ground:
 * Emits ground stomp event that GameScene uses to briefly stun nearby towers.
 */
export class BossDemon extends MonsterBase {
  private stompCooldown = 10000;

  constructor(scene: Phaser.Scene, ctx: MonsterContext) {
    super(scene, ctx);
  }

  protected prepareSpriteAsset(): void {
    this.setupAnimations();
    // Red tint to distinguish from other flyers
    this.setTint(0xff8888);
    // Pulsing effect
    this.scene.tweens.add({
      targets: this,
      alpha: 0.75,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });
  }

  tick(delta: number, graphics: Phaser.GameObjects.Graphics): void {
    super.tick(delta, graphics);
    this.stompCooldown -= delta;
    if (this.stompCooldown <= 0) {
      this.stompCooldown = 12000;
      this.eventBus.emit('BOSS_DEMON_STOMP', {
        x: this.x,
        y: this.y,
        radius: 100,
      });
    }
  }
}
