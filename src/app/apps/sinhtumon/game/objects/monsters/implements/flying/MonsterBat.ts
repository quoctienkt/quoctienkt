import * as Phaser from 'phaser';
import { MonsterBase, MonsterContext } from '../../MonsterBase';

/** Bat — extremely fast flying unit with tiny hitbox. Moves in swarms. */
export class MonsterBat extends MonsterBase {
  constructor(scene: Phaser.Scene, ctx: MonsterContext) {
    super(scene, ctx);
  }
  protected prepareSpriteAsset(): void {
    this.setupAnimations();
    // Bats are slightly darker and smaller-feeling
    this.setAlpha(0.9);
  }
}
