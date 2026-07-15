import * as Phaser from 'phaser';
import { GameStateService } from '../services/GameStateService';
import { GameMapServiceBase } from '../maps/GameMapServiceBase';

export class Square extends Phaser.Physics.Arcade.Sprite {
  gameStateService: GameStateService;
  gameMapService: GameMapServiceBase;
  posX: number;
  posY: number;

  private onBuyTower: (square: Square) => void;
  private isBuying: () => boolean;
  private glowGraphic: Phaser.GameObjects.Graphics;
  private pulseTween: Phaser.Tweens.Tween | null = null;

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

    // Invisible base sprite used for physics overlap & hover
    this.setAlpha(0.001);
    this.setDisplaySize(
      gameMapService.mapConfig.CELL_WIDTH,
      gameMapService.mapConfig.CELL_HEIGHT,
    );

    // Create the procedural diamond glow overlay
    this.glowGraphic = scene.add.graphics().setDepth(1);
    this.drawGlow(0.12);

    this.setInteractive();
    this.bindEvents();
  }

  private drawGlow(alpha: number): void {
    const W = this.gameMapService.mapConfig.CELL_WIDTH;
    const H = this.gameMapService.mapConfig.CELL_HEIGHT;
    this.glowGraphic.clear();
    
    // Draw semi-transparent diamond
    const pts = [
      { x: this.x, y: this.y - H / 2 + 2 },
      { x: this.x + W / 2 - 2, y: this.y },
      { x: this.x, y: this.y + H / 2 - 2 },
      { x: this.x - W / 2 + 2, y: this.y }
    ];

    this.glowGraphic.fillStyle(0x4af7a0, alpha * 0.35);
    this.glowGraphic.fillPoints(pts, true);
    
    this.glowGraphic.lineStyle(1.5, 0x4af7a0, alpha);
    this.glowGraphic.strokePoints(pts, true);
  }

  private startPulse(): void {
    if (this.pulseTween) return;

    this.pulseTween = this.scene.tweens.addCounter({
      from: 0.2,
      to: 0.85,
      duration: 500,
      yoyo: true,
      repeat: -1,
      onUpdate: (tween) => {
        this.drawGlow(tween.getValue() ?? 0);
      }
    });
  }

  private stopPulse(finalAlpha: number): void {
    if (this.pulseTween) {
      this.pulseTween.stop();
      this.pulseTween = null;
    }
    this.drawGlow(finalAlpha);
  }

  private bindEvents(): void {
    this.on('pointerdown', () => {
      (this.scene as any).showBuildMenu(this);
    });

    this.on('pointerover', () => {
      this.startPulse();
    });

    this.on('pointerout', () => {
      this.stopPulse(0.12);
    });
  }

  destroy(fromScene?: boolean): void {
    this.stopPulse(0);
    this.glowGraphic.destroy();
    super.destroy(fromScene);
  }
}
