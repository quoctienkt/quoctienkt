import * as Phaser from 'phaser';
import { MonsterBase, MonsterContext } from '../../MonsterBase';

/** Rock Larva — high health, slow ground monster. */
export class MonsterLarva extends MonsterBase {
  constructor(scene: Phaser.Scene, ctx: MonsterContext) {
    super(scene, ctx);
  }
  protected prepareSpriteAsset(): void {
    this.setupAnimations();
  }
}
