import * as Phaser from 'phaser';
import type { GameMapConfig } from '../types';
import { findWay } from '../utils/mazePuzzle';
import { GameStateService } from '../services/GameStateService';
import * as C from '../constants';

export abstract class GameMapServiceBase {
  scene: Phaser.Scene | null = null;
  gameStateService: GameStateService | null = null;
  mapConfig: GameMapConfig;

  currentStartPosition: [number, number];
  currentEndPosition: [number, number];
  groundMonsterMovingPathDefault: [number, number][] | null;

  constructor(mapConfig: GameMapConfig) {
    this.mapConfig = mapConfig;
    this.currentStartPosition = [...mapConfig.START_POSITION];
    this.currentEndPosition = [...mapConfig.END_POSITION];
    this.groundMonsterMovingPathDefault = this.getGroundMonsterMovingPath();
  }

  setScene(scene: Phaser.Scene): void {
    this.scene = scene;
  }

  init(gameStateService: GameStateService): void {
    this.gameStateService = gameStateService;

    // Global animations registered once at scene init
    if (!this.scene!.anims.exists('dead')) {
      this.scene!.anims.create({
        key: 'dead',
        frames: 'onDead',
        frameRate: 500,
        repeat: 0,
      });
    }
    if (!this.scene!.anims.exists('rotate')) {
      this.scene!.anims.create({
        key: 'rotate',
        frames: 'sell',
        frameRate: 10,
        repeat: -1,
      });
    }

    const CW = this.mapConfig.CELL_WIDTH;
    const CH = this.mapConfig.CELL_HEIGHT;
    const PAD = this.mapConfig.GAME_BOARD_PADDING_TOP;

    // Entrance portal coordinates
    const startX = this.currentStartPosition[1] * CW + CW / 2;
    const startY = this.currentStartPosition[0] * CH + CH / 2 + PAD;

    // Exit portal coordinates
    const endX = this.currentEndPosition[1] * CW + CW / 2;
    const endY = this.currentEndPosition[0] * CH + CH / 2 + PAD;

    // Pulse Green portal for Entrance
    const entrancePortal = this.scene!.add.graphics().setDepth(-2);
    this.scene!.tweens.addCounter({
      from: 0.35,
      to: 0.5,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      onUpdate: (tw) => {
        if (!entrancePortal.active) return;
        entrancePortal.clear();
        const r = CW * (tw.getValue() ?? 0.4);
        entrancePortal.fillStyle(0x00ff88, 0.15);
        entrancePortal.fillCircle(startX, startY, r);
        entrancePortal.lineStyle(2, 0x00ff88, 0.6);
        entrancePortal.strokeCircle(startX, startY, r);
        entrancePortal.lineStyle(1.5, 0xffffff, 0.4);
        entrancePortal.strokeCircle(startX, startY, r * 0.6);
      },
    });

    // Pulse Red portal for Exit
    const exitPortal = this.scene!.add.graphics().setDepth(-2);
    this.scene!.tweens.addCounter({
      from: 0.35,
      to: 0.5,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      onUpdate: (tw) => {
        if (!exitPortal.active) return;
        exitPortal.clear();
        const r = CW * (tw.getValue() ?? 0.4);
        exitPortal.fillStyle(0xff3333, 0.15);
        exitPortal.fillCircle(endX, endY, r);
        exitPortal.lineStyle(2, 0xff3333, 0.6);
        exitPortal.strokeCircle(endX, endY, r);
        exitPortal.lineStyle(1.5, 0xffffff, 0.4);
        exitPortal.strokeCircle(endX, endY, r * 0.6);
      },
    });

    // Background — use mapConfig.backgroundKey if available, else fallback
    const bgKey = this.mapConfig.backgroundKey ?? 'background1';
    const background = this.scene!.add.image(-2, 0, bgKey).setOrigin(0);
    background.setDepth(-3);
    background.setDisplaySize(
      this.scene!.game.config.width as number,
      5 + (this.scene!.game.config.height as number),
    );
  }

  getGroundMonsterMovingPath(
    map: number[][] | null = null,
    startPosition: [number, number] | null = null,
    endPosition: [number, number] | null = null,
  ): [number, number][] | null {
    return findWay(
      map ?? this.mapConfig.map,
      startPosition ?? this.currentStartPosition,
      endPosition ?? this.currentEndPosition,
    );
  }

  tryUpdateMap(col: number, row: number, cellState: number): boolean {
    const nextMapState = this.mapConfig.map.map((r) => [...r]);
    nextMapState[row][col] = cellState;

    const newGroundPath = this.getGroundMonsterMovingPath(nextMapState);
    if (!newGroundPath) return false;

    const newMonstersPathList: ([number, number][] | null)[] = [];
    for (const monster of this.gameStateService!.savedData!.monsters) {
      if (monster.getMoveType() === C.MONSTER_MOVE_TYPE_GROUND) {
        const monsterPosition: [number, number] = [
          Math.floor(
            (monster.y - this.mapConfig.GAME_BOARD_PADDING_TOP) /
              this.mapConfig.CELL_HEIGHT,
          ),
          Math.floor(monster.x / this.mapConfig.CELL_WIDTH),
        ];
        const newPath = this.getGroundMonsterMovingPath(
          nextMapState,
          monsterPosition,
          this.mapConfig.END_POSITION,
        );
        if (!newPath) return false;
        newMonstersPathList.push(newPath);
      } else {
        newMonstersPathList.push(null);
      }
    }

    this.gameStateService!.savedData!.monsters.forEach((monster, i) => {
      monster.updateMonsterPath(newMonstersPathList[i]);
    });

    this.mapConfig.map = nextMapState;
    this.groundMonsterMovingPathDefault = newGroundPath;
    return true;
  }
}
