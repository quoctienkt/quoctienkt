import * as Phaser from 'phaser';
import { GameStateService } from '../services/GameStateService';
import { GameMapServiceBase } from '../maps/GameMapServiceBase';
import { CrossroadsMapService } from '../maps/implements/CrossroadsMap';
import { Tower, TowerCallbacks } from '../objects/Tower';
import { Bullet } from '../objects/Bullet';
import { Square } from '../objects/Square';
import { EventBus } from '../services/EventBus';
import { MonsterBase } from '../objects/monsters/MonsterBase';
import { MonsterFactory } from '../objects/monsters/MonsterFactory';
import * as C from '../constants';
import {
  getTowerFrostData,
  getTowerAssetName,
  getTowerAmmoAssetName,
  getMonsterAnimationAssetName,
} from '../config';

export class MainScene extends Phaser.Scene {
  private gameStateService!: GameStateService;
  private gameMapService!: GameMapServiceBase;

  private graphics!: Phaser.GameObjects.Graphics;
  private nextWaveText!: Phaser.GameObjects.Text;
  private monsterRespawnEvent!: Phaser.Time.TimerEvent;
  private eventBus!: EventBus;

  private readonly GAME_WIDTH = 520 + 150;
  private readonly GAME_HEIGHT = 60 + 520;
  private readonly WAVE_DELAY = 15000;

  // UI state
  private _isBuying = false;
  private _isTowerClicked = false;
  private _tempTower: Tower | null = null;
  private _upgradeImage: any = null;
  private _sellImage: any = null;
  private _rangeImage: any = null;
  private _detailText: any = null;

  // Shared callback bag passed to all game objects
  private callbacks!: TowerCallbacks;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    this.gameStateService = new GameStateService();
    this.gameStateService.setScene(this);

    this.gameMapService = new CrossroadsMapService();
    this.gameMapService.setScene(this);

    this.graphics = this.add.graphics();
  }

  create(): void {
    this.eventBus = new EventBus();

    const savedData = {
      towers: [],
      monsters: [],
      bullets: [],
      heroes: [],
      score: 0,
      mapKey: C.MAP_CROSSROADS,
      wave: 0,
      life: 10,
      gold: 650,
    };

    this.gameStateService.init(savedData);
    this.gameMapService.init(this.gameStateService);

    // Build callback bag — the single seam between MainScene and all game objects
    this.callbacks = {
      isBuying: () => this._isBuying,
      setIsBuying: (v: boolean) => {
        this._isBuying = v;
      },
      isTowerClicked: () => this._isTowerClicked,
      setIsTowerClicked: (v: boolean) => {
        this._isTowerClicked = v;
      },
      getTempTower: () => this._tempTower,
      setTempTower: (t: Tower | null) => {
        this._tempTower = t;
      },
      getUpgradeImage: () => this._upgradeImage,
      setUpgradeImage: (img: any) => {
        this._upgradeImage = img;
      },
      getSellImage: () => this._sellImage,
      setSellImage: (img: any) => {
        this._sellImage = img;
      },
      getRangeImage: () => this._rangeImage,
      setRangeImage: (img: any) => {
        this._rangeImage = img;
      },
      getDetailText: () => this._detailText,
      setDetailText: (t: any) => {
        this._detailText = t;
      },
      dealDamage: (bullet: Bullet, monster: MonsterBase) =>
        this.dealDamage(bullet, monster),
      getDistance: (a: { x: number; y: number }, b: { x: number; y: number }) =>
        this.getDistance(a, b),
      createSquare: (col: number, row: number) => this.createSquare(col, row),
    };

    // Build map squares
    for (let row = 0; row < this.gameMapService.mapConfig.map.length; row++) {
      for (
        let col = 0;
        col < this.gameMapService.mapConfig.map[row].length;
        col++
      ) {
        if (!this.gameMapService.mapConfig.map[row][col]) {
          this.createSquare(col, row);
        }
      }
    }

    // Sample frost tower in the side panel
    new Tower(
      this,
      640,
      340,
      getTowerFrostData().towerType,
      1,
      this.gameStateService,
      this.gameMapService,
      this.callbacks,
      true,
      true,
    );

    // Wave system
    this.spawnWave(15);
    this.monsterRespawnEvent = this.time.addEvent({
      delay: this.WAVE_DELAY,
      callback: () => this.spawnWave(15),
      loop: true,
    });

    this.nextWaveText = this.add.text(10, 20, '', {
      fontSize: '15px',
      color: '#ffffff',
      fontFamily: 'Roboto, sans-serif',
    });

    // Pointer: move ghost tower
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this._isBuying && this._tempTower) {
        this._tempTower.x = pointer.x;
        this._tempTower.y = pointer.y;
      }
    });

    // Pointer: global deselect
    this.input.on('pointerdown', () => {
      this._detailText?.destroy();
      if (this._isBuying || this._isTowerClicked) {
        this._isBuying = false;
        this._tempTower?.destroy();
        this._tempTower = null;
        this._upgradeImage?.destroy();
        this._upgradeImage = null;
        this._sellImage?.destroy();
        this._sellImage = null;
        this._rangeImage?.destroy();
        this._rangeImage = null;
        this._isTowerClicked = false;
      }
    });
  }

  update(_time: number, _delta: number): void {
    this.graphics.clear();

    if (this.gameStateService.savedData!.life < 1) {
      this.physics.pause();
      this.monsterRespawnEvent.destroy();
      this.gameStateService.savedData!.monsters.forEach((m) => m.destroy());
      return;
    }

    const remaining = Math.max(
      0,
      Math.round(
        this.WAVE_DELAY * (1 - this.monsterRespawnEvent.getProgress()),
      ) / 1000,
    );
    this.nextWaveText.setText(`Next wave: ${remaining}s`);

    for (const monster of this.gameStateService.savedData!.monsters) {
      this.graphics.lineStyle(1, 0xffffff, 1);
      monster.path?.getPoint(monster.follower!.t, monster.follower!.vec);
      monster.setPosWithHealth(
        monster.follower!.vec.x,
        monster.follower!.vec.y,
      );
    }

    for (const bullet of this.gameStateService.savedData!.bullets) {
      this.moveTo(bullet, bullet.target, bullet.speed);
    }

    for (const tower of this.gameStateService.savedData!.towers) {
      tower.shoot(this.graphics, (b: Bullet, m: MonsterBase) =>
        this.dealDamage(b, m),
      );
    }
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private createSquare(col: number, row: number): Square {
    return new Square(
      this,
      col,
      row,
      this.gameStateService,
      this.gameMapService,
      () => this._isBuying,
      (square) => {
        const tower = new Tower(
          this,
          square.x,
          square.y,
          this._tempTower!.getName(),
          1,
          this.gameStateService,
          this.gameMapService,
          this.callbacks,
        );
        this.gameStateService.setGold(
          (g) => g - this._tempTower!.getUpgradeCost(),
        );
        this.gameStateService.savedData!.towers.push(tower);
      },
    );
  }

  private spawnWave(count: number): void {
    const monsterType =
      Math.floor(Math.random() * 10) % 2 === 0
        ? C.MONSTER_GRUNT
        : C.MONSTER_HARPY;

    this.gameStateService.setWave((w) => w + 1);

    for (let i = 0; i < count; i++) {
      this.time.addEvent({
        delay: i * 650,
        callback: () => {
          const monster = MonsterFactory.createMonster(
            this,
            monsterType,
            0,
            0,
            this.gameStateService,
            this.gameMapService,
            (m) => this.monsterReachEndpoint(m),
            this.eventBus,
          );
          this.gameStateService.savedData!.monsters.push(monster);
        },
        loop: false,
      });
    }
  }

  private monsterReachEndpoint(monster: MonsterBase): void {
    this.gameStateService.setLife((prev) => prev - 1);

    const bullets = this.gameStateService.savedData!.bullets;
    for (let i = bullets.length - 1; i >= 0; i--) {
      if (bullets[i].target === monster) {
        bullets[i].destroy();
        bullets.splice(i, 1);
      }
    }

    const monsters = this.gameStateService.savedData!.monsters;
    monsters.splice(monsters.indexOf(monster), 1);
    monster.destroy();
  }

  private dealDamage(bullet: Bullet, monster: MonsterBase): void {
    monster.health -= bullet.damage;

    const bullets = this.gameStateService.savedData!.bullets;
    bullets.splice(bullets.indexOf(bullet), 1);
    bullet.destroy();

    if (monster.health <= 0) {
      monster.dead();
    }
  }

  private getDistance(
    a: { x: number; y: number },
    b: { x: number; y: number },
  ): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  private moveTo(
    source: Phaser.Physics.Arcade.Sprite,
    target: { x: number; y: number },
    speed: number,
  ): void {
    const angle = Math.atan2(target.x - source.x, target.y - source.y);
    source.setAngle(
      Phaser.Math.RAD_TO_DEG *
        Phaser.Math.Angle.Between(source.x, source.y, target.x, target.y),
    );
    (source.body as Phaser.Physics.Arcade.Body).setVelocity(
      Math.sin(angle) * speed,
      Math.cos(angle) * speed,
    );
  }
}
