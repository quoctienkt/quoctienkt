import * as Phaser from 'phaser';
import { MonsterBase, MonsterContext } from '../../MonsterBase';

/** Ice Elemental — ranged ground monster that slowed on attack (logic in bullet/tower normally, but class here). */
export class MonsterIceElemental extends MonsterBase {
  constructor(scene: Phaser.Scene, ctx: MonsterContext) {
    super(scene, ctx);
  }
  protected prepareSpriteAsset(): void {
    this.setupAnimations();
  }
}
