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

    this.scene!.add.text(5, 60, 'Entrance', {
      fontSize: '15px',
      color: '#ffffff',
      fontFamily: 'Roboto, sans-serif',
    });
    this.scene!.add.text(445, 635, 'Exit', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Roboto, sans-serif',
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
