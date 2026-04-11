import { GameMapServiceBase } from '../GameMapServiceBase';
import * as C from '../../constants';
import type { GameMapConfig } from '../../types';

// S-shaped winding path through volcanic terrain
const MAP: number[][] = [
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const CONFIG: GameMapConfig = {
  mapKey: C.MAP_VOLCANO,
  map: MAP,
  GAME_BOARD_PADDING_TOP: 80,
  CELL_WIDTH: 40,
  CELL_HEIGHT: 39,
  START_POSITION: [0, 0],
  END_POSITION: [12, 13],
  CELL_AVAILABLE: 0,
  CELL_BLOCKED: 1,
  backgroundKey: 'background_volcano',
  displayName: 'Volcano Pass',
  totalWaves: 20,
};

export class VolcanoMapService extends GameMapServiceBase {
  constructor() {
    super(CONFIG);
  }
}
