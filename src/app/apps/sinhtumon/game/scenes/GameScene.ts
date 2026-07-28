import * as Phaser from 'phaser';
import { GameStateService } from '../services/GameStateService';
import { WaveService } from '../services/WaveService';
import { EventBus } from '../services/EventBus';
import { createMapService } from '../maps/MapRegistry';
import { GameMapServiceBase } from '../maps/GameMapServiceBase';
import { TowerBase, TowerCallbacks } from '../objects/towers/TowerBase';
import { TowerFactory } from '../objects/towers/TowerFactory';
import { MonsterBase } from '../objects/monsters/MonsterBase';
import { BulletBase } from '../objects/bullets/BulletBase';
import { Square } from '../objects/Square';
import {
  getTowerUpgradeCost,
  getTowerSellPrice,
  getTowerDisplaySize,
  getTowerAttackRange,
  getTowerAttackReload,
  getTowerDefaultPriority,
  towersConfig,
} from '../config';
import * as C from '../constants';
import { FXHelper } from '../utils/FXHelper';
import { SoundManager } from '../services/SoundManager';

interface GameSceneData {
  mapKey: string;
}

const INITIAL_GOLD = 200;
const INITIAL_LIVES = 20;
const TOWER_TYPES = [
  C.TOWER_FROST,
  C.TOWER_ARCHER,
  C.TOWER_CANNON,
  C.TOWER_LIGHTNING,
  C.TOWER_POISON,
];

export class GameScene extends Phaser.Scene {
  // ─── Services ─────────────────────────────────────────────────────────────
  private stateService!: GameStateService;
  private mapService!: GameMapServiceBase;
  private waveService!: WaveService;
  private eventBus!: EventBus;

  // ─── Tower buy state ──────────────────────────────────────────────────────
  private isBuying = false;
  private isTowerClicked = false;
  private tempTower: TowerBase | null = null;
  private activeBuildMenu: Phaser.GameObjects.Container | null = null;
  private upgradeImage: any = null;
  private sellImage: any = null;
  private rangeImage: any = null;
  private detailText: any = null;
  private selectedTowerType: string = C.TOWER_FROST;
  private selectedBuildTowerType: string | null = null;
  private buildRangeGraphic: Phaser.GameObjects.Graphics | null = null;

  // ─── Gameplay & Skills ────────────────────────────────────────────────────
  private hasWon = false;
  private soldiers: any[] = [];
  private lastCombatTickTime = 0;
  private activeSkillId: string | null = null;
  private skillGhost: Phaser.GameObjects.Graphics | null = null;
  private skillMoveListener: ((ptr: Phaser.Input.Pointer) => void) | null = null;
  private skillCastListener: ((ptr: Phaser.Input.Pointer) => void) | null = null;

  // ─── Graphics ─────────────────────────────────────────────────────────────
  private graphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: C.SCENE_GAME });
  }


  init(data: GameSceneData): void {
    this.isBuying = false;
    this.isTowerClicked = false;
    this.tempTower = null;
    this.activeBuildMenu = null;
    this.upgradeImage = null;
    this.sellImage = null;
    this.rangeImage = null;
    this.detailText = null;
    this.selectedBuildTowerType = null;
    this.buildRangeGraphic = null;
    this.hasWon = false;
    this.soldiers = [];
    this.lastCombatTickTime = 0;
    this.activeSkillId = null;
    this.skillGhost = null;
    this.skillMoveListener = null;
    this.skillCastListener = null;
  }


  create(data: GameSceneData): void {
    const mapKey = data?.mapKey ?? C.MAP_CROSSROADS;
    this.registry.set('mapKey', mapKey);
    // Also store in game-level registry so GameOverScene can access it
    this.game.registry.set('mapKey', mapKey);
    this.eventBus = this.game.registry.get('eventBus') as EventBus;
    this.stateService = new GameStateService();
    this.stateService.setScene(this);
    this.stateService.init({
      towers: [],
      monsters: [],
      bullets: [],
      heroes: [],
      wave: 0,
      life: INITIAL_LIVES,
      gold: INITIAL_GOLD,
      score: 0,
      mapKey,
    });

    // Launch HUD overlay first so it can receive initial state events
    this.scene.launch(C.SCENE_HUD, { waveService: this.waveService });

    this.stateService = new GameStateService();
    this.stateService.setScene(this);
    this.stateService.init({
      towers: [],
      monsters: [],
      bullets: [],
      heroes: [],
      wave: 0,
      life: INITIAL_LIVES,
      gold: INITIAL_GOLD,
      score: 0,
      mapKey,
    });
    // Re-broadcast after a short delay to ensure HUD create() has fully run
    this.time.delayedCall(50, () => {
      this.stateService?.broadcastState();
    });

    this.mapService = createMapService(mapKey);
    this.mapService.setScene(this);
    this.mapService.init(this.stateService);

    this.graphics = this.add.graphics();
    this.buildEnvironmentLayers();

    // Wave service
    this.waveService = new WaveService(
      this,
      this.stateService,
      this.mapService,
      {
        onMonsterReachEnd: (monster: MonsterBase) =>
          this.handleMonsterReachEnd(monster),
      },
    );

    // Build map squares
    this.buildMapSquares();

    // Build tower shop sidebar
    this.buildTowerShop();

    // Close selection / build menu when clicking outside
    this.input.on(
      'pointerdown',
      (
        ptr: Phaser.Input.Pointer,
        currentlyOver: Phaser.GameObjects.GameObject[],
      ) => {
        if (currentlyOver && currentlyOver.length > 0) return;
        // Cancel any active action when clicking outside
        this.cancelCurrentAction();
      },
    );

    // Boss special events
    this.eventBus.on('BOSS_GOLEM_SPLIT', this.handleGolemSplit, this);
    this.eventBus.on('BOSS_DEMON_STOMP', this.handleDemonStomp, this);
    this.eventBus.on(C.STATUS_WEB, this.handleSpiderWeb, this);
    this.eventBus.on('HUD_SKILL_SELECT', this.handleSkillSelect, this);
    this.eventBus.on(C.EVT_ALL_WAVES_DONE, this.handleAllWavesDone, this);
    this.eventBus.on(C.EVT_GAME_OVER, ({ victory }: { victory: boolean }) => {
      this.physics.world.pause();
      this.tweens.pauseAll();
      this.time.paused = true;
      this.scene.stop(C.SCENE_HUD);
      this.scene.start(C.SCENE_GAME_OVER, { victory });
    }, this);
    this.eventBus.on(C.EVT_GAME_WIN, () => {
      this.physics.world.pause();
      this.tweens.pauseAll();
      this.scene.stop(C.SCENE_HUD);
      this.scene.start(C.SCENE_GAME_OVER, { victory: true });
    }, this);

    this.eventBus.on(
      C.EVT_WAVE_START,
      ({ wave, total }: { wave: number; total: number }) => {
        const isBossWave = wave === 10 || wave === 20; // Golem at 10, Demon at 20
        if (isBossWave) {
          FXHelper.waveBanner(this, '⚠ BOSS WAVE!', 0xff3333);
        } else {
          FXHelper.waveBanner(this, `Wave ${wave} of ${total}`, 0x4af7a0);
        }
      },
      this,
    );

    this.eventBus.on(
      'HUD_SEND_WAVE_EARLY',
      () => this.waveService.sendWaveEarly(),
      this,
    );

    this.eventBus.on(
      'HUD_TOGGLE_SPEED',
      ({ speed }: { speed: number }) => {
        this.time.timeScale = speed;
        this.tweens.timeScale = speed;
        this.physics.world.timeScale = 1 / speed;
      },
      this,
    );

    // ─── Developer Tool Event Listeners ──────────────────────────────────
    this.eventBus.on('DEV_SPAWN_MONSTER', ({ type, count }: { type: string; count?: number }) => {
      if (!this.waveService) return;
      const actualType = type === C.MONSTER_DRAGON ? C.MONSTER_VULTURE : type;
      const spawnCount = Math.max(1, count ?? 1);
      for (let i = 0; i < spawnCount; i++) {
        this.time.delayedCall(i * 400, () => {
          try {
            if (this.waveService) {
              this.waveService.spawnMonster(actualType);
            }
          } catch (err) {
            console.error('[DevTool] spawnMonster error:', err);
          }
        });
      }
      this.eventBus.emit('HUD_ADD_LOG', {
        text: `🛠 [Dev] Spawning ${spawnCount}x ${actualType.replace('Monster_', '').replace('Boss_', '')}`,
        color: '#ffcc00'
      });
    }, this);

    this.eventBus.on('DEV_TRIGGER_DEFEAT', () => {
      this.stateService.setLife(() => 0);
    }, this);

    this.eventBus.on('DEV_TRIGGER_VICTORY', () => {
      this.eventBus.emit(C.EVT_GAME_WIN, {});
    }, this);

    this.eventBus.on('DEV_ADD_GOLD', ({ amount }: { amount: number }) => {
      this.stateService.setGold((g) => g + amount);
    }, this);

    this.eventBus.on('DEV_CLEAR_MONSTERS', () => {
      const data = this.stateService.savedData!;
      // killSilently stops tweens so monsters cannot reach the exit and deal damage
      [...data.monsters].forEach(m => m.killSilently());
      data.monsters = [];
      this.eventBus.emit('HUD_ADD_LOG', {
        text: `🛠 [Dev] Cleared all monsters!`,
        color: '#ffffff'
      });
    }, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.eventBus.off('BOSS_GOLEM_SPLIT', this.handleGolemSplit, this);
      this.eventBus.off('BOSS_DEMON_STOMP', this.handleDemonStomp, this);
      this.eventBus.off(C.STATUS_WEB, this.handleSpiderWeb, this);
      this.eventBus.off('HUD_SKILL_SELECT', this.handleSkillSelect, this);
      this.eventBus.off(C.EVT_ALL_WAVES_DONE, this.handleAllWavesDone, this);
      this.eventBus.removeAllListeners(C.EVT_GAME_OVER);
      this.eventBus.removeAllListeners(C.EVT_GAME_WIN);
      this.eventBus.removeAllListeners('HUD_SEND_WAVE_EARLY');
      this.eventBus.removeAllListeners('HUD_TOGGLE_SPEED');
      this.eventBus.removeAllListeners('DEV_SPAWN_MONSTER');
      this.eventBus.removeAllListeners('DEV_TRIGGER_DEFEAT');
      this.eventBus.removeAllListeners('DEV_TRIGGER_VICTORY');
      this.eventBus.removeAllListeners('DEV_ADD_GOLD');
      this.eventBus.removeAllListeners('DEV_CLEAR_MONSTERS');
      
      this.soldiers.forEach(s => {
        if (s.sprite) s.sprite.destroy();
        if (s.healthBar) s.healthBar.destroy();
      });
      this.soldiers = [];
    });



    // Launch HUD overlay
    this.scene.launch(C.SCENE_HUD, { waveService: this.waveService });

    // Start wave system
    this.waveService.start();

    // Update HUD waveService reference after it's been set up
    const hudScene = this.scene.get(C.SCENE_HUD) as any;
    if (hudScene && hudScene.waveService !== this.waveService) {
      hudScene.waveService = this.waveService;
    }

    console.log(`[GameScene] Started — map: ${mapKey}`);
  }


  update(time: number, delta: number): void {
    this.graphics.clear();

    const data = this.stateService.savedData!;

    // Check game over
    if (data.life <= 0) return;

    // Check Victory (Wave 20)
    if (this.waveService && this.waveService.isLastWave && data.monsters.length === 0 && data.life > 0) {
      if (!this.hasWon) {
        this.hasWon = true;
        this.time.delayedCall(1500, () => {
          this.eventBus.emit(C.EVT_GAME_WIN, { score: data.score });
        });
      }
    }

    this.waveService.update(time, delta);

    // Combat tick logic for soldiers
    const timeNow = this.time.now;
    if (!this.lastCombatTickTime) this.lastCombatTickTime = 0;
    const isCombatTick = timeNow - this.lastCombatTickTime >= 1000;
    if (isCombatTick) this.lastCombatTickTime = timeNow;

    // Clean up dead soldiers
    this.soldiers = this.soldiers.filter(s => {
      if (s.isDead) return false;
      if (s.health <= 0) {
        s.isDead = true;
        s.sprite.destroy();
        s.healthBar.destroy();
        return false;
      }
      return true;
    });

    // Update health bars
    this.soldiers.forEach(s => {
      s.healthBar.clear();
      s.healthBar.fillStyle(0x000000, 0.8);
      s.healthBar.fillRect(s.sprite.x - 12, s.sprite.y - 18, 24, 4);
      const ratio = Math.max(0, s.health / s.maxHealth);
      s.healthBar.fillStyle(0x00ff00, 1);
      s.healthBar.fillRect(s.sprite.x - 12, s.sprite.y - 18, 24 * ratio, 4);
    });

    // Tick monsters
    for (let i = data.monsters.length - 1; i >= 0; i--) {
      const m = data.monsters[i];
      if (m?.active) {
        // If monster was fighting a dead soldier, release it
        if (m.fightingSoldier && m.fightingSoldier.isDead) {
          m.fightingSoldier = null;
          m.tween?.resume();
        }

        // If monster is not fighting and is close to an alive soldier, block it
        if (!m.fightingSoldier && m.getMoveType() === C.MONSTER_MOVE_TYPE_GROUND) {
          for (const s of this.soldiers) {
            if (s.isDead) continue;
            const dist = Phaser.Math.Distance.Between(m.x, m.y, s.sprite.x, s.sprite.y);
            if (dist < 20) {
              m.fightingSoldier = s;
              m.tween?.pause();
              break;
            }
          }
        }

        // Combat tick damage
        if (isCombatTick && m.fightingSoldier) {
          const dmgToSoldier = m.isBoss ? 30 : 12;
          m.fightingSoldier.health -= dmgToSoldier;
          m.takeDamage(15, C.DAMAGE_PHYSICAL);
          
          this.tweens.add({
            targets: m.fightingSoldier.sprite,
            x: m.fightingSoldier.sprite.x + (m.x > m.fightingSoldier.sprite.x ? 2 : -2),
            duration: 80,
            yoyo: true
          });
        }

        m.tick(delta, this.graphics);
      }
    }

    // Ground monster separation: gently push overlapping monsters apart
    const groundMonsters = data.monsters.filter(
      (m) => m?.active && m.getMoveType() === C.MONSTER_MOVE_TYPE_GROUND,
    );
    const SEP_RADIUS = 14; // minimum separation distance in pixels
    for (let i = 0; i < groundMonsters.length; i++) {
      for (let j = i + 1; j < groundMonsters.length; j++) {
        const a = groundMonsters[i];
        const b = groundMonsters[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        if (dist < SEP_RADIUS) {
          const push = (SEP_RADIUS - dist) * 0.5;
          const ux = dx / dist;
          const uy = dy / dist;
          // Move each monster half the overlap away (only X to preserve path Y)
          a.setX(a.x + ux * push * 0.5);
          b.setX(b.x - ux * push * 0.5);
          a.setY(a.y + uy * push * 0.3);
          b.setY(b.y - uy * push * 0.3);
        }
      }
    }

    // Move bullets
    for (let i = data.bullets.length - 1; i >= 0; i--) {
      const b = data.bullets[i];
      if (!b?.active) {
        data.bullets.splice(i, 1);
        continue;
      }
      if (b.target?.active) {
        const dist = Phaser.Math.Distance.Between(
          b.x,
          b.y,
          b.target.x,
          b.target.y,
        );
        if (dist > 4) {
          const angle = Phaser.Math.Angle.Between(
            b.x,
            b.y,
            b.target.x,
            b.target.y,
          );
          b.setRotation(angle + Math.PI / 2);
          b.setVelocity(Math.cos(angle) * b.speed, Math.sin(angle) * b.speed);
        }
      } else {
        // Target gone
        b.destroy();
        data.bullets.splice(i, 1);
      }
    }

    // Shoot & depth-sort towers
    for (const t of data.towers) {
      if (!t?.active) continue;
      t.setDepth(Math.floor(t.y));
      if (t.glowGraphic) {
        t.glowGraphic.setDepth(Math.floor(t.y) - 1);
      }
      t.shoot(this.graphics, (bullet: BulletBase, monster: MonsterBase) =>
        this.dealDamage(bullet, monster),
      );
    }
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private buildMapSquares(): void {
    const mapGrid = this.mapService.mapConfig.map;
    for (let row = 0; row < mapGrid.length; row++) {
      for (let col = 0; col < mapGrid[row].length; col++) {
        if (mapGrid[row][col] === this.mapService.mapConfig.CELL_AVAILABLE) {
          new Square(
            this,
            col,
            row,
            this.stateService,
            this.mapService,
            () => this.isBuying,
            (sq: Square) => this.onBuyTower(sq),
          );
        }
      }
    }
  }

  private onBuyTower(square: Square): void {
    const cost =
      (this as any).towersConfig?.[this.selectedTowerType]
        ?.upgradeCostPerLevel?.[0] ??
      towersConfig[this.selectedTowerType]?.upgradeCostPerLevel?.[0] ??
      80;
    if (this.stateService.savedData!.gold < cost) return;
    this.stateService.setGold((g) => g - cost);
    const CW = this.mapService.mapConfig.CELL_WIDTH;
    const CH = this.mapService.mapConfig.CELL_HEIGHT;
    const PAD = this.mapService.mapConfig.GAME_BOARD_PADDING_TOP;
    const OX = this.mapService.mapConfig.GRID_OFFSET_X ?? 0;
    const cx = OX + square.posX * CW + CW / 2;
    const cy = square.posY * CH + CH / 2 + PAD;
    const tower = this.createTower(cx, cy, this.selectedTowerType, 1, false);
    this.stateService.savedData!.towers.push(tower);

    this.eventBus.emit('HUD_ADD_LOG', {
      text: `🔨 Built: ${this.selectedTowerType.replace('Tower_', '')} Tower!`,
      color: '#ffd700'
    });

    // Tower placement particles
    FXHelper.dustBurst(this, cx, cy);

    this.cancelBuy();
  }

  private buildTowerShop(): void {
    // No-op: sidebar has been removed in full screen layout
  }

  showBuildMenu(square: Square): void {
    if (this.activeBuildMenu) {
      this.activeBuildMenu.destroy();
      this.activeBuildMenu = null;
    }
    this.selectedBuildTowerType = null;
    this.buildRangeGraphic?.destroy();
    this.buildRangeGraphic = null;

    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    const container = this.add.container(square.x, square.y).setDepth(999);
    this.activeBuildMenu = container;

    // 1. Full-screen blocker to close menu on click outside
    const blocker = this.add
      .rectangle(0, 0, W * 2, H * 2, 0x000000, 0.001)
      .setInteractive()
      .setDepth(-1);
    blocker.on('pointerdown', () => {
      container.destroy();
      this.buildRangeGraphic?.destroy();
      this.buildRangeGraphic = null;
      this.eventBus.emit(C.EVT_TOWER_DESELECTED, {});
      if (this.activeBuildMenu === container) this.activeBuildMenu = null;
    });
    container.add(blocker);

    // 2. Tower buttons in a radial arc over the build slot
    const towers = [
      {
        type: C.TOWER_FROST,
        sym: '❄',
        cost: 80,
        color: 0x88ddff,
        desc: 'Slows enemies. Freezes at lvl 5.',
      },
      {
        type: C.TOWER_ARCHER,
        sym: '🏹',
        cost: 60,
        color: 0xffaa44,
        desc: 'Fast single-target damage.',
      },
      {
        type: C.TOWER_CANNON,
        sym: '💣',
        cost: 100,
        color: 0x888888,
        desc: 'AoE splash damage. Slow reload.',
      },
      {
        type: C.TOWER_LIGHTNING,
        sym: '⚡',
        cost: 120,
        color: 0xffff00,
        desc: 'Stuns enemies. Chains at lvl 4.',
      },
      {
        type: C.TOWER_POISON,
        sym: '🧪',
        cost: 90,
        color: 0x44ff44,
        desc: 'Poison DoT + slow effect.',
      },
    ];

    towers.forEach((t, i) => {
      // Space out cleanly around a circle (radius 60, angle spacing)
      const angleRad = Phaser.Math.DegToRad(-180 + i * 45);
      const bx = Math.cos(angleRad) * 60;
      const by = Math.sin(angleRad) * 60;

      const btnContainer = this.add.container(bx, by).setScale(0);
      container.add(btnContainer);

      const btnBg = this.add.graphics();
      const redrawBg = (isHighlighted = false) => {
        btnBg.clear();
        btnBg.fillStyle(isHighlighted ? 0x1a2e4a : 0x0a1424, 0.9);
        btnBg.fillCircle(0, 0, 18);
        btnBg.lineStyle(
          isHighlighted ? 3.0 : 1.5,
          isHighlighted ? 0xffd700 : t.color,
          1,
        );
        btnBg.strokeCircle(0, 0, 18);
      };
      redrawBg(false);
      btnContainer.add(btnBg);

      const text = this.add
        .text(0, -3, t.sym, { fontSize: '15px' })
        .setOrigin(0.5);
      btnContainer.add(text);

      const costText = this.add
        .text(0, 9, `${t.cost}`, {
          fontSize: '7px',
          color: '#ffd700',
          fontFamily: 'Roboto, sans-serif',
        })
        .setOrigin(0.5);
      btnContainer.add(costText);

      // Hit area
      const hit = this.add.circle(0, 0, 18, 0x000000, 0.001).setInteractive();
      btnContainer.add(hit);

      // Tweens entry
      this.tweens.add({
        targets: btnContainer,
        scale: 1,
        duration: 200,
        delay: i * 30,
        ease: 'Back.Out',
      });

      hit.on('pointerdown', () => {
        // First click: select and display info
        if (this.selectedBuildTowerType !== t.type) {
          this.selectedBuildTowerType = t.type;

          // Reset other buttons' visual scales and highlight states
          container.list.forEach((child: any) => {
            if (
              child &&
              child.scaleX !== undefined &&
              child !== btnContainer &&
              child !== blocker
            ) {
              const otherBg = child.list?.[0] as Phaser.GameObjects.Graphics;
              if (otherBg && typeof otherBg.clear === 'function') {
                child.setScale(1);
                // We redraw the background to default line colors
                const tIndex = container.list.indexOf(child) - 1; // offset by blocker
                const matchingTower = towers[tIndex];
                if (matchingTower) {
                  otherBg.clear();
                  otherBg.fillStyle(0x0a1424, 0.9);
                  otherBg.fillCircle(0, 0, 18);
                  otherBg.lineStyle(1.5, matchingTower.color, 1);
                  otherBg.strokeCircle(0, 0, 18);
                }
              }
            }
          });

          this.tweens.add({
            targets: btnContainer,
            scale: 1.25,
            duration: 150,
          });
          redrawBg(true);

          // Draw preview range
          this.buildRangeGraphic?.destroy();
          const r = getTowerAttackRange(t.type, 1);
          this.buildRangeGraphic = this.add.graphics().setDepth(3);
          this.buildRangeGraphic.lineStyle(1.5, 0xffd700, 0.45);
          this.buildRangeGraphic.strokeCircle(square.x, square.y, r);

          // Emit selected event so HUDScene shows the info
          this.eventBus.emit(C.EVT_TOWER_SELECTED, {
            towerType: t.type,
            level: 1,
            range: r,
            cost: t.cost,
            description: t.desc,
            isBuyingPreview: true,
          });

          // Play select tick sound
          SoundManager.getInstance().playShoot();
          return;
        }

        // Second click: buy
        const gold = this.stateService.savedData!.gold;
        if (gold >= t.cost) {
          const success = this.mapService.tryUpdateMap(
            square.posX,
            square.posY,
            this.mapService.mapConfig.CELL_BLOCKED,
          );
          if (success) {
            this.stateService.setGold((g) => g - t.cost);
            const CW = this.mapService.mapConfig.CELL_WIDTH;
            const CH = this.mapService.mapConfig.CELL_HEIGHT;
            const PAD = this.mapService.mapConfig.GAME_BOARD_PADDING_TOP;
            const OX = this.mapService.mapConfig.GRID_OFFSET_X ?? 0;
            const cx = OX + square.posX * CW + CW / 2;
            const cy = square.posY * CH + CH / 2 + PAD;
            const realTower = this.createTower(cx, cy, t.type, 1, false);
            this.stateService.savedData!.towers.push(realTower);

            FXHelper.dustBurst(this, cx, cy);
            SoundManager.getInstance().playBuy(); // SOUND EFFECT

            container.destroy();
            this.buildRangeGraphic?.destroy();
            this.buildRangeGraphic = null;
            this.eventBus.emit(C.EVT_TOWER_DESELECTED, {});
            if (this.activeBuildMenu === container) this.activeBuildMenu = null;
            square.destroy();
          }
        } else {
          FXHelper.floatingText(
            this,
            bx + square.x,
            by + square.y - 15,
            'NO GOLD!',
            '#ff4444',
          );
        }
      });
    });
  }

  private cancelBuy(): void {
    this.isBuying = false;
    this.tempTower?.destroy();
    this.tempTower = null;
  }

  /**
   * Cancels whatever action is currently active:
   * - Active build menu (tower shop popup)
   * - Tower upgrade/sell overlays
   * - Active skill cast ghost
   */
  private cancelCurrentAction(): void {
    // Cancel skill cast
    if (this.activeSkillId) {
      this.cancelActiveSkillCast();
      this.eventBus.emit(C.EVT_TOWER_DESELECTED, {});
      return; // skill takes priority — one Escape at a time
    }

    // Cancel build menu
    if (this.activeBuildMenu) {
      this.activeBuildMenu.destroy();
      this.activeBuildMenu = null;
      this.buildRangeGraphic?.destroy();
      this.buildRangeGraphic = null;
      this.eventBus.emit(C.EVT_TOWER_DESELECTED, {});
      return;
    }

    // Cancel tower upgrade/sell overlay
    if (this.isTowerClicked) {
      this.isTowerClicked = false;
      this.upgradeImage?.destroy();
      this.upgradeImage = null;
      this.sellImage?.destroy();
      this.sellImage = null;
      this.rangeImage?.destroy();
      this.rangeImage = null;
      this.detailText?.destroy();
      this.detailText = null;
      this.eventBus.emit(C.EVT_TOWER_DESELECTED, {});
    }

    // Cancel buy state
    if (this.isBuying) {
      this.cancelBuy();
    }
  }

  private dealDamage(bullet: BulletBase, monster: MonsterBase): void {
    if (!bullet?.active || !monster?.active) return;

    // Call tower's special ability via the tower reference on the bullet
    if (
      bullet.tower &&
      bullet.tower.active &&
      typeof (bullet.tower as any).specialAbility === 'function'
    ) {
      (bullet.tower as any).specialAbility(monster, bullet);
    }

    monster.takeDamage(bullet.damage, bullet.damageType);
    bullet.destroy();
    const idx = this.stateService.savedData!.bullets.indexOf(bullet);
    if (idx >= 0) this.stateService.savedData!.bullets.splice(idx, 1);
  }

  private handleMonsterReachEnd(monster: MonsterBase): void {
    if (!monster.active) return;
    this.stateService.setLife((l) => l - 1);
    monster.setActive(false);
    const idx = this.stateService.savedData!.monsters.indexOf(monster);
    if (idx >= 0) this.stateService.savedData!.monsters.splice(idx, 1);

    monster.destroy();
  }

  // ─── Boss ability handlers ────────────────────────────────────────────────

  private handleGolemSplit({ x, y }: { x: number; y: number }): void {
    // TODO: spawn 2 mini-grunt-like monsters at (x, y)
    console.log('[GameScene] Golem split at', x, y);
  }

  private handleDemonStomp({
    x,
    y,
    radius,
  }: {
    x: number;
    y: number;
    radius: number;
  }): void {
    // Stun all towers within radius for 2s
    for (const tower of this.stateService.savedData!.towers) {
      const dist = Phaser.Math.Distance.Between(x, y, tower.x, tower.y);
      if (dist <= radius) {
        tower.isReady = false;
        this.time.delayedCall(2000, () => {
          if (tower.active) tower.isReady = true;
        });
      }
    }
    // Visual shockwave
    const g = this.add.graphics();
    g.lineStyle(3, 0xff4444, 0.8);
    g.strokeCircle(x, y, radius);
    this.tweens.add({
      targets: g,
      alpha: 0,
      duration: 600,
      onComplete: () => g.destroy(),
    });
  }

  private handleSpiderWeb({
    x,
    y,
    radius,
    duration,
  }: {
    x: number;
    y: number;
    radius: number;
    duration: number;
  }): void {
    // Slow nearest tower briefly
    for (const tower of this.stateService.savedData!.towers) {
      const dist = Phaser.Math.Distance.Between(x, y, tower.x, tower.y);
      if (dist <= radius) {
        tower.isReady = false;
        this.time.delayedCall(duration, () => {
          if (tower.active) tower.isReady = true;
        });
        break;
      }
    }
  }

  private handleSkillSelect({ skillId }: { skillId: string }): void {
    this.cancelActiveSkillCast();
    this.activeSkillId = skillId;

    const r = skillId === C.SKILL_RAIN_OF_FIRE ? 60 : 40;
    const ghost = this.add.graphics().setDepth(100);
    ghost.lineStyle(2, skillId === C.SKILL_RAIN_OF_FIRE ? 0xff4400 : 0x00ff88, 0.8);
    ghost.strokeCircle(0, 0, r);
    ghost.fillStyle(skillId === C.SKILL_RAIN_OF_FIRE ? 0xff4400 : 0x00ff88, 0.15);
    ghost.fillCircle(0, 0, r);
    this.skillGhost = ghost;

    const moveSub = (ptr: Phaser.Input.Pointer) => {
      if (this.skillGhost) this.skillGhost.setPosition(ptr.x, ptr.y);
    };
    this.input.on('pointermove', moveSub);
    this.skillMoveListener = moveSub;

    this.time.delayedCall(50, () => {
      const castHandler = (ptr: Phaser.Input.Pointer) => {
        if (this.activeSkillId !== skillId) return;
        this.executeSkillCast(skillId, ptr.x, ptr.y, r);
        this.cancelActiveSkillCast();
        this.eventBus.emit('HUD_SKILL_CAST_SUCCESS', { skillId });
        this.eventBus.emit(C.EVT_TOWER_DESELECTED, {}); // clear info panel details
      };
      this.skillCastListener = castHandler;
      this.input.once('pointerdown', castHandler);
    });
  }

  private cancelActiveSkillCast(): void {
    this.activeSkillId = null;
    if (this.skillGhost) {
      this.skillGhost.destroy();
      this.skillGhost = null;
    }
    if (this.skillMoveListener) {
      this.input.off('pointermove', this.skillMoveListener);
      this.skillMoveListener = null;
    }
    if (this.skillCastListener) {
      this.input.off('pointerdown', this.skillCastListener);
      this.skillCastListener = null;
    }
  }

  private executeSkillCast(skillId: string, x: number, y: number, r: number): void {
    let skillName = 'Skill';
    if (skillId === C.SKILL_RAIN_OF_FIRE) skillName = 'Rain of Fire';
    else if (skillId === C.SKILL_FORTIFY) skillName = 'Reinforcements';

    this.eventBus.emit('HUD_ADD_LOG', {
      text: `🔥 Casted Skill: ${skillName}!`,
      color: '#ff9900'
    });

    if (skillId === C.SKILL_RAIN_OF_FIRE) {
      // Meteors falling from the skies (6 fireballs)
      for (let i = 0; i < 6; i++) {
        this.time.delayedCall(i * 200, () => {
          const dx = x + Phaser.Math.Between(-30, 30);
          const dy = y + Phaser.Math.Between(-30, 30);
          
          // Draw falling meteor rock
          const meteor = this.add.graphics().setDepth(100);
          meteor.fillStyle(0xffaa00, 1);
          meteor.fillCircle(0, 0, 6);
          meteor.lineStyle(2, 0xff0000, 1);
          meteor.strokeCircle(0, 0, 6);
          
          meteor.setPosition(dx, dy - 250);
          
          this.tweens.add({
            targets: meteor,
            x: dx,
            y: dy,
            duration: 500,
            ease: 'Quad.In',
            onComplete: () => {
              meteor.destroy();
              SoundManager.getInstance().playShoot(); // impact explosion noise
              
              // Explosion visual flash ring
              const flash = this.add.graphics().setDepth(10);
              flash.lineStyle(2, 0xff5500, 1);
              flash.strokeCircle(dx, dy, 15);
              this.tweens.add({
                targets: flash,
                scaleX: 2.0,
                scaleY: 2.0,
                alpha: 0,
                duration: 250,
                onComplete: () => flash.destroy()
              });

              // Deal fire AoE damage
              const monsters = this.stateService.savedData!.monsters;
              monsters.forEach(m => {
                if (m?.active && Phaser.Math.Distance.Between(dx, dy, m.x, m.y) <= 30) {
                  m.takeDamage(35, C.DAMAGE_FIRE);
                }
              });
            }
          });
        });
      }
    } else if (skillId === C.SKILL_FORTIFY) {
      // Spawn 3 soldiers
      this.spawnSoldiers(x, y);
      SoundManager.getInstance().playBuy(); // soldier spawn sound cue
    }
  }

  private spawnSoldiers(x: number, y: number): void {
    const offsets = [
      { dx: -15, dy: 10 },
      { dx: 15, dy: 10 },
      { dx: 0, dy: -15 }
    ];
    offsets.forEach(off => {
      const sx = x + off.dx;
      const sy = y + off.dy;

      const sprite = this.add.sprite(sx, sy, 'Hero_Knight').setDepth(Math.floor(sy));
      sprite.setFrame(0);

      // Idle bobbing
      this.tweens.add({
        targets: sprite,
        y: sy - 3,
        duration: 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      const healthBar = this.add.graphics().setDepth(Math.floor(sy) + 1);
      
      const soldier = {
        sprite,
        health: 120,
        maxHealth: 120,
        x: sx,
        y: sy,
        healthBar,
        isDead: false
      };
      this.soldiers.push(soldier);
    });
  }


  private handleAllWavesDone(): void {
    const data = this.stateService.savedData!;
    this.time.addEvent({
      delay: 1000,
      repeat: 30,
      callback: () => {
        if (data.monsters.length === 0) {
          this.time.removeAllEvents();
          this.eventBus.emit(C.EVT_GAME_WIN, { score: data.score });
        }
      },
    });
  }

  // ─── TowerCallbacks factory ───────────────────────────────────────────────

  createTower(
    x: number,
    y: number,
    type: string,
    level: number,
    isSample = false,
  ): TowerBase {
    return TowerFactory.create(this, {
      towerType: type,
      x,
      y,
      level,
      stateService: this.stateService,
      mapService: this.mapService,
      eventBus: this.eventBus,
      callbacks: this.makeTowerCallbacks(),
      isSampleTower: isSample,
      bindEvents: true,
    });
  }

  private makeTowerCallbacks(): TowerCallbacks {
    return {
      isBuying: () => this.isBuying,
      setIsBuying: (v) => {
        this.isBuying = v;
        if (v) {
          const t = this.tempTower;
          // selectedTowerType set by sample tower before calling setIsBuying
          if (t) {
            this.selectedTowerType = t.towerType;
          }
        }
      },
      isTowerClicked: () => this.isTowerClicked,
      setIsTowerClicked: (v) => (this.isTowerClicked = v),
      getTempTower: () => this.tempTower,
      setTempTower: (t) => (this.tempTower = t),
      getUpgradeImage: () => this.upgradeImage,
      setUpgradeImage: (img) => (this.upgradeImage = img),
      getSellImage: () => this.sellImage,
      setSellImage: (img) => (this.sellImage = img),
      getRangeImage: () => this.rangeImage,
      setRangeImage: (img) => (this.rangeImage = img),
      getDetailText: () => this.detailText,
      setDetailText: (t) => (this.detailText = t),
      dealDamage: (b, m) => this.dealDamage(b, m),
      getDistance: (a, b) => Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y),
      createSquare: (col: number, row: number) => {
        return new Square(
          this,
          col,
          row,
          this.stateService,
          this.mapService,
          () => this.isBuying,
          (sq: Square) => this.onBuyTower(sq),
        );
      },
      createTower: (x, y, type, level, isSample) =>
        this.createTower(x, y, type, level, isSample),
      getMonsters: () => this.stateService.savedData!.monsters,
    };
  }

  private buildEnvironmentLayers(): void {
    const W = this.cameras.main.width;

    // 1. Sky strip at top (depth -10) — rich indigo-to-navy gradient
    const sky = this.add.graphics().setDepth(-10);
    sky.fillGradientStyle(0x0a0f2a, 0x0a0f2a, 0x1a2860, 0x1a2860, 1);
    sky.fillRect(0, 0, W, 52);

    // Subtle star dots in sky
    sky.fillStyle(0xffffff, 0.5);
    [[45,8],[120,15],[200,5],[310,18],[400,10],[500,14],[80,22],[250,25],[450,20]].forEach(([sx, sy]) => {
      sky.fillRect(sx, sy, 1.5, 1.5);
    });

    // 2. Glowing clouds (depth -9)
    const cloudG = this.add.graphics().setDepth(-9);
    cloudG.fillStyle(0x3a5a8a, 0.25);
    cloudG.fillEllipse(130, 26, 200, 22);
    cloudG.fillStyle(0x4a70aa, 0.15);
    cloudG.fillEllipse(420, 22, 240, 26);

    this.tweens.add({
      targets: cloudG,
      x: '+=60',
      duration: 22000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
