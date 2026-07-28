import * as Phaser from 'phaser';
import { MonsterBase, MonsterContext } from '../../MonsterBase';

/** Orc — slow, high HP ground unit. No special ability. */
export class MonsterOrc extends MonsterBase {
  constructor(scene: Phaser.Scene, ctx: MonsterContext) {
    super(scene, ctx);
  }
  protected prepareSpriteAsset(): void {
    this.setupAnimations();
  }
}
