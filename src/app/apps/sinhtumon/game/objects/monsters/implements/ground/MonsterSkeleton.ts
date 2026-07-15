import * as Phaser from 'phaser';
import { MonsterBase, MonsterContext } from '../../MonsterBase';

/** Skeleton Guard — slow undead ground monster. */
export class MonsterSkeleton extends MonsterBase {
  constructor(scene: Phaser.Scene, ctx: MonsterContext) {
    super(scene, ctx);
  }
  protected prepareSpriteAsset(): void {
    this.setupAnimations();
  }
}
