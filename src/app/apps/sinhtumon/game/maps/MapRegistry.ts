import * as C from '../constants';
import { GameMapServiceBase } from './GameMapServiceBase';
import { CrossroadsMapService } from './implements/CrossroadsMap';
import { VolcanoMapService } from './implements/VolcanoMap';
import { IceValleyMapService } from './implements/IceValleyMap';
import { CursedForestMapService } from './implements/CursedForestMap';

export const MapRegistry: Record<string, () => GameMapServiceBase> = {
  [C.MAP_CROSSROADS]: () => new CrossroadsMapService(),
  [C.MAP_VOLCANO]: () => new VolcanoMapService(),
  [C.MAP_ICE_VALLEY]: () => new IceValleyMapService(),
  [C.MAP_CURSED_FOREST]: () => new CursedForestMapService(),
};

export function createMapService(mapKey: string): GameMapServiceBase {
  const factory = MapRegistry[mapKey];
  if (!factory) throw new Error(`Unknown map key: ${mapKey}`);
  return factory();
}
