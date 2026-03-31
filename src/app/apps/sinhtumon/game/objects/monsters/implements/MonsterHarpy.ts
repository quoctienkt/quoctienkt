import * as Phaser from 'phaser';
import { MonsterBase } from '../MonsterBase';
import { GameStateService } from '../../../services/GameStateService';
import { GameMapServiceBase } from '../../../maps/GameMapServiceBase';
import * as C from '../../../constants';
import { getMonsterAnimationAssetName } from '../../../config';

export class MonsterHarpy extends MonsterBase {
  constructor(
    scene: Phaser.Scene,
    monsterType: string,
    col: number,
    row: number,
    gameStateService: GameStateService,
    gameMapService: GameMapServiceBase,
    onReachEndpoint: (monster: MonsterBase) => void,
    getGraphics: () => Phaser.GameObjects.Graphics,
    getDetailText: () => any,
    setDetailText: (t: any) => void,
  ) {
    super(scene, monsterType, col, row, gameStateService, gameMapService, onReachEndpoint, getGraphics, getDetailText, setDetailText);
  }

  protected prepareSpriteAsset(): void {
    this.scene.anims.create({
      key: getMonsterAnimationAssetName(this.getName(), C.MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT),
      frames: this.scene.anims.generateFrameNumbers(this.getName(), { start: 0, end: 19 }),
      frameRate: 20,
      repeat: -1,
    });

    this.setDisplaySize(40, 40);
    this.anims.play(getMonsterAnimationAssetName(this.getName(), this.direction));
    this.setCircle(15, 30, 28);

    this.maxHealth = 30 + this.gameStateService.savedData!.wave * 100;
    this.health = this.maxHealth;
    this.speed = 75;
  }
}
