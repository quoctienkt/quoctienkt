import * as Phaser from 'phaser';
import { GameStateService } from '../services/GameStateService';
import { GameMapServiceBase } from '../maps/GameMapServiceBase';
import {
  getTowerAssetName,
  getTowerDisplaySize,
  getTowerUpgradeCost,
  getTowerAttackRange,
  getTowerAttackReload,
  getTowerSellPrice,
} from '../config';
import { Bullet } from './Bullet';
import type { Square } from './Square';

export interface TowerCallbacks {
  isBuying: () => boolean;
  setIsBuying: (v: boolean) => void;
  isTowerClicked: () => boolean;
  setIsTowerClicked: (v: boolean) => void;
  getTempTower: () => Tower | null;
  setTempTower: (t: Tower | null) => void;
  getUpgradeImage: () => any;
  setUpgradeImage: (img: any) => void;
  getSellImage: () => any;
  setSellImage: (img: any) => void;
  getRangeImage: () => any;
  setRangeImage: (img: any) => void;
  getDetailText: () => any;
  setDetailText: (t: any) => void;
  dealDamage: (bullet: Bullet, monster: any) => void;
  getDistance: (a: any, b: any) => number;
  createSquare: (col: number, row: number) => Square;
}

export class Tower extends Phaser.Physics.Arcade.Sprite {
  gameStateService: GameStateService;
  gameMapService: GameMapServiceBase;
  towerType: string;
  level: number;
  isSampleTower: boolean;
  isReady: boolean;
  upgradeCost: number;
  col: number;
  row: number;
  range: number;
  target: any = null;
  private cb: TowerCallbacks;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    towerType: string,
    level: number,
    gameStateService: GameStateService,
    gameMapService: GameMapServiceBase,
    callbacks: TowerCallbacks,
    bindEvents = true,
    isSampleTower = false,
  ) {
    super(scene, x, y, getTowerAssetName(towerType, level));
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.gameStateService = gameStateService;
    this.gameMapService = gameMapService;
    this.towerType = towerType;
    this.level = level;
    this.isSampleTower = isSampleTower;
    this.cb = callbacks;

    this.setDepth(3);
    this.setInteractive();

    const [w, h] = getTowerDisplaySize(this.getName(), this.level);
    this.setDisplaySize(w, h);

    this.isReady = true;
    this.upgradeCost = getTowerUpgradeCost(
      this.getName(),
      this.isSampleTower ? 1 : this.level + 1,
    );

    this.col = Math.floor(
      (x - gameMapService.mapConfig.CELL_WIDTH / 2) /
        gameMapService.mapConfig.CELL_WIDTH,
    );
    this.row = Math.floor(
      (y -
        gameMapService.mapConfig.GAME_BOARD_PADDING_TOP -
        gameMapService.mapConfig.CELL_HEIGHT / 2) /
        gameMapService.mapConfig.CELL_HEIGHT,
    );

    this.range =
      getTowerAttackRange(this.getName(), this.level) +
      gameMapService.mapConfig.CELL_WIDTH;

    if (bindEvents) this.bindEvents();
  }

  private bindEvents(): void {
    if (this.isSampleTower) {
      this.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        if (this.gameStateService.savedData!.gold >= this.getUpgradeCost()) {
          const existing = this.cb.getTempTower();
          if (existing) existing.destroy();

          this.cb.setIsBuying(false);
          this.scene.time.addEvent({
            delay: 100,
            callback: () => this.cb.setIsBuying(true),
            loop: false,
          });

          const temp = new Tower(
            this.scene,
            pointer.x,
            pointer.y,
            this.getName(),
            1,
            this.gameStateService,
            this.gameMapService,
            this.cb,
            false,
            true,
          );
          temp.setDepth(-1);
          temp.setAlpha(0.5);
          this.cb.setTempTower(temp);
        }
      });
    } else {
      this.on('pointerdown', () => this.handleTowerFocus());
      this.on('pointermove', () => this.pointermove());
      this.on('pointerout', () => this.pointerout());
    }
  }

  handleTowerFocus(): void {
    if (!this.cb.isBuying()) {
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
    }
  }

  showDesc(): void {
    this.cb.getDetailText()?.destroy();
    const text = this.scene.add.text(
      150,
      600,
      `Level: ${this.level}\nRange: ${getTowerAttackRange(this.getName(), this.level)}\nReload: ${getTowerAttackReload(this.getName(), this.level) / 1000}/s`,
      {
        fontStyle: 'bold',
        fontSize: '20px',
        color: '#ff4444',
        fontFamily: 'Roboto, sans-serif',
      },
    );
    this.cb.setDetailText(text);
  }

  showAttackRange(): void {
    this.cb.getRangeImage()?.destroy();
    const img = this.scene.physics.add.image(this.x, this.y, 'tower_range');
    const r = getTowerAttackRange(this.getName(), this.level);
    img.setDisplaySize(r * 2, r * 2);
    img.setAlpha(0.4);
    img.setDepth(3);
    img.setTint(0xfff000);
    this.cb.setRangeImage(img);
  }

  showUpgradeAction(): void {
    this.cb.getUpgradeImage()?.destroy();
    const img = this.scene.physics.add.image(
      this.x + this.gameMapService.mapConfig.CELL_WIDTH / 2,
      this.y - this.gameMapService.mapConfig.CELL_HEIGHT / 2,
      'upgrade',
    );
    if (this.level === 5) img.setAlpha(0.5);
    img.setInteractive();
    img.setDisplaySize(25, 25);
    img.setDepth(3);
    this.cb.setUpgradeImage(img);

    img.on('pointerdown', () => {
      if (
        this.gameStateService.savedData!.gold < this.getUpgradeCost() ||
        this.level === 5
      )
        return;

      this.gameStateService.setGold((prev) => prev - this.getUpgradeCost());
      const towers = this.gameStateService.savedData!.towers;
      towers.splice(towers.indexOf(this), 1);

      const upgraded = new Tower(
        this.scene,
        this.x,
        this.y,
        this.getName(),
        this.level + 1,
        this.gameStateService,
        this.gameMapService,
        this.cb,
      );
      this.cb.getDetailText()?.destroy();
      this.cb.getRangeImage()?.destroy();
      this.cb.setIsTowerClicked(false);
      towers.push(upgraded);
      this.cb.getUpgradeImage()?.destroy();
      this.cb.getSellImage()?.destroy();
      this.destroy();
    });

    img.on('pointerover', () => {
      this.cb.getDetailText()?.destroy();
      const t = this.scene.add.text(
        150,
        600,
        `Upgrade cost: ${this.getUpgradeCost()} gold`,
        {
          fontStyle: 'bold',
          fontSize: '20px',
          color: '#ff4444',
          fontFamily: 'Roboto, sans-serif',
        },
      );
      this.cb.setDetailText(t);
    });

    img.on('pointerout', () => {
      this.cb.getDetailText()?.destroy();
    });
  }

  showSellAction(): void {
    const img = this.scene.physics.add.sprite(
      this.x + this.gameMapService.mapConfig.CELL_WIDTH / 2,
      this.y + this.gameMapService.mapConfig.CELL_HEIGHT / 2,
      'sell',
    );
    img.setDepth(3);
    img.play('rotate');
    img.setInteractive();
    img.setDisplaySize(25, 25);
    this.cb.setSellImage(img);

    img.on('pointerdown', () => {
      this.cb.getDetailText()?.destroy();
      const price = getTowerSellPrice(this.getName(), this.level);
      this.gameStateService.setGold((prev) => prev + price);
      const towers = this.gameStateService.savedData!.towers;
      towers.splice(towers.indexOf(this), 1);
      this.cb.createSquare(this.col, this.row);
      this.gameMapService.tryUpdateMap(
        this.col,
        this.row,
        this.gameMapService.mapConfig.CELL_AVAILABLE,
      );
      this.cb.setIsTowerClicked(false);
      this.cb.getRangeImage()?.destroy();
      this.cb.getSellImage()?.destroy();
      this.cb.getUpgradeImage()?.destroy();
      this.destroy();
    });

    img.on('pointerover', () => {
      this.cb.getDetailText()?.destroy();
      const t = this.scene.add.text(
        150,
        600,
        `Sell for: ${getTowerSellPrice(this.getName(), this.level)} gold`,
        {
          fontStyle: 'bold',
          fontSize: '20px',
          color: '#ff4444',
          fontFamily: 'Roboto, sans-serif',
        },
      );
      this.cb.setDetailText(t);
    });

    img.on('pointerout', () => {
      this.cb.getDetailText()?.destroy();
    });
  }

  pointermove(): void {
    if (!this.cb.isBuying() && this.cb.isTowerClicked()) this.showDesc();
  }

  pointerout(): void {
    this.cb.getDetailText()?.destroy();
  }

  getUpgradeCost(): number {
    return this.upgradeCost;
  }

  getName(): string {
    return this.towerType;
  }

  shoot(
    graphics: Phaser.GameObjects.Graphics,
    dealDamage: (bullet: Bullet, monster: any) => void,
  ): void {
    let minDistance = this.range;

    for (const monster of this.gameStateService.savedData!.monsters) {
      const dist = this.cb.getDistance(this, monster);
      if (this.isReady && minDistance > dist) {
        minDistance = dist;
        this.target = monster;
      }
    }

    if (minDistance < this.range) {
      this.rotation += 0.1;
      this.isReady = false;
      this.scene.time.addEvent({
        delay: getTowerAttackReload(this.getName(), this.level),
        callback: () => (this.isReady = true),
        loop: false,
      });

      const bullet = new Bullet(
        this.scene,
        this.x,
        this.y,
        this,
        this.level,
        this.gameStateService,
        this.gameMapService,
      );
      bullet.target = this.target;
      this.target.aimed.push(bullet);

      this.scene.physics.add.overlap(
        bullet,
        bullet.target,
        dealDamage as any,
        undefined,
        this.scene,
      );
      this.gameStateService.savedData!.bullets.push(bullet);
    }
  }
}
