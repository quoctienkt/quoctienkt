import * as Phaser from 'phaser';
import { CONSTANTS, getMonsterAnimationAssetName } from '../../constants';
import { MonsterBase } from './MonsterBase';
import type { GameStateService } from '../../services/GameStateService';
import type { GameMapServiceBase } from '../../maps/GameMapServiceBase';

export class MonsterButterfly extends MonsterBase {
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
    this.scene.anims.create({
      key: getMonsterAnimationAssetName(
        this.getName(),
        CONSTANTS.MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT,
      ),
      frames: this.scene.anims.generateFrameNumbers(this.getName(), {
        start: 0,
        end: 19,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.setDisplaySize(40, 40);
    this.anims.play(getMonsterAnimationAssetName(this.getName(), this.direction));
    this.setCircle(15, 30, 28);
    this.maxHealth = 30 + this._gameStateService.savedData!.wave * 100;
    this.health = 30 + this._gameStateService.savedData!.wave * 100;
    this.speed = 75;
  }
}
