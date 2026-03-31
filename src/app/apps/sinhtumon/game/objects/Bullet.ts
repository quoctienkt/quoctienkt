import * as Phaser from 'phaser';
import { GameStateService } from '../services/GameStateService';
import { GameMapServiceBase } from '../maps/GameMapServiceBase';
import { getAmmoData, getTowerAmmoAssetName } from '../config';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  gameStateService: GameStateService;
  gameMapService: GameMapServiceBase;
  tower: any;
  level: number;
  target: any = null;
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

    this.gameStateService = gameStateService;
    this.gameMapService = gameMapService;
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
