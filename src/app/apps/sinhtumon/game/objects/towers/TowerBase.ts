import * as Phaser from 'phaser';
import { GameStateService } from '../../services/GameStateService';
import { GameMapServiceBase } from '../../maps/GameMapServiceBase';
import { EventBus } from '../../services/EventBus';
import { BulletBase } from '../bullets/BulletBase';
import { MonsterBase } from '../monsters/MonsterBase';
import type { Square } from '../Square';
import {
  getTowerAssetName,
  getTowerDisplaySize,
  getTowerUpgradeCost,
  getTowerAttackRange,
  getTowerAttackReload,
  getTowerSellPrice,
  getTowerDefaultPriority,
} from '../../config';
import type { TargetPriority } from '../../types';
import * as C from '../../constants';

export interface TowerCallbacks {
  isBuying: () => boolean;
  setIsBuying: (v: boolean) => void;
  isTowerClicked: () => boolean;
  setIsTowerClicked: (v: boolean) => void;
  getTempTower: () => TowerBase | null;
  setTempTower: (t: TowerBase | null) => void;
  getUpgradeImage: () => any;
  setUpgradeImage: (img: any) => void;
  getSellImage: () => any;
  setSellImage: (img: any) => void;
  getRangeImage: () => any;
  setRangeImage: (img: any) => void;
  getDetailText: () => any;
  setDetailText: (t: any) => void;
  dealDamage: (bullet: BulletBase, monster: MonsterBase) => void;
  getDistance: (
    a: { x: number; y: number },
    b: { x: number; y: number },
  ) => number;
  createSquare: (col: number, row: number) => Square;
  createTower: (
    x: number,
    y: number,
    type: string,
    level: number,
    isSample?: boolean,
  ) => TowerBase;
  getMonsters: () => MonsterBase[];
}

export interface TowerContext {
  towerType: string;
  x: number;
  y: number;
  level: number;
  stateService: GameStateService;
  mapService: GameMapServiceBase;
  eventBus: EventBus;
  callbacks: TowerCallbacks;
  bindEvents?: boolean;
  isSampleTower?: boolean;
}

export abstract class TowerBase extends Phaser.Physics.Arcade.Sprite {
  protected stateService: GameStateService;
  protected mapService: GameMapServiceBase;
  protected eventBus: EventBus;
  protected cb: TowerCallbacks;

  towerType: string;
  level: number;
  isSampleTower: boolean;
  isReady: boolean;
  upgradeCost: number;
  col: number;
  row: number;
  range: number;
  priority: TargetPriority;
  target: MonsterBase | null = null;

  // Fortify buff
  isFortified = false;
  fortifyMultiplier = 1;

  constructor(scene: Phaser.Scene, ctx: TowerContext) {
    super(scene, ctx.x, ctx.y, getTowerAssetName(ctx.towerType, ctx.level));
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.stateService = ctx.stateService;
    this.mapService = ctx.mapService;
    this.eventBus = ctx.eventBus;
    this.cb = ctx.callbacks;
    this.towerType = ctx.towerType;
    this.level = ctx.level;
    this.isSampleTower = ctx.isSampleTower ?? false;
    this.isReady = true;
    this.priority = getTowerDefaultPriority(ctx.towerType);

    this.setDepth(3);
    // Use the ts config sizes precisely and ensure physics bounding box matches the scaled size
    const [w, h] = getTowerDisplaySize(this.towerType, this.level);
    this.setDisplaySize(w, h);
    if (this.body) {
      (this.body as Phaser.Physics.Arcade.Body).setSize(
        this.width,
        this.height,
      );
    }

    this.setInteractive();

    this.upgradeCost = getTowerUpgradeCost(
      this.towerType,
      this.isSampleTower ? 1 : this.level + 1,
    );
    this.col = Math.floor(
      (ctx.x - ctx.mapService.mapConfig.CELL_WIDTH / 2) /
        ctx.mapService.mapConfig.CELL_WIDTH,
    );
    this.row = Math.floor(
      (ctx.y +
        ctx.mapService.mapConfig.CELL_HEIGHT / 2 - // adjust for visual shift
        ctx.mapService.mapConfig.GAME_BOARD_PADDING_TOP -
        ctx.mapService.mapConfig.CELL_HEIGHT / 2) /
        ctx.mapService.mapConfig.CELL_HEIGHT,
    );
    this.range =
      getTowerAttackRange(this.towerType, this.level) +
      ctx.mapService.mapConfig.CELL_WIDTH;

    if (ctx.bindEvents !== false) this.bindEvents();
  }

  /** Override to apply special on-hit effect (AoE, chain, DoT, slow, stun…). */
  protected specialAbility(_target: MonsterBase, _bullet: BulletBase): void {
    /* default: none */
  }

  // ─── Targeting ────────────────────────────────────────────────────────────

  protected getTargetByPriority(): MonsterBase | null {
    const monsters = this.cb.getMonsters();
    if (monsters.length === 0) return null;

    let best: MonsterBase | null = null;
    let bestScore = Infinity;

    for (const m of monsters) {
      const dist = this.cb.getDistance(this, m);
      if (dist > this.range) continue;
      if (!m.active) continue;

      let score: number;
      switch (this.priority) {
        case C.TARGET_FIRST:
          score = -(m.follower?.t ?? 0);
          break; // farthest along path
        case C.TARGET_LAST:
          score = m.follower?.t ?? 0;
          break; // least far
        case C.TARGET_STRONGEST:
          score = -m.health;
          break; // most HP
        case C.TARGET_NEAREST:
        default:
          score = dist;
          break;
      }
      if (score < bestScore) {
        bestScore = score;
        best = m;
      }
    }
    return best;
  }

  // ─── Shoot ───────────────────────────────────────────────────────────────

  shoot(
    _graphics: Phaser.GameObjects.Graphics,
    dealDamage: (bullet: BulletBase, monster: MonsterBase) => void,
  ): void {
    if (!this.isReady) return;

    const target = this.getTargetByPriority();
    if (!target) return;

    this.target = target;
    this.isReady = false;

    const reload = getTowerAttackReload(this.towerType, this.level);
    this.scene.time.addEvent({
      delay: Math.round(reload * (1 / this.fortifyMultiplier)),
      callback: () => (this.isReady = true),
      loop: false,
    });

    const bullet = this.createBullet();
    bullet.target = target;
    target.aimed.push(bullet);

    this.scene.physics.add.overlap(
      bullet,
      target,
      (b, m) => {
        const bl = b as unknown as BulletBase;
        const mo = m as unknown as MonsterBase;
        bl.onHit(mo, this.cb.getMonsters()); // special effect first
        dealDamage(bl, mo); // base damage + destroy bullet
      },
      undefined,
      this.scene,
    );
    this.stateService.savedData!.bullets.push(bullet);
  }

  protected abstract createBullet(): BulletBase;

  // ─── UI helpers (unchanged from Tower.ts pattern) ─────────────────────────

  private bindEvents(): void {
    if (this.isSampleTower) {
      this.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        if (this.stateService.savedData!.gold >= this.getUpgradeCost()) {
          const existing = this.cb.getTempTower();
          existing?.destroy();
          this.cb.setIsBuying(false);
          this.scene.time.addEvent({
            delay: 100,
            callback: () => this.cb.setIsBuying(true),
            loop: false,
          });
          const temp = this.cb.createTower(
            pointer.x,
            pointer.y,
            this.towerType,
            1,
            true,
          );
          temp.setDepth(-1);
          temp.setAlpha(0.5);
          temp.disableInteractive();
          this.cb.setTempTower(temp);
        }
      });
    } else {
      this.on('pointerdown', () => this.handleTowerFocus());
      this.on('pointermove', () => {
        if (!this.cb.isBuying() && this.cb.isTowerClicked()) this.showDesc();
      });
      this.on('pointerout', () => this.cb.getDetailText()?.destroy());
    }
  }

  handleTowerFocus(): void {
    if (this.cb.isBuying()) return;
    this.cb.getUpgradeImage()?.destroy();
    this.cb.getSellImage()?.destroy();
    this.cb.getRangeImage()?.destroy();
    this.cb.setIsTowerClicked(false);
    this.scene.time.addEvent({
      delay: 0,
      callback: () => this.cb.setIsTowerClicked(true),
      loop: false,
    });
    this.showDesc();
    this.showAttackRange();
    this.showUpgradeAction();
    this.showSellAction();

    this.eventBus.emit(C.EVT_TOWER_SELECTED, {
      towerType: this.towerType,
      level: this.level,
      range: getTowerAttackRange(this.towerType, this.level),
      priority: this.priority,
    });
  }

  private showDesc(): void {
    this.cb.getDetailText()?.destroy();
    const t = this.scene.add.text(
      this.mapService.mapConfig.CELL_WIDTH *
        this.mapService.mapConfig.map[0].length +
        5,
      520,
      `Lv ${this.level}  ${this.towerType.replace('Tower_', '')}\nRange: ${getTowerAttackRange(this.towerType, this.level)}\nReload: ${(getTowerAttackReload(this.towerType, this.level) / 1000).toFixed(1)}s\n[${this.priority}]`,
      { fontSize: '12px', color: '#ffe066', fontFamily: 'Roboto, sans-serif' },
    );
    this.cb.setDetailText(t);
  }

  private showAttackRange(): void {
    this.cb.getRangeImage()?.destroy();
    const r = getTowerAttackRange(this.towerType, this.level);
    const img = this.scene.physics.add.image(this.x, this.y, 'tower_range');
    img.setDisplaySize(r * 2, r * 2);
    img.setAlpha(0.35);
    img.setDepth(3);
    img.setTint(0xfff000);
    this.cb.setRangeImage(img);
  }

  private showUpgradeAction(): void {
    this.cb.getUpgradeImage()?.destroy();
    const maxLevel = 5;
    const img = this.scene.physics.add.image(
      this.x + this.mapService.mapConfig.CELL_WIDTH / 2,
      this.y - this.mapService.mapConfig.CELL_HEIGHT / 2,
      'upgrade',
    );
    if (this.level >= maxLevel) img.setAlpha(0.4);
    img.setInteractive();
    img.setDisplaySize(25, 25);
    img.setDepth(4);
    this.cb.setUpgradeImage(img);

    img.on('pointerdown', () => {
      if (
        this.stateService.savedData!.gold < this.getUpgradeCost() ||
        this.level >= maxLevel
      )
        return;
      this.stateService.setGold((g) => g - this.getUpgradeCost());
      const towers = this.stateService.savedData!.towers;
      towers.splice(towers.indexOf(this), 1);
      const upgraded = this.cb.createTower(
        this.x,
        this.y,
        this.towerType,
        this.level + 1,
      );
      towers.push(upgraded);
      this.cb.getDetailText()?.destroy();
      this.cb.getRangeImage()?.destroy();
      this.cb.getUpgradeImage()?.destroy();
      this.cb.getSellImage()?.destroy();
      this.cb.setIsTowerClicked(false);
      this.destroy();
    });
    img.on('pointerover', () => {
      this.cb.getDetailText()?.destroy();
      this.cb.setDetailText(
        this.scene.add.text(
          this.mapService.mapConfig.CELL_WIDTH *
            this.mapService.mapConfig.map[0].length +
            5,
          520,
          `Upgrade: ${this.getUpgradeCost()} 🪙`,
          {
            fontSize: '13px',
            color: '#ffd700',
            fontFamily: 'Roboto, sans-serif',
          },
        ),
      );
    });
    img.on('pointerout', () => this.cb.getDetailText()?.destroy());
  }

  private showSellAction(): void {
    const img = this.scene.physics.add.sprite(
      this.x + this.mapService.mapConfig.CELL_WIDTH / 2,
      this.y + this.mapService.mapConfig.CELL_HEIGHT / 2,
      'sell',
    );
    img.setDepth(4);
    img.play('rotate');
    img.setInteractive();
    img.setDisplaySize(25, 25);
    this.cb.setSellImage(img);

    img.on('pointerdown', () => {
      const price = getTowerSellPrice(this.towerType, this.level);
      this.stateService.setGold((g) => g + price);
      const towers = this.stateService.savedData!.towers;
      towers.splice(towers.indexOf(this), 1);
      this.cb.createSquare(this.col, this.row);
      this.mapService.tryUpdateMap(
        this.col,
        this.row,
        this.mapService.mapConfig.CELL_AVAILABLE,
      );
      this.cb.setIsTowerClicked(false);
      this.cb.getRangeImage()?.destroy();
      this.cb.getSellImage()?.destroy();
      this.cb.getUpgradeImage()?.destroy();
      this.cb.getDetailText()?.destroy();
      this.eventBus.emit(C.EVT_TOWER_DESELECTED, {});
      this.destroy();
    });
    img.on('pointerover', () => {
      this.cb.getDetailText()?.destroy();
      this.cb.setDetailText(
        this.scene.add.text(
          this.mapService.mapConfig.CELL_WIDTH *
            this.mapService.mapConfig.map[0].length +
            5,
          520,
          `Sell: ${getTowerSellPrice(this.towerType, this.level)} 🪙`,
          {
            fontSize: '13px',
            color: '#44ff44',
            fontFamily: 'Roboto, sans-serif',
          },
        ),
      );
    });
    img.on('pointerout', () => this.cb.getDetailText()?.destroy());
  }

  getUpgradeCost(): number {
    return this.upgradeCost;
  }
  getName(): string {
    return this.towerType;
  }
}
