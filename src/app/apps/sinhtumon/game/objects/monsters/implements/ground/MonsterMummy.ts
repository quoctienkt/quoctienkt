import * as Phaser from 'phaser';
import { MonsterBase, MonsterContext } from '../../MonsterBase';

/**
 * Mummy — regenerates 8 HP/s while alive.
 * regenPerSec is read from monstersConfig and ticked each frame by MonsterBase.tick().
 */
export class MonsterMummy extends MonsterBase {
  constructor(scene: Phaser.Scene, ctx: MonsterContext) {
    super(scene, ctx);
  }
  protected prepareSpriteAsset(): void {
    this.setupAnimations();
    // Subtle yellow tint to show regen aura
    this.setTint(0xffee99);
  }
}
