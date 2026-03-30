import * as Phaser from 'phaser';
import { getAmmoData, getTowerAmmoAssetName } from '../constants';
import type { GameStateService } from '../services/GameStateService';
import type { GameMapServiceBase } from '../maps/GameMapServiceBase';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  _gameStateService: GameStateService;
  _gameMapService: GameMapServiceBase;
  tower: any;
  level: number;
  target: any;
  speed: number;
  damage: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    tower: any,
    level: number,
    gameStateService: GameStateService,
    gameMapService: GameMapServiceBase,
  ) {
    super(scene, x, y, getTowerAmmoAssetName(tower.towerType, level));
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this._gameStateService = gameStateService;
    this._gameMapService = gameMapService;
    this.tower = tower;
    this.level = level;

    this.setDepth(3);

    const ammoData = getAmmoData(tower.towerType, level);
    this.speed = ammoData.attackSpeed;
    this.damage = ammoData.attackDamage;

    if (ammoData.ammoDisplayTint !== null) {
      this.setTint(parseInt(ammoData.ammoDisplayTint));
    }
    if (ammoData.ammoDisplaySize !== null) {
      this.setDisplaySize(ammoData.ammoDisplaySize[0], ammoData.ammoDisplaySize[1]);
    }
  }

  getName(): string {
    return this.texture.key;
  }
}
