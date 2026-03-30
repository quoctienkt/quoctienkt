import * as Phaser from 'phaser';
import { CONSTANTS, getTowerSnowFlakeData, getTowerAmmoAssetName, getTowerAssetName } from './constants';
import { GameStateService } from './services/GameStateService';
import { HoTuThanMap } from './maps/implements/HoTuThanMap';
import { Bullet } from './entities/Bullet';
import { Square } from './entities/Square';
import { Tower, type GameState } from './entities/Tower';
import { MonsterButterfly } from './entities/monsters/MonsterButterfly';
import { MonsterThief } from './entities/monsters/MonsterThief';

export function startGame(appPrefix: string, canvasId: string): Phaser.Game {
  const gameStateService = new GameStateService();
  const gameMapService = new HoTuThanMap();

  // ─── Scene-level mutable state (replaces window.* globals) ───────────────
  let graphics: Phaser.GameObjects.Graphics;
  let nextWave: Phaser.GameObjects.Text;
  let monsterRespawnEvent: Phaser.Time.TimerEvent;

  let tempTower: Tower | null = null;
  let upgradeImage: Phaser.Physics.Arcade.Image | null = null;
  let sellImage: Phaser.Physics.Arcade.Sprite | null = null;
  let rangeImage: Phaser.Physics.Arcade.Image | null = null;
  let detailText: Phaser.GameObjects.Text | null = null;

  let isBuying = false;
  let isTowerClicked = false;
  let detailTextClicked = false;

  const waveDelay = 15000;
  const GAME_WIDTH = 520 + 150;
  const GAME_HEIGHT = 60 + 520;

  // ─── State accessor object passed to entities ─────────────────────────────
  const state: GameState = {
    isBuying: () => isBuying,
    setIsBuying: (v) => { isBuying = v; },
    isTowerClicked: () => isTowerClicked,
    setIsTowerClicked: (v) => { isTowerClicked = v; },
    getTempTower: () => tempTower,
    setTempTower: (t) => { tempTower = t; },
    getUpgradeImage: () => upgradeImage,
    setUpgradeImage: (img) => { upgradeImage = img; },
    getSellImage: () => sellImage,
    setSellImage: (img) => { sellImage = img; },
    getRangeImage: () => rangeImage,
    setRangeImage: (img) => { rangeImage = img; },
    getDetailText: () => detailText,
    setDetailText: (t) => { detailText = t; },
    setDetailTextClicked: (v) => { detailTextClicked = v; },
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────
  function getDistance(a: { x: number; y: number }, b: { x: number; y: number }) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  function moveTo(source: Phaser.Physics.Arcade.Sprite, target: { x: number; y: number }, speed: number) {
    const angle = Math.atan2(target.x - source.x, target.y - source.y);
    source.setAngle(
      Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.Between(source.x, source.y, target.x, target.y),
    );
    (source.body as Phaser.Physics.Arcade.Body).setVelocity(
      Math.sin(angle) * speed,
      Math.cos(angle) * speed,
    );
  }

  function dealDamage(bullet: Bullet, monster: any) {
    monster.health -= bullet.damage;
    const bullets = gameStateService.savedData!.bullets;
    bullets.splice(bullets.indexOf(bullet), 1);
    bullet.destroy();
    if (monster.health <= 0) monster.dead();
  }

  function monsterReachEndpoint(_tween: Phaser.Tweens.Tween, _targets: any[], monster: any) {
    gameStateService.setLife((prev) => prev - 1);
    const bullets = gameStateService.savedData!.bullets;
    let i = bullets.length - 1;
    while (i >= 0) {
      if (bullets[i].target === monster) {
        bullets[i].destroy();
        bullets.splice(i, 1);
      }
      i--;
    }
    const monsters = gameStateService.savedData!.monsters;
    monsters.splice(monsters.indexOf(monster), 1);
    monster.destroy();
  }

  function createMonster(scene: Phaser.Scene, monsterType: string): any {
    const commonArgs = [
      scene,
      monsterType,
      0,
      0,
      gameStateService,
      gameMapService,
      graphics,
      () => detailText,
      (t: Phaser.GameObjects.Text | null) => { detailText = t; },
      (v: boolean) => { detailTextClicked = v; },
      monsterReachEndpoint,
    ] as const;

    if (monsterType === CONSTANTS.MONSTER_BUTTERFLY) {
      return new MonsterButterfly(...commonArgs);
    }
    return new MonsterThief(...commonArgs);
  }

  function monsterRespawn(this: Phaser.Scene, _number: number) {
    const name =
      Math.floor(Math.random() * 10) % 2
        ? CONSTANTS.MONSTER_BUTTERFLY
        : CONSTANTS.MONSTER_THIEF;

    gameStateService.setWave((wave) => wave + 1);
    for (let i = 0; i < 15; i++) {
      this.time.addEvent({
        delay: i * 650,
        callback: () => {
          const monster = createMonster(this, name);
          gameStateService.savedData!.monsters.push(monster);
        },
        loop: false,
      });
    }
  }

  // ─── Phaser Scene functions ───────────────────────────────────────────────
  function preload(this: Phaser.Scene) {
    gameStateService.setScene(this);
    gameMapService.setScene(this);

    const snowflakeTower = getTowerSnowFlakeData();

    this.load.image('background', `${appPrefix}/img/background.png`);
    this.load.image('background1', `${appPrefix}/img/background1.png`);
    this.load.image('square', `${appPrefix}/img/square2.png`);
    this.load.image('arrow', `${appPrefix}/img/arrow.png`);
    this.load.image('tower_range', `${appPrefix}/img/circle_2.png`);

    for (let level = 1; level <= 5; level++) {
      this.load.image(
        getTowerAmmoAssetName(snowflakeTower.towerType, level),
        `${appPrefix}/img/tower/frozen_bullet/${level}.png`,
      );
      this.load.image(
        getTowerAssetName(snowflakeTower.towerType, level),
        `${appPrefix}/img/tower/frozen/${level}.png`,
      );
    }

    this.load.image('upgrade', `${appPrefix}/img/loop.png`);
    this.load.spritesheet('sell', `${appPrefix}/img/coin.png`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('onDead', `${appPrefix}/img/explosion.png`, { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet(CONSTANTS.MONSTER_THIEF, `${appPrefix}/img/ani_beast.png`, {
      frameWidth: 32,
      frameHeight: 53,
    });
    this.load.spritesheet(CONSTANTS.MONSTER_BUTTERFLY, `${appPrefix}/img/monster/flying/butterfly.png`, {
      frameWidth: 70,
      frameHeight: 65,
    });

    graphics = this.add.graphics();
  }

  function create(this: Phaser.Scene) {
    const savedData = {
      towers: [] as any[],
      monsters: [] as any[],
      bullets: [] as any[],
      wave: 0,
      life: 10,
      gold: 650,
    };

    gameStateService.init(savedData);
    gameMapService.injectClasses(
      (scene: Phaser.Scene, col: number, row: number) =>
        new Square(scene, col, row, gameStateService, gameMapService, Tower, state),
      (scene: Phaser.Scene, x: number, y: number, type: string, level: number, bind: boolean, isSample: boolean) =>
        new Tower(scene, x, y, type, level, gameStateService, gameMapService, state, bind, isSample, Square),
    );
    gameMapService.init(gameStateService);

    monsterRespawn.call(this, 15);
    monsterRespawnEvent = this.time.addEvent({
      delay: waveDelay,
      callback: () => monsterRespawn.call(this, 15),
      loop: true,
    });

    nextWave = this.add.text(
      10,
      20,
      `Đợt kế: ${Math.round((waveDelay - waveDelay * parseFloat(monsterRespawnEvent.getProgress().toString().substring(0, 4))) / 1000)}`,
      { fontSize: '15px', color: '#fff', fontFamily: 'roboto' },
    );

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (isBuying && tempTower) {
        tempTower.x = pointer.x;
        tempTower.y = pointer.y;
      }
    });

    this.input.on('pointerdown', () => {
      if (detailTextClicked) detailText?.destroy();
      if (isBuying || isTowerClicked) {
        isBuying = false;
        tempTower?.destroy();
        upgradeImage?.destroy();
        sellImage?.destroy();
        rangeImage?.destroy();
        isTowerClicked = false;
      }
    });
  }

  function update(this: Phaser.Scene) {
    graphics.clear();

    if (gameStateService.savedData!.life < 1) {
      this.physics.pause();
      monsterRespawnEvent.destroy();
      gameStateService.savedData!.monsters.forEach((m: any) => m.destroy());
      return;
    }

    nextWave.setText(
      `Đợt kế: ${Math.round(
        (waveDelay - waveDelay * parseFloat(monsterRespawnEvent.getProgress().toString().substring(0, 4))) / 1000,
      )}`,
    );

    gameStateService.savedData!.monsters.forEach((monster: any) => {
      monster.path.getPoint(monster.follower.t, monster.follower.vec);
      monster.setPosWithHealth(monster.follower.vec.x, monster.follower.vec.y);
    });

    gameStateService.savedData!.bullets.forEach((bullet: Bullet) => {
      moveTo(bullet, bullet.target, bullet.speed);
    });

    gameStateService.savedData!.towers.forEach((tower: Tower) => {
      tower.shoot(getDistance, dealDamage);
    });
  }

  // ─── Phaser Game Config ───────────────────────────────────────────────────
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS,
    canvas: document.getElementById(canvasId) as HTMLCanvasElement,
    width: GAME_WIDTH,
    height: GAME_HEIGHT + gameMapService.mapConfig.GAME_BOARD_PADDING_TOP,
    physics: {
      default: 'arcade',
    },
    scene: {
      preload,
      create,
      update,
    },
  };

  return new Phaser.Game(config);
}
