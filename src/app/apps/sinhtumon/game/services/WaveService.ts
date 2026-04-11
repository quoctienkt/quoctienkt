import * as Phaser from 'phaser';
import { EventBus } from './EventBus';
import { GameStateService } from './GameStateService';
import { GameMapServiceBase } from '../maps/GameMapServiceBase';
import { MonsterFactory } from '../objects/monsters/MonsterFactory';
import { wavesConfig } from '../config/waves.config';
import * as C from '../constants';
import type { WaveDefinition } from '../types';

export interface WaveServiceCallbacks {
  onMonsterReachEnd: (monster: any) => void;
}

/**
 * Manages scripted wave spawning.
 * Reads WaveDefinition[] from wavesConfig and schedules spawn groups.
 */
export class WaveService {
  private scene: Phaser.Scene;
  private stateService: GameStateService;
  private mapService: GameMapServiceBase;
  private eventBus: EventBus;
  private callbacks: WaveServiceCallbacks;

  private waves: WaveDefinition[] = [];
  private currentWaveIndex = 0;
  private totalWaves = 0;

  private nextWaveTimer: Phaser.Time.TimerEvent | null = null;
  private readonly WAVE_INTERVAL = 20000;
  nextWaveCountdown = 0;

  constructor(
    scene: Phaser.Scene,
    stateService: GameStateService,
    mapService: GameMapServiceBase,
    callbacks: WaveServiceCallbacks,
  ) {
    this.scene = scene;
    this.stateService = stateService;
    this.mapService = mapService;
    this.callbacks = callbacks;
    this.eventBus = scene.game.registry.get('eventBus') as EventBus;

    const mapKey = stateService.savedData!.mapKey;
    this.waves = wavesConfig[mapKey] ?? [];
    this.totalWaves = this.waves.length;
  }

  get currentWave(): number {
    return this.stateService.savedData!.wave;
  }
  get isLastWave(): boolean {
    return this.currentWaveIndex >= this.totalWaves;
  }

  start(): void {
    this.spawnNextWave();
    this.scheduleNextWave();
  }

  sendWaveEarly(): void {
    this.nextWaveTimer?.destroy();
    this.nextWaveTimer = null;
    this.nextWaveCountdown = 0;
    this.spawnNextWave();
    this.scheduleNextWave();
  }

  update(_time: number, delta: number): void {
    if (this.nextWaveCountdown > 0) {
      this.nextWaveCountdown = Math.max(0, this.nextWaveCountdown - delta);
    }
  }

  destroy(): void {
    this.nextWaveTimer?.destroy();
    this.nextWaveTimer = null;
  }

  private scheduleNextWave(): void {
    if (this.isLastWave) return;
    this.nextWaveCountdown = this.WAVE_INTERVAL;
    this.nextWaveTimer = this.scene.time.addEvent({
      delay: this.WAVE_INTERVAL,
      loop: false,
      callback: () => {
        this.spawnNextWave();
        this.scheduleNextWave();
      },
    });
  }

  private spawnNextWave(): void {
    if (this.currentWaveIndex >= this.totalWaves) {
      this.eventBus.emit(C.EVT_ALL_WAVES_DONE, {});
      return;
    }
    const waveDef = this.waves[this.currentWaveIndex++];
    this.stateService.setWave((w) => w + 1);
    this.eventBus.emit(C.EVT_WAVE_START, {
      wave: this.stateService.savedData!.wave,
      total: this.totalWaves,
    });

    let maxEnd = 0;
    for (const group of waveDef.spawns) {
      const gDelay = group.delay ?? 0;
      for (let i = 0; i < group.count; i++) {
        const delay = gDelay + i * group.interval;
        this.scene.time.delayedCall(delay, () => this.spawnMonster(group.type));
      }
      const groupEnd = gDelay + group.count * group.interval;
      if (groupEnd > maxEnd) maxEnd = groupEnd;
    }
    // After spawn window: check for wave complete
    this.scene.time.delayedCall(maxEnd + 5000, () => {
      if ((this.stateService.savedData!.monsters?.length ?? 0) === 0) {
        this.eventBus.emit(C.EVT_WAVE_COMPLETE, {
          wave: this.stateService.savedData!.wave,
        });
        if (this.currentWaveIndex >= this.totalWaves) {
          this.eventBus.emit(C.EVT_ALL_WAVES_DONE, {});
        }
      }
    });
  }

  private spawnMonster(monsterType: string): void {
    const startup = this.mapService.mapConfig.START_POSITION;
    const monster = MonsterFactory.createMonster(
      this.scene,
      monsterType,
      startup[1], // col
      startup[0], // row
      this.stateService,
      this.mapService,
      this.callbacks.onMonsterReachEnd,
      this.eventBus,
    );
    this.stateService.savedData!.monsters.push(monster);
  }
}
