import * as Phaser from 'phaser';
import { MonsterBase, type MonsterContext } from './MonsterBase';
import { MonsterGrunt } from './implements/ground/MonsterGrunt';
import { MonsterOrc } from './implements/ground/MonsterOrc';
import { MonsterTroll } from './implements/ground/MonsterTroll';
import { MonsterMummy } from './implements/ground/MonsterMummy';
import { MonsterSpider } from './implements/ground/MonsterSpider';
import { MonsterHarpy } from './implements/flying/MonsterHarpy';
import { MonsterBat } from './implements/flying/MonsterBat';
import { MonsterDragon } from './implements/flying/MonsterDragon';
import { BossGolem } from './implements/boss/BossGolem';
import { BossDemon } from './implements/boss/BossDemon';
import { GameStateService } from '../../services/GameStateService';
import { GameMapServiceBase } from '../../maps/GameMapServiceBase';
import { EventBus } from '../../services/EventBus';
import * as C from '../../constants';

export class MonsterFactory {
  static createMonster(
    scene: Phaser.Scene,
    monsterType: string,
    col: number,
    row: number,
    stateService: GameStateService,
    mapService: GameMapServiceBase,
    onReachEndpoint: (monster: MonsterBase) => void,
    eventBus: EventBus,
  ): MonsterBase {
    const ctx: MonsterContext = {
      monsterType,
      col,
      row,
      stateService,
      mapService,
      eventBus,
      onReachEndpoint,
    };

    switch (monsterType) {
      case C.MONSTER_GRUNT:
        return new MonsterGrunt(scene, ctx);
      case C.MONSTER_ORC:
        return new MonsterOrc(scene, ctx);
      case C.MONSTER_TROLL:
        return new MonsterTroll(scene, ctx);
      case C.MONSTER_MUMMY:
        return new MonsterMummy(scene, ctx);
      case C.MONSTER_SPIDER:
        return new MonsterSpider(scene, ctx);
      case C.MONSTER_HARPY:
        return new MonsterHarpy(scene, ctx);
      case C.MONSTER_BAT:
        return new MonsterBat(scene, ctx);
      case C.MONSTER_DRAGON:
        return new MonsterDragon(scene, ctx);
      case C.BOSS_GOLEM:
        return new BossGolem(scene, ctx);
      case C.BOSS_DEMON:
        return new BossDemon(scene, ctx);
      default:
        throw new Error(`Unknown monster type: ${monsterType}`);
    }
  }
}
