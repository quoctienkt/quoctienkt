import * as Phaser from 'phaser';
import { MonsterBase, MonsterContext } from '../../MonsterBase';

import * as C from '../../../../constants';

/**
 * Boss Golem — massive ground boss with 25% armor.
 * On death, emits an event so GameScene can spawn 2 mini-golems.
 */
export class BossGolem extends MonsterBase {
  constructor(scene: Phaser.Scene, ctx: MonsterContext) {
    super(scene, ctx);
  }

  protected prepareSpriteAsset(): void {
    this.setupAnimations();
    // Boss gets a pulsing scale effect to stand out
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
  }

  dead(): void {
    // Notify GameScene to spawn mini-golems at our position
    this.eventBus.emit('BOSS_GOLEM_SPLIT', { x: this.x, y: this.y });
    super.dead();
  }
}
