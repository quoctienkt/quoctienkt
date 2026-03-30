import * as Phaser from 'phaser';
import { CONSTANTS } from '../constants';
import { findWay } from '../mazePuzzle';
import type { GameStateService } from '../services/GameStateService';

export interface MapConfig {
  mapKey: string;
  map: number[][];
  GAME_BOARD_PADDING_TOP: number;
  CELL_WIDTH: number;
  CELL_HEIGHT: number;
  START_POSITION: [number, number];
  END_POSITION: [number, number];
  CELL_AVAILABLE: number;
  CELL_BLOCKED: number;
}

// Factory signatures injected from main.ts to break circular dep
type SquareFactory = (scene: Phaser.Scene, col: number, row: number) => void;
type TowerFactory = (
  scene: Phaser.Scene,
  x: number,
  y: number,
  towerType: string,
  level: number,
  bindEvents: boolean,
  isSampleTower: boolean,
) => void;

export class GameMapServiceBase {
  _gameStateService: GameStateService | null = null;
  scene: Phaser.Scene | null = null;
  mapConfig: MapConfig;
  currentStartPosition: [number, number];
  currentEndPosition: [number, number];
  groundMonsterMovingPathDefault: [number, number][] | null;

  private _squareFactory: SquareFactory | null = null;
  private _towerFactory: TowerFactory | null = null;

  constructor(mapConfig: MapConfig) {
    this.mapConfig = mapConfig;
    this.currentStartPosition = [...mapConfig.START_POSITION];
    this.currentEndPosition = [...mapConfig.END_POSITION];
    this.groundMonsterMovingPathDefault = this.getGroundMonsterMovingPath();
  }

  injectClasses(squareFactory: SquareFactory, towerFactory: TowerFactory) {
    this._squareFactory = squareFactory;
    this._towerFactory = towerFactory;
  }

  setScene(scene: Phaser.Scene) {
    this.scene = scene;
  }

  init(gameStateService: GameStateService) {
    this._gameStateService = gameStateService;

    this.scene!.anims.create({
      key: 'dead',
      frames: 'onDead',
      frameRate: 500,
      repeat: 0,
    });

    this.scene!.anims.create({
      key: 'rotate',
      frames: 'sell',
      frameRate: 10,
      repeat: -1,
    });

    this.scene!.add.text(5, 60, 'Cửa vào', {
      fontSize: '15px',
      color: '#ffffff',
      fontFamily: 'roboto',
    });
    this.scene!.add.text(445, 635, 'Cửa ra', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'roboto',
    });

    const background = this.scene!.add.image(-2, 0, 'background1').setOrigin(0);
    background.setDepth(-3);
    background.setDisplaySize(
      520 + 150,
      5 + 60 + 520 + this.mapConfig.GAME_BOARD_PADDING_TOP,
    );

    for (let row = 0; row < this.mapConfig.map.length; row++) {
      for (let col = 0; col < this.mapConfig.map[row].length; col++) {
        if (!this.mapConfig.map[row][col]) {
          this._squareFactory!(this.scene!, col, row);
        }
      }
    }

    this._towerFactory!(
      this.scene!,
      640,
      340,
      'Tower_Snowflake',
      1,
      true,
      true,
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
    const nextMapState = [...this.mapConfig.map];
    nextMapState[row] = [...nextMapState[row]];
    nextMapState[row][col] = cellState;

    const newGroundMonsterMovingPath =
      this.getGroundMonsterMovingPath(nextMapState);
    if (newGroundMonsterMovingPath == null) return false;

    const newMonstersPathList: ([number, number][] | null)[] = [];
    const monsters = this._gameStateService!.savedData!.monsters;

    for (let i = 0; i < monsters.length; i++) {
      if (monsters[i].getMoveType() === CONSTANTS.MONSTER_MOVE_TYPE_GROUND) {
        const monsterPosition: [number, number] = [
          parseInt(
            String(
              (monsters[i].y - this.mapConfig.GAME_BOARD_PADDING_TOP) /
                this.mapConfig.CELL_HEIGHT,
            ),
          ),
          parseInt(String(monsters[i].x / this.mapConfig.CELL_WIDTH)),
        ];

        const newMonsterPath = this.getGroundMonsterMovingPath(
          nextMapState,
          monsterPosition,
          this.mapConfig.END_POSITION,
        );
        if (!newMonsterPath) return false;
        newMonstersPathList.push(newMonsterPath);
      } else {
        newMonstersPathList.push(null);
      }
    }

    monsters.forEach((monster: any, i: number) => {
      monster.updateMonsterPath(newMonstersPathList[i]);
    });

    this.mapConfig.map = nextMapState;
    this.groundMonsterMovingPathDefault = newGroundMonsterMovingPath;
    return true;
  }
}
