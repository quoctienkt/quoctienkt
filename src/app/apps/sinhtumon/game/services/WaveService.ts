import * as Phaser from 'phaser';
import { EventBus } from './EventBus';
import { GameStateService } from './GameStateService';
import { GameMapServiceBase } from '../maps/GameMapServiceBase';
import { MonsterFactory } from '../objects/monsters/MonsterFactory';
import { wavesConfig } from '../config/waves.config';
import * as C from '../constants';
import type { WaveDefinition } from '../types';
import { SoundManager } from './SoundManager';


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
  public totalWaves = 0;
  public isEndless = false;

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
    this.isEndless = mapKey === C.MAP_CROSSROADS;
  }

  get currentWave(): number {
    return this.stateService.savedData!.wave;
  }
  get isLastWave(): boolean {
    if (this.isEndless) return false;
    return this.currentWaveIndex >= this.totalWaves;
  }

  start(): void {
    // Start with a 30-second delay for the very first wave to let players build towers
    const initialDelay = 30000;
    this.nextWaveCountdown = initialDelay;
    this.nextWaveTimer = this.scene.time.addEvent({
      delay: initialDelay,
      loop: false,
      callback: () => {
        this.spawnNextWave();
        this.scheduleNextWave();
      },
    });
  }

  sendWaveEarly(): void {
    const remainingSec = Math.ceil(this.nextWaveCountdown / 1000);
    if (remainingSec > 0) {
      this.stateService.setGold((g) => g + remainingSec);
      SoundManager.getInstance().playBuy(); // play gold coin sound
      
      // Visual text overlay for reward feedback
      const W = this.scene.cameras.main.width;
      const rewardText = this.scene.add.text(W / 2, 80, `+${remainingSec} Gold (Early Wave Bonus!)`, {
        fontSize: '14px',
        color: '#ffd700',
        fontFamily: 'Roboto, sans-serif',
        fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(200);
      this.scene.tweens.add({
        targets: rewardText,
        y: 60,
        alpha: 0,
        duration: 1500,
        onComplete: () => rewardText.destroy()
      });
    }

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

  private generateProceduralWave(waveNum: number): WaveDefinition {
    const spawns = [];
    
    // Every 10 waves (e.g. 30, 40, 50...), spawn a boss
    if (waveNum % 10 === 0) {
      const bosses = [C.BOSS_GOLEM, C.BOSS_DEMON, C.BOSS_BEHOLDER];
      const bossType = bosses[Math.floor((waveNum / 10 - 1) % bosses.length)];
      // Increase boss count slightly in very high waves
      const bossCount = Math.min(3, Math.floor(waveNum / 30) + 1);
      spawns.push({ type: bossType, count: bossCount, interval: 2500, delay: 0 });
      
      // Add fast minions as support
      const supportPool = [C.MONSTER_WOLF, C.MONSTER_BAT, C.MONSTER_SPIDER];
      const supportType = supportPool[Math.floor(Math.random() * supportPool.length)];
      const supportCount = 8 + Math.floor(waveNum * 0.4);
      spawns.push({ type: supportType, count: supportCount, interval: 400, delay: 4000 });
    } else {
      // Normal wave: mix of ground and flying monsters
      // The number of distinct groups ranges from 1 to 4 depending on wave
      const numGroups = Math.min(4, Math.floor(waveNum / 8) + 1);
      
      const groundTypes = [
        C.MONSTER_GRUNT, C.MONSTER_ORC, C.MONSTER_TROLL, 
        C.MONSTER_MUMMY, C.MONSTER_SPIDER, C.MONSTER_LARVA, 
        C.MONSTER_SKELETON, C.MONSTER_ICE_ELEMENTAL, C.MONSTER_WOLF
      ];
      const flyingTypes = [
        C.MONSTER_HARPY, C.MONSTER_BAT, C.MONSTER_DRAGON, C.MONSTER_VULTURE
      ];
      
      for (let i = 0; i < numGroups; i++) {
        // High waves have more flyers
        const isFlying = Math.random() < 0.3 || (waveNum >= 5 && i === 1 && Math.random() < 0.5);
        const pool = isFlying ? flyingTypes : groundTypes;
        const type = pool[Math.floor(Math.random() * pool.length)];
        
        let count = 6 + Math.floor(waveNum * 0.45);
        let interval = Math.max(250, 700 - waveNum * 8);
        
        // Large/boss-like normal mobs are spawned in smaller numbers
        if (type === C.MONSTER_DRAGON || type === C.MONSTER_TROLL) {
          count = Math.max(2, Math.floor(count / 3));
          interval = 1200;
        }
        
        spawns.push({
          type,
          count,
          interval,
          delay: i * 3500,
        });
      }
    }
    
    return { waveNumber: waveNum, spawns };
  }

  private spawnNextWave(): void {
    let waveDef: WaveDefinition;
    
    if (this.isEndless) {
      this.stateService.setWave((w) => w + 1);
      const waveNum = this.stateService.savedData!.wave;
      
      if (this.currentWaveIndex < this.waves.length) {
        waveDef = this.waves[this.currentWaveIndex++];
      } else {
        waveDef = this.generateProceduralWave(waveNum);
        this.currentWaveIndex++;
      }
      
      this.eventBus.emit(C.EVT_WAVE_START, {
        wave: waveNum,
        total: Infinity,
      });

      // Event Log trigger
      const mNames = waveDef.spawns.map(g => {
        const type = g.type === C.MONSTER_DRAGON ? C.MONSTER_VULTURE : g.type;
        return `${g.count}x ${type.replace('Monster_', '').replace('Boss_', '')}`;
      }).join(', ');
      this.eventBus.emit('HUD_ADD_LOG', {
        text: `📢 Wave ${waveNum} spawning: ${mNames}`,
        color: '#00ffff'
      });

      const isBossWave = waveNum % 10 === 0;
      if (isBossWave) {
        this.eventBus.emit('HUD_ADD_LOG', {
          text: `⚠ BOSS WARNING: A powerful boss has arrived!`,
          color: '#ff3333'
        });
      }

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
        }
      });
    } else {
      if (this.currentWaveIndex >= this.totalWaves) {
        this.eventBus.emit(C.EVT_ALL_WAVES_DONE, {});
        return;
      }
      waveDef = this.waves[this.currentWaveIndex++];
      this.stateService.setWave((w) => w + 1);
      const waveNum = this.stateService.savedData!.wave;
      this.eventBus.emit(C.EVT_WAVE_START, {
        wave: waveNum,
        total: this.totalWaves,
      });

      // Event Log trigger
      const mNames = waveDef.spawns.map(g => {
        const type = g.type === C.MONSTER_DRAGON ? C.MONSTER_VULTURE : g.type;
        return `${g.count}x ${type.replace('Monster_', '').replace('Boss_', '')}`;
      }).join(', ');
      this.eventBus.emit('HUD_ADD_LOG', {
        text: `📢 Wave ${waveNum} spawning: ${mNames}`,
        color: '#00ffff'
      });

      const isBossWave = waveNum === 10 || waveNum === 20;
      if (isBossWave) {
        this.eventBus.emit('HUD_ADD_LOG', {
          text: `⚠ BOSS WARNING: A powerful boss has arrived!`,
          color: '#ff3333'
        });
      }

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
  }

  public spawnMonster(monsterType: string): void {
    const startup = this.mapService.mapConfig.START_POSITION;
    const type = monsterType === C.MONSTER_DRAGON ? C.MONSTER_VULTURE : monsterType;
    const monster = MonsterFactory.createMonster(
      this.scene,
      type,
      startup[1], // col (0)
      -1,         // row (-1: spawns inside the top gate off-board)
      this.stateService,
      this.mapService,
      this.callbacks.onMonsterReachEnd,
      this.eventBus,
    );
    this.stateService.savedData!.monsters.push(monster);
  }
}
