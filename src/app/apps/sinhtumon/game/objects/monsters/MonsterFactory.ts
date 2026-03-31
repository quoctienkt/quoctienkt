import * as Phaser from 'phaser';
import { MonsterBase } from './MonsterBase';
import { MonsterGrunt } from './implements/MonsterGrunt';
import { MonsterHarpy } from './implements/MonsterHarpy';
import { GameStateService } from '../../services/GameStateService';
import { GameMapServiceBase } from '../../maps/GameMapServiceBase';
import * as C from '../../constants';

export class MonsterFactory {
  static createMonster(
    scene: Phaser.Scene,
    monsterType: string,
    col: number,
    row: number,
    gameStateService: GameStateService,
    gameMapService: GameMapServiceBase,
    onReachEndpoint: (monster: MonsterBase) => void,
    getGraphics: () => Phaser.GameObjects.Graphics,
    getDetailText: () => any,
    setDetailText: (t: any) => void,
  ): MonsterBase {
    const args: [
      Phaser.Scene, string, number, number, GameStateService, GameMapServiceBase,
      (m: MonsterBase) => void, () => Phaser.GameObjects.Graphics, () => any, (t: any) => void
    ] = [scene, monsterType, col, row, gameStateService, gameMapService, onReachEndpoint, getGraphics, getDetailText, setDetailText];

    if (monsterType === C.MONSTER_GRUNT) return new MonsterGrunt(...args);
    if (monsterType === C.MONSTER_HARPY) return new MonsterHarpy(...args);

    throw new Error(`Unknown monster type: ${monsterType}`);
  }
}
