import * as Phaser from 'phaser';
import { MonsterBase } from '../MonsterBase';
import { GameStateService } from '../../../services/GameStateService';
import { GameMapServiceBase } from '../../../maps/GameMapServiceBase';
import * as C from '../../../constants';
import { getMonsterAnimationAssetName } from '../../../config';

export class MonsterGrunt extends MonsterBase {
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
    const createAnim = (key: string, start: number, end: number) => {
      this.scene.anims.create({
        key,
        frames: this.scene.anims.generateFrameNumbers(C.MONSTER_GRUNT, { start, end }),
        frameRate: 10,
        repeat: -1,
      });
    };

    createAnim(getMonsterAnimationAssetName(this.getName(), C.MONSTER_MOVE_DIRECTION_TO_RIGHT), 0, 5);
    createAnim(getMonsterAnimationAssetName(this.getName(), C.MONSTER_MOVE_DIRECTION_TO_BOTTOM), 0, 5);
    createAnim(getMonsterAnimationAssetName(this.getName(), C.MONSTER_MOVE_DIRECTION_TO_LEFT), 6, 11);
    createAnim(getMonsterAnimationAssetName(this.getName(), C.MONSTER_MOVE_DIRECTION_TO_TOP), 6, 11);

    this.anims.play(getMonsterAnimationAssetName(this.getName(), this.direction), true);
    this.setCircle(10, 3, 15);

    this.maxHealth = 30 + this.gameStateService.savedData!.wave * 100;
    this.health = this.maxHealth;
    this.speed = 75;
  }
}
