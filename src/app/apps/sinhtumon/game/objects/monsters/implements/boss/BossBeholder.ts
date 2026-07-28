import * as Phaser from 'phaser';
import { MonsterBase, MonsterContext } from '../../MonsterBase';

/** Void Beholder — High-tier flying boss with powerful beam attacks. */
export class BossBeholder extends MonsterBase {
  constructor(scene: Phaser.Scene, ctx: MonsterContext) {
    super(scene, ctx);
  }
  protected prepareSpriteAsset(): void {
    this.setupAnimations();
  }
}
