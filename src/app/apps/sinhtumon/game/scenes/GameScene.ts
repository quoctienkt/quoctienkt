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

  // ─── Graphics ─────────────────────────────────────────────────────────────
  private graphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: C.SCENE_GAME });
  }

  init(data: GameSceneData): void {
    this.isBuying = false;
    this.isTowerClicked = false;
    this.tempTower = null;
  }

  create(data: GameSceneData): void {
    const mapKey = data?.mapKey ?? C.MAP_CROSSROADS;
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

        // Close active build menu if click outside
        if (this.activeBuildMenu) {
          this.activeBuildMenu.destroy();
          this.activeBuildMenu = null;
        }

        // Close upgrade/sell overlays
        if (this.isTowerClicked) this.isTowerClicked = false;
        this.upgradeImage?.destroy();
        this.upgradeImage = null;
        this.sellImage?.destroy();
        this.sellImage = null;
        this.rangeImage?.destroy();
        this.rangeImage = null;
        this.detailText?.destroy();
        this.detailText = null;
        this.eventBus.emit(C.EVT_TOWER_DESELECTED, {});
      },
    );

    // Boss special events
    this.eventBus.on('BOSS_GOLEM_SPLIT', this.handleGolemSplit, this);
    this.eventBus.on('BOSS_DEMON_STOMP', this.handleDemonStomp, this);
    this.eventBus.on(C.STATUS_WEB, this.handleSpiderWeb, this);
    this.eventBus.on(C.EVT_SKILL_CAST, this.handleSkillCast, this);
    this.eventBus.on(C.EVT_ALL_WAVES_DONE, this.handleAllWavesDone, this);
    this.eventBus.on(
      C.EVT_WAVE_START,
      ({ wave, total }: { wave: number; total: number }) => {
        const isBossWave = wave === 10 || wave === 20; // Golem at 10, Demon at 20
        if (isBossWave) {
          FXHelper.waveBanner(this, '⚠ BOSS WAVE!', 0xff3333);
          FXHelper.screenShake(this, 350, 0.012);
          this.cameras.main.flash(200, 255, 0, 0, false);
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

    // Launch HUD overlay
    this.scene.launch(C.SCENE_HUD, { waveService: this.waveService });

    // Start wave system
    this.waveService.start();

    console.log(`[GameScene] Started — map: ${mapKey}`);
  }

  update(time: number, delta: number): void {
    this.graphics.clear();

    const data = this.stateService.savedData!;

    // Check game over
    if (data.life <= 0) return;

    this.waveService.update(time, delta);

    // Tick monsters
    for (let i = data.monsters.length - 1; i >= 0; i--) {
      const m = data.monsters[i];
      if (m?.active) m.tick(delta, this.graphics);
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
    const cx = square.posX * CW + CW / 2;
    const cy = square.posY * CH + CH / 2 + PAD; // EXACT cell center
    const tower = this.createTower(cx, cy, this.selectedTowerType, 1, false);
    this.stateService.savedData!.towers.push(tower);

    // Tower placement particles & shake
    FXHelper.dustBurst(this, cx, cy);
    this.cameras.main.shake(80, 0.004);

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
            const cx = square.posX * CW + CW / 2;
            const cy = square.posY * CH + CH / 2 + PAD;
            const realTower = this.createTower(cx, cy, t.type, 1, false);
            this.stateService.savedData!.towers.push(realTower);

            FXHelper.dustBurst(this, cx, cy);
            this.cameras.main.shake(80, 0.004);
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
          this.cameras.main.shake(40, 0.002);
        }
      });
    });
  }

  private cancelBuy(): void {
    this.isBuying = false;
    this.tempTower?.destroy();
    this.tempTower = null;
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

  private handleSkillCast({ skillId }: { skillId: string }): void {
    switch (skillId) {
      case C.SKILL_RAIN_OF_FIRE:
        this.activateRainOfFire();
        break;
      case C.SKILL_FORTIFY:
        this.activateFortify();
        break;
      case C.SKILL_HERO_RALLY:
        break; // hero movement
    }
  }

  private activateRainOfFire(): void {
    const r = 60;
    const ghost = this.add.graphics();
    ghost.fillStyle(0xff4400, 0.3);
    ghost.fillCircle(0, 0, r);
    ghost.setDepth(100);
    const moveSub = (ptr: Phaser.Input.Pointer) =>
      ghost.setPosition(ptr.x, ptr.y);
    this.input.on('pointermove', moveSub);

    // Let user click a position, then deal AoE fire damage over 3s
    this.time.delayedCall(50, () => {
      this.input.once('pointerdown', (ptr: Phaser.Input.Pointer) => {
        this.input.off('pointermove', moveSub);
        ghost.destroy();
        const g = this.add.graphics();
        this.tweens.addCounter({
          from: 0,
          to: 1,
          duration: 3000,
          onUpdate: (tween) => {
            g.clear();
            g.fillStyle(0xff4400, 0.3 + Math.random() * 0.2);
            g.fillCircle(ptr.x, ptr.y, r);
            // Damage monsters in zone
            if (Math.random() < 0.3) {
              for (const m of this.stateService.savedData!.monsters) {
                if (!m.active) continue;
                if (Phaser.Math.Distance.Between(ptr.x, ptr.y, m.x, m.y) <= r) {
                  m.takeDamage(25, C.DAMAGE_FIRE);
                }
              }
            }
          },
          onComplete: () => g.destroy(),
        });
      });
    });
  }

  private activateFortify(): void {
    // Boost the next tower the player clicks for 10s (+50% attack speed)
    const ghost = this.add.graphics();
    ghost.lineStyle(3, 0xffd700, 0.8).strokeCircle(0, 0, 28).setDepth(100);
    const moveSub = (ptr: Phaser.Input.Pointer) =>
      ghost.setPosition(ptr.x, ptr.y);
    this.input.on('pointermove', moveSub);

    this.time.delayedCall(50, () => {
      this.input.once('pointerdown', (ptr: Phaser.Input.Pointer) => {
        this.input.off('pointermove', moveSub);
        ghost.destroy();
        const towers = this.stateService.savedData!.towers;
        let closest: TowerBase | null = null;
        let minDist = 40;
        for (const t of towers) {
          const d = Phaser.Math.Distance.Between(t.x, t.y, ptr.x, ptr.y);
          if (d < minDist) {
            minDist = d;
            closest = t;
          }
        }
        if (closest) {
          closest.isFortified = true;
          closest.fortifyMultiplier = 1.5;
          this.time.delayedCall(10000, () => {
            if (closest?.active) {
              closest.isFortified = false;
              closest.fortifyMultiplier = 1;
            }
          });
          // Gold glow indicator
          const g = this.add.graphics();
          g.lineStyle(3, 0xffd700, 0.8)
            .strokeCircle(closest.x, closest.y, 28)
            .setDepth(10);
          this.tweens.add({
            targets: g,
            alpha: 0,
            duration: 600,
            onComplete: () => g.destroy(),
          });
        }
      });
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
    const H = this.cameras.main.height;

    // 1. Sky strip at top (depth -10)
    const sky = this.add.graphics().setDepth(-10);
    sky.fillGradientStyle(0x050515, 0x050515, 0x121835, 0x121835, 1);
    sky.fillRect(0, 0, W, 60);

    // 2. Parallax clouds (depth -9)
    const cloudG = this.add.graphics().setDepth(-9);
    cloudG.fillStyle(0xffffff, 0.12);
    cloudG.fillEllipse(150, 30, 180, 25);
    cloudG.fillEllipse(450, 25, 220, 30);

    this.tweens.add({
      targets: cloudG,
      x: '+=80',
      duration: 18000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 3. Bottom ground trim row (depth 1)
    const groundTrim = this.add.graphics().setDepth(1);
    groundTrim.fillGradientStyle(0x0e1c12, 0x0e1c12, 0x070c08, 0x070c08, 0.7);
    groundTrim.fillRect(0, 60 + 520, W, 100);
  }
}
