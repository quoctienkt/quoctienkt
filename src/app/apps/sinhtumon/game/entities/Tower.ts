import * as Phaser from 'phaser';
import {
  getTowerAssetName,
  getTowerDisplaySize,
  getTowerUpgradeCost,
  getTowerAttackRange,
  getTowerAttackReload,
  getTowerSellPrice,
} from '../constants';
import { Bullet } from './Bullet';
import type { GameStateService } from '../services/GameStateService';
import type { GameMapServiceBase } from '../maps/GameMapServiceBase';
import type { Square } from './Square';

export type GameState = {
  isBuying: () => boolean;
  setIsBuying: (v: boolean) => void;
  isTowerClicked: () => boolean;
  setIsTowerClicked: (v: boolean) => void;
  getTempTower: () => Tower | null;
  setTempTower: (t: Tower | null) => void;
  getUpgradeImage: () => Phaser.Physics.Arcade.Image | null;
  setUpgradeImage: (img: Phaser.Physics.Arcade.Image | null) => void;
  getSellImage: () => Phaser.Physics.Arcade.Sprite | null;
  setSellImage: (img: Phaser.Physics.Arcade.Sprite | null) => void;
  getRangeImage: () => Phaser.Physics.Arcade.Image | null;
  setRangeImage: (img: Phaser.Physics.Arcade.Image | null) => void;
  getDetailText: () => Phaser.GameObjects.Text | null;
  setDetailText: (t: Phaser.GameObjects.Text | null) => void;
  setDetailTextClicked: (v: boolean) => void;
};

export class Tower extends Phaser.Physics.Arcade.Sprite {
  _gameStateService: GameStateService;
  _gameMapService: GameMapServiceBase;
  _state: GameState;

  towerType: string;
  level: number;
  isSampleTower: boolean;
  isReady: boolean;
  upgradeCost: number;
  col: number;
  row: number;
  range: number;
  target: any = null;

  // Injected Square class to avoid circular dep
  private _SquareClass: typeof Square;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    towerType: string,
    level: number,
    gameStateService: GameStateService,
    gameMapService: GameMapServiceBase,
    state: GameState,
    bindEvents = true,
    isSampleTower = false,
    SquareClass?: typeof Square,
  ) {
    super(scene, x, y, getTowerAssetName(towerType, level));
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this._gameStateService = gameStateService;
    this._gameMapService = gameMapService;
    this._state = state;
    this._SquareClass = SquareClass as typeof Square;

    this.towerType = towerType;
    this.level = level;
    this.isSampleTower = isSampleTower;

    this.setDepth(3);
    this.setInteractive();

    const [towerWidth, towerHeight] = getTowerDisplaySize(this.getName(), this.level);
    this.setDisplaySize(towerWidth, towerHeight);

    this.isReady = true;
    this.upgradeCost = getTowerUpgradeCost(
      this.getName(),
      isSampleTower ? 1 : this.level + 1,
    );

    this.col = parseInt(
      String((x - gameMapService.mapConfig.CELL_WIDTH / 2) / gameMapService.mapConfig.CELL_WIDTH),
    );
    this.row = parseInt(
      String(
        (y - gameMapService.mapConfig.GAME_BOARD_PADDING_TOP - gameMapService.mapConfig.CELL_HEIGHT / 2) /
          gameMapService.mapConfig.CELL_HEIGHT,
      ),
    );

    this.range =
      getTowerAttackRange(this.getName(), this.level) + gameMapService.mapConfig.CELL_WIDTH;

    if (bindEvents) this.bindEvents();
  }

  bindEvents() {
    if (this.isSampleTower) {
      this.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        if (this._gameStateService.savedData!.gold >= this.getUpgradeCost()) {
          const prev = this._state.getTempTower();
          if (prev) prev.destroy();

          this._state.setIsBuying(false);
          this.scene.time.addEvent({
            delay: 100,
            callback: () => this._state.setIsBuying(true),
            loop: false,
          });

          const temp = new Tower(
            this.scene,
            pointer.x,
            pointer.y,
            this.getName(),
            1,
            this._gameStateService,
            this._gameMapService,
            this._state,
            false,
            true,
            this._SquareClass,
          );
          temp.setDepth(-1);
          temp.setAlpha(0.5);
          this._state.setTempTower(temp);
        }
      });
    } else {
      this.on('pointerdown', () => this.handleTowerFocus());
      this.on('pointermove', () => this.pointermove());
      this.on('pointerout', () => this.pointerout());
    }
  }

  handleTowerFocus() {
    if (!this._state.isBuying()) {
      const upgradeImage = this._state.getUpgradeImage();
      const sellImage = this._state.getSellImage();
      const rangeImage = this._state.getRangeImage();
      if (upgradeImage) upgradeImage.destroy();
      if (sellImage) sellImage.destroy();
      if (rangeImage) rangeImage.destroy();

      this._state.setIsTowerClicked(false);
      this.scene.time.addEvent({
        delay: 0,
        callback: () => this._state.setIsTowerClicked(true),
        loop: false,
      });

      this.showDesc();
      this.showAttackRange();
      this.showUpgradeAction();
      this.showSellAction();
    }
  }

  showDesc() {
    const existing = this._state.getDetailText();
    if (existing) existing.destroy();

    const text = this.scene.add.text(
      150,
      600,
      `Level: ${this.level}\nRange: ${getTowerAttackRange(this.getName(), this.level)}\nReload: ${getTowerAttackReload(this.getName(), this.level) / 1000}/s`,
      { fontStyle: 'bold', fontSize: '20px', color: '#ff0000', fontFamily: 'roboto' },
    );
    this._state.setDetailText(text);
    this._state.setDetailTextClicked(false);
    this.scene.time.addEvent({
      delay: 100,
      callback: () => this._state.setDetailTextClicked(true),
      loop: true,
    });
  }

  showAttackRange() {
    const existing = this._state.getRangeImage();
    if (existing) existing.destroy();

    const range = this.scene.physics.add.image(this.x, this.y, 'tower_range');
    range.setDisplaySize(
      getTowerAttackRange(this.getName(), this.level) * 2,
      getTowerAttackRange(this.getName(), this.level) * 2,
    );
    range.setAlpha(0.4);
    range.setDepth(3);
    range.setTint(0xfff000);
    this._state.setRangeImage(range);
  }

  showUpgradeAction() {
    const existing = this._state.getUpgradeImage();
    if (existing) existing.destroy();

    const upgradeImage = this.scene.physics.add.image(
      this.x + this._gameMapService.mapConfig.CELL_WIDTH / 2,
      this.y - this._gameMapService.mapConfig.CELL_HEIGHT / 2,
      'upgrade',
    );
    if (this.level === 5) upgradeImage.setAlpha(0.5);

    upgradeImage.setInteractive();
    upgradeImage.setDisplaySize(25, 25);
    upgradeImage.setDepth(3);
    this._state.setUpgradeImage(upgradeImage);

    upgradeImage.on('pointerdown', () => {
      if (this._gameStateService.savedData!.gold < this.getUpgradeCost()) return;
      if (this.level === 5) return;

      this._gameStateService.setGold((prev) => prev - this.getUpgradeCost());
      const towers = this._gameStateService.savedData!.towers;
      towers.splice(towers.indexOf(this), 1);

      const newTower = new Tower(
        this.scene,
        this.x,
        this.y,
        this.getName(),
        this.level + 1,
        this._gameStateService,
        this._gameMapService,
        this._state,
        true,
        false,
        this._SquareClass,
      );

      const detailText = this._state.getDetailText();
      if (detailText) detailText.destroy();
      this._state.getRangeImage()?.destroy();
      this._state.setIsTowerClicked(false);
      towers.push(newTower);
      upgradeImage.destroy();
      this._state.getSellImage()?.destroy();
      this.destroy();
    });

    upgradeImage.on('pointerover', () => {
      const dt = this._state.getDetailText();
      if (dt) dt.destroy();
      const t = this.scene.add.text(
        150,
        600,
        `Nâng cấp: ${this.getUpgradeCost()}$`,
        { fontStyle: 'bold', fontSize: '20px', color: '#ff0000', fontFamily: 'roboto' },
      );
      this._state.setDetailText(t);
      this._state.setDetailTextClicked(false);
      this.scene.time.addEvent({
        delay: 100,
        callback: () => this._state.setDetailTextClicked(true),
        loop: true,
      });
    });

    upgradeImage.on('pointerout', () => {
      this._state.getDetailText()?.destroy();
    });
  }

  showSellAction() {
    const sellImage = this.scene.physics.add.sprite(
      this.x + this._gameMapService.mapConfig.CELL_WIDTH / 2,
      this.y + this._gameMapService.mapConfig.CELL_HEIGHT / 2,
      'sell',
    );
    sellImage.setDepth(3);
    sellImage.play('rotate');
    sellImage.setInteractive();
    sellImage.setDisplaySize(25, 25);
    this._state.setSellImage(sellImage);

    sellImage.on('pointerdown', () => {
      this._state.getDetailText()?.destroy();
      this._gameStateService.setGold(
        (prev) => prev + getTowerSellPrice(this.getName(), this.level),
      );
      const towers = this._gameStateService.savedData!.towers;
      towers.splice(towers.indexOf(this), 1);

      new this._SquareClass(
        this.scene,
        this.col,
        this.row,
        this._gameStateService,
        this._gameMapService,
        Tower,
        this._state,
      );
      this._gameMapService.tryUpdateMap(
        this.col,
        this.row,
        this._gameMapService.mapConfig.CELL_AVAILABLE,
      );

      this._state.setIsTowerClicked(false);
      this._state.getRangeImage()?.destroy();
      sellImage.destroy();
      this._state.getUpgradeImage()?.destroy();
      this.destroy();
    });

    sellImage.on('pointerover', () => {
      const dt = this._state.getDetailText();
      if (dt) dt.destroy();
      const t = this.scene.add.text(
        150,
        600,
        `Bán giá: ${getTowerSellPrice(this.getName(), this.level)}$`,
        { fontStyle: 'bold', fontSize: '20px', color: '#ff0000', fontFamily: 'roboto' },
      );
      this._state.setDetailText(t);
      this._state.setDetailTextClicked(false);
      this.scene.time.addEvent({
        delay: 100,
        callback: () => this._state.setDetailTextClicked(true),
        loop: true,
      });
    });

    sellImage.on('pointerout', () => {
      this._state.getDetailText()?.destroy();
    });
  }

  pointermove() {
    if (!this._state.isBuying() && this._state.isTowerClicked()) {
      this.showDesc();
    }
  }

  pointerout() {
    this._state.getDetailText()?.destroy();
    this._state.setDetailTextClicked(false);
  }

  getUpgradeCost(): number {
    return this.upgradeCost;
  }

  getName(): string {
    return this.towerType;
  }

  shoot(
    getDistance: (a: any, b: any) => number,
    dealDamage: (bullet: Bullet, monster: any) => void,
  ) {
    if (this.getName().slice(0, -1) === 'power') return;

    let minDistance = this.range;
    let closestMonster: any = null;

    this._gameStateService.savedData!.monsters.forEach((monster: any) => {
      const dist = getDistance(this, monster);
      if (this.isReady && minDistance > dist) {
        minDistance = dist;
        closestMonster = monster;
      }
    });

    if (closestMonster && minDistance < this.range) {
      this.rotation += 0.1;
      this.isReady = false;
      this.scene.time.addEvent({
        delay: getTowerAttackReload(this.getName(), this.level),
        callback: () => { this.isReady = true; },
        loop: false,
      });

      const bullet = new Bullet(
        this.scene,
        this.x,
        this.y,
        this,
        this.level,
        this._gameStateService,
        this._gameMapService,
      );
      bullet.target = closestMonster;
      closestMonster.aimed.push(bullet);

      this.scene.physics.add.overlap(bullet, bullet.target, dealDamage as any, undefined, this.scene);
      this._gameStateService.savedData!.bullets.push(bullet);
    }
  }
}
