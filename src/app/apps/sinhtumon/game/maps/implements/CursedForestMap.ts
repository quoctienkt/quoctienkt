import { GameMapServiceBase } from '../GameMapServiceBase';
import * as C from '../../constants';
import type { GameMapConfig } from '../../types';

// Winding cursed forest path — 2 mini-detours for extra difficulty
const MAP: number[][] = [
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
];

const CONFIG: GameMapConfig = {
  mapKey: C.MAP_CURSED_FOREST,
  map: MAP,
  GAME_BOARD_PADDING_TOP: 80,
  CELL_WIDTH: 40,
  CELL_HEIGHT: 39,
  START_POSITION: [0, 0],
  END_POSITION: [13, 13],
  CELL_AVAILABLE: 0,
  CELL_BLOCKED: 1,
  backgroundKey: 'background_forest',
  displayName: 'Cursed Forest',
  totalWaves: 20,
};

export class CursedForestMapService extends GameMapServiceBase {
  constructor() {
    super(CONFIG);
  }
}
