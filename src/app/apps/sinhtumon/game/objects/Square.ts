import * as Phaser from 'phaser';
import { GameStateService } from '../services/GameStateService';
import { GameMapServiceBase } from '../maps/GameMapServiceBase';

export class Square extends Phaser.Physics.Arcade.Sprite {
  gameStateService: GameStateService;
  gameMapService: GameMapServiceBase;
  posX: number;
  posY: number;

  // References injected by MainScene to support tower placement
  private onBuyTower: (square: Square) => void;
  private isBuying: () => boolean;

  constructor(
    scene: Phaser.Scene,
    col: number,
    row: number,
    gameStateService: GameStateService,
    gameMapService: GameMapServiceBase,
    isBuying: () => boolean,
    onBuyTower: (square: Square) => void,
  ) {
    super(
      scene,
      col * gameMapService.mapConfig.CELL_WIDTH +
        gameMapService.mapConfig.CELL_WIDTH / 2,
      row * gameMapService.mapConfig.CELL_HEIGHT +
        gameMapService.mapConfig.CELL_HEIGHT / 2 +
        gameMapService.mapConfig.GAME_BOARD_PADDING_TOP,
      'square',
    );
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.gameStateService = gameStateService;
    this.gameMapService = gameMapService;
    this.posX = col;
    this.posY = row;
    this.isBuying = isBuying;
    this.onBuyTower = onBuyTower;

    this.setAlpha(0.1);
    this.setDisplaySize(
      gameMapService.mapConfig.CELL_WIDTH,
      gameMapService.mapConfig.CELL_HEIGHT,
    );

    this.setInteractive();
    this.bindEvents();
  }

  private bindEvents(): void {
    this.on('pointerdown', () => {
      this.setAlpha(0.1);
      if (this.isBuying() && this.gameStateService.savedData!.gold >= 70) {
        const success = this.gameMapService.tryUpdateMap(
          this.posX,
          this.posY,
          this.gameMapService.mapConfig.CELL_BLOCKED,
        );
        if (!success) return;
        this.onBuyTower(this);
        this.destroy();
      }
    });

    this.on('pointerover', () => {
      if (this.isBuying()) this.setAlpha(1);
    });

    this.on('pointerout', () => {
      if (this.isBuying()) this.setAlpha(0.1);
    });
  }
}
