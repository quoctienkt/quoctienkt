import * as Phaser from 'phaser';
import { CONSTANTS, getMonsterAnimationAssetName } from '../../constants';
import { MonsterBase } from './MonsterBase';
import type { GameStateService } from '../../services/GameStateService';
import type { GameMapServiceBase } from '../../maps/GameMapServiceBase';

export class MonsterThief extends MonsterBase {
  constructor(
    scene: Phaser.Scene,
    monsterType: string,
    col: number,
    row: number,
    gameStateService: GameStateService,
    gameMapService: GameMapServiceBase,
    graphics: Phaser.GameObjects.Graphics,
    detailText: () => Phaser.GameObjects.Text | null,
    setDetailText: (t: Phaser.GameObjects.Text | null) => void,
    setDetailTextClicked: (v: boolean) => void,
    monsterReachEndpoint: any,
  ) {
    super(
      scene,
      monsterType,
      col,
      row,
      gameStateService,
      gameMapService,
      graphics,
      detailText,
      setDetailText,
      setDetailTextClicked,
      monsterReachEndpoint,
    );
  }

  prepareSpriteAsset() {
    const createAnim = (direction: string, startFrame: number, endFrame: number) => {
      this.scene.anims.create({
        key: getMonsterAnimationAssetName(this.getName(), direction),
        frames: this.scene.anims.generateFrameNumbers(CONSTANTS.MONSTER_THIEF, {
          start: startFrame,
          end: endFrame,
        }),
        frameRate: 10,
        repeat: -1,
      });
    };

    createAnim(CONSTANTS.MONSTER_MOVE_DIRECTION_TO_RIGHT, 0, 5);
    createAnim(CONSTANTS.MONSTER_MOVE_DIRECTION_TO_BOTTOM, 0, 5);
    createAnim(CONSTANTS.MONSTER_MOVE_DIRECTION_TO_LEFT, 6, 11);
    createAnim(CONSTANTS.MONSTER_MOVE_DIRECTION_TO_TOP, 6, 11);

    this.anims.play(getMonsterAnimationAssetName(this.getName(), this.direction), true);
    this.setCircle(10, 3, 15);
    this.maxHealth = 30 + this._gameStateService.savedData!.wave * 100;
    this.health = 30 + this._gameStateService.savedData!.wave * 100;
    this.speed = 75;
  }
}
