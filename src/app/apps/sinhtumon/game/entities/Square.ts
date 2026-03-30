import * as Phaser from 'phaser';
import type { GameStateService } from '../services/GameStateService';
import type { GameMapServiceBase } from '../maps/GameMapServiceBase';
import type { Tower, GameState } from './Tower';

export class Square extends Phaser.Physics.Arcade.Sprite {
  _gameStateService: GameStateService;
  _gameMapService: GameMapServiceBase;
  posX: number;
  posY: number;

  private _TowerClass: typeof Tower;
  private _state: GameState;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    gameStateService: GameStateService,
    gameMapService: GameMapServiceBase,
    TowerClass: typeof Tower,
    state: GameState,
  ) {
    super(
      scene,
      x * gameMapService.mapConfig.CELL_WIDTH + gameMapService.mapConfig.CELL_WIDTH / 2,
      y * gameMapService.mapConfig.CELL_HEIGHT +
        gameMapService.mapConfig.CELL_HEIGHT / 2 +
        gameMapService.mapConfig.GAME_BOARD_PADDING_TOP,
      'square',
    );

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this._gameStateService = gameStateService;
    this._gameMapService = gameMapService;
    this._TowerClass = TowerClass;
    this._state = state;
    this.posX = x;
    this.posY = y;

    this.setAlpha(0.1);
    this.setDisplaySize(
      gameMapService.mapConfig.CELL_WIDTH,
      gameMapService.mapConfig.CELL_HEIGHT,
    );
    this.init();
  }

  init() {
    this.setInteractive();

    this.on('pointerdown', () => {
      this.setAlpha(0.1);
      const tempTower = this._state.getTempTower();
      if (this._state.isBuying() && this._gameStateService.savedData!.gold >= 70) {
        const success = this._gameMapService.tryUpdateMap(
          this.posX,
          this.posY,
          this._gameMapService.mapConfig.CELL_BLOCKED,
        );
        if (!success) return;

        const tower = new this._TowerClass(
          this.scene,
          this.x,
          this.y,
          tempTower!.getName(),
          1,
          this._gameStateService,
          this._gameMapService,
          this._state,
          true,
          false,
          Square,
        );

        this._gameStateService.setGold((gold) => gold - tempTower!.getUpgradeCost());
        this.destroy();
        this._gameStateService.savedData!.towers.push(tower);
      }
    });

    this.on('pointerover', () => {
      if (this._state.isBuying()) this.setAlpha(1);
    });

    this.on('pointerout', () => {
      if (this._state.isBuying()) this.setAlpha(0.1);
    });
  }
}
