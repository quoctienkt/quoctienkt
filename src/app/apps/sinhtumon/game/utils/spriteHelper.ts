import * as Phaser from 'phaser';

/**
 * Helper utilities for sprite animation setup across monster/hero classes.
 */

export interface AnimDef {
  key: string;
  textureKey: string;
  startFrame: number;
  endFrame: number;
  frameRate?: number;
  repeat?: number;
}

/**
 * Create a Phaser animation if it does not already exist in the scene.
 * Idempotent — safe to call from every monster instance (only registers once).
 */
export function createAnimSafe(scene: Phaser.Scene, def: AnimDef): void {
  if (scene.anims.exists(def.key)) return;
  scene.anims.create({
    key: def.key,
    frames: scene.anims.generateFrameNumbers(def.textureKey, {
      start: def.startFrame,
      end: def.endFrame,
    }),
    frameRate: def.frameRate ?? 10,
    repeat: def.repeat ?? -1,
  });
}

/**
 * Build the canonical animation key used throughout the codebase.
 * E.g. "Monster_Grunt_MOVETO_TO_RIGHT"
 */
export function buildAnimKey(entityName: string, direction: string): string {
  return `${entityName}_MOVETO_${direction}`;
}

/**
 * Build a named animation key for hero actions.
 * E.g. "Hero_Knight_ACTION_attack"
 */
export function buildHeroAnimKey(heroType: string, action: string): string {
  return `${heroType}_ACTION_${action}`;
}

/**
 * Draw a health bar on a shared Graphics object.
 * Called each frame by GameScene for each living entity.
 */
export function drawHealthBar(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  width: number,
  currentHp: number,
  maxHp: number,
  isBoss = false,
): void {
  const ratio = Math.max(0, currentHp / maxHp);
  const h = isBoss ? 5 : 3;
  const barY = y + (isBoss ? 34 : 22);
  const halfW = width / 2;

  // Background
  g.fillStyle(0x000000, 0.6);
  g.fillRect(x - halfW, barY, width, h);

  // HP fill — green → yellow → red based on ratio
  const color = ratio > 0.5 ? 0x00dd00 : ratio > 0.25 ? 0xffaa00 : 0xff3300;
  g.fillStyle(color, 1);
  g.fillRect(x - halfW, barY, width * ratio, h);
}

/**
 * Return a tint color for a given status effect type.
 */
export function statusTintColor(statusType: string): number {
  switch (statusType) {
    case 'slow':
      return 0x88aaff;
    case 'freeze':
      return 0x00ffff;
    case 'poison_dot':
      return 0x44ff44;
    case 'stun':
      return 0xffff00;
    case 'web':
      return 0xaaaaaa;
    default:
      return 0xffffff;
  }
}
