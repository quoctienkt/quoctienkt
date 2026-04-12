import * as Phaser from 'phaser';
import { GameStateService } from '../../services/GameStateService';
import { GameMapServiceBase } from '../../maps/GameMapServiceBase';
import { getAmmoData, getTowerAmmoAssetName } from '../../config';
import * as C from '../../constants';
import type { MonsterBase } from '../monsters/MonsterBase';

export class BulletBase extends Phaser.Physics.Arcade.Sprite {
  readonly tower: any; // TowerBase (avoids circular import)
  readonly level: number;
  readonly damage: number;
  readonly speed: number;
  readonly damageType: string;
  readonly splashRadius: number;
  readonly dotDuration: number;
  readonly chainCount: number;
  target: MonsterBase | null = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    tower: any,
    level: number,
    _stateService: GameStateService,
    _mapService: GameMapServiceBase,
  ) {
    // Fallback texture key if the ammo asset doesn't exist yet
    const textureKey = getTowerAmmoAssetName(tower.towerType, level);
    super(scene, x, y, textureKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.tower = tower;
    this.level = level;
    this.setDepth(3);

    const ammo = getAmmoData(tower.towerType, level);
    this.speed = ammo.attackSpeed;
    this.damage = ammo.attackDamage;
    this.damageType = ammo.damageType ?? C.DAMAGE_PHYSICAL;
    this.splashRadius = ammo.splashRadius ?? 0;
    this.dotDuration = ammo.dotDuration ?? 0;
    this.chainCount = ammo.chainCount ?? 0;

    if (ammo.ammoDisplayTint !== null) {
      this.setTint(parseInt(ammo.ammoDisplayTint));
    }
    if (ammo.ammoDisplaySize !== null && ammo.ammoDisplaySize) {
      this.setDisplaySize(ammo.ammoDisplaySize[0], ammo.ammoDisplaySize[1]);
      if (this.body) {
        (this.body as Phaser.Physics.Arcade.Body).setSize(
          this.width,
          this.height,
        );
      }
    }
  }

  /**
   * Called by GameScene after base damage is applied.
   * Tower subclasses call specialAbility() instead — this is kept as a no-op
   * for any bullet that doesn't need extra logic.
   */
  onHit(_target: MonsterBase, _allMonsters: MonsterBase[]): void {
    /* extend in subclasses */
  }

  getName(): string {
    return this.texture.key;
  }
}
