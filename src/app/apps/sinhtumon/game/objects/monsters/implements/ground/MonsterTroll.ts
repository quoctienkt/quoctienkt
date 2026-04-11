import * as Phaser from 'phaser';
import { MonsterBase, MonsterContext } from '../../MonsterBase';

/**
 * Troll — very slow, high HP, 35% physical armor.
 * Armor is set from monstersConfig — no extra logic needed here.
 */
export class MonsterTroll extends MonsterBase {
  constructor(scene: Phaser.Scene, ctx: MonsterContext) {
    super(scene, ctx);
  }
  protected prepareSpriteAsset(): void {
    this.setupAnimations();
  }
}
