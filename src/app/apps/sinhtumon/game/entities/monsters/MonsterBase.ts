import * as Phaser from 'phaser';
import {
  CONSTANTS,
  gameCoreConfig,
  getMonsterGoldOnDead,
  getMonsterAnimationAssetName,
} from '../../constants';
import type { GameStateService } from '../../services/GameStateService';
import type { GameMapServiceBase } from '../../maps/GameMapServiceBase';

type MonsterReachEndpointFn = (
  tween: Phaser.Tweens.Tween,
  targets: any[],
  monster: MonsterBase,
) => void;

export abstract class MonsterBase extends Phaser.Physics.Arcade.Sprite {
  _gameStateService: GameStateService;
  _gameMapService: GameMapServiceBase;

  monsterType: string;
  speed: number = 0;
  maxHealth: number = 0;
  health: number = 0;
  aimed: any[] = [];

  lastPosX: number = 0;
  lastPosY: number = 0;
  tween: Phaser.Tweens.Tween | null = null;
  follower: { t: number; vec: Phaser.Math.Vector2 } | null = null;
  duration: number = 0;
  path: Phaser.Curves.Path | null = null;
  direction: string = '';

  // Scene-level graphics (injected from scene closure)
  private _graphics: Phaser.GameObjects.Graphics;
  private _detailText: () => Phaser.GameObjects.Text | null;
  private _setDetailText: (t: Phaser.GameObjects.Text | null) => void;
  private _setDetailTextClicked: (v: boolean) => void;
  private _monsterReachEndpoint: MonsterReachEndpointFn;

  constructor(
    scene: Phaser.Scene,
    monsterType: string,
    col: number,
    row: number,
    gameStateService: GameStateService,
    gameMapService: GameMapServiceBase,
    graphics: Phaser.GameObjects.Graphics,
    detailText: () => Phaser.GameObjects.Text | null,
    setDetailText: (t: Phaser.GameObjects.Text | null) => void,
    setDetailTextClicked: (v: boolean) => void,
    monsterReachEndpoint: MonsterReachEndpointFn,
  ) {
    super(
      scene,
      col * gameMapService.mapConfig.CELL_WIDTH + gameMapService.mapConfig.CELL_WIDTH / 2,
      row * gameMapService.mapConfig.CELL_HEIGHT + gameMapService.mapConfig.GAME_BOARD_PADDING_TOP,
      monsterType,
    );
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this._gameStateService = gameStateService;
    this._gameMapService = gameMapService;
    this._graphics = graphics;
    this._detailText = detailText;
    this._setDetailText = setDetailText;
    this._setDetailTextClicked = setDetailTextClicked;
    this._monsterReachEndpoint = monsterReachEndpoint;

    this.monsterType = monsterType;

    this.setDepth(2);
    this.setInteractive();
    this.on('pointerdown', () => this.pointerdown());
    this.initDirection();
    this.prepareSpriteAsset();
    this.initMovingPath();
  }

  abstract prepareSpriteAsset(): void;

  initDirection() {
    if (this.getMoveType() === CONSTANTS.MONSTER_MOVE_TYPE_FLY) {
      this.direction = CONSTANTS.MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT;
    } else {
      this.direction = CONSTANTS.MONSTER_MOVE_DIRECTION_TO_BOTTOM;
    }
  }

  initMovingPath() {
    if (this.getMoveType() === CONSTANTS.MONSTER_MOVE_TYPE_FLY) {
      this.updateMonsterPath(null);
    } else {
      this.updateMonsterPath(this._gameMapService.groundMonsterMovingPathDefault);
    }
  }

  pointerdown() {
    const existing = this._detailText();
    if (existing) existing.destroy();

    const text = this.scene.add.text(
      150,
      600,
      `Máu: ${this.health}\nTốc độ: ${this.speed}km/h\nVàng: ${this.getGoldOnDead()}`,
      { fontStyle: 'bold', fontSize: '20px', color: '#ff0000', fontFamily: 'roboto' },
    );
    this._setDetailText(text);
    this._setDetailTextClicked(false);
    this.scene.time.addEvent({
      delay: 100,
      callback: () => this._setDetailTextClicked(true),
      loop: true,
    });
  }

  updateMonsterPath(newMonsterPath: [number, number][] | null) {
    if (this.getMoveType() === CONSTANTS.MONSTER_MOVE_TYPE_GROUND && newMonsterPath) {
      if (this.tween) this.tween.stop();

      this.path = new Phaser.Curves.Path(this.x, this.y);

      let flag = true;
      while (flag) {
        const p0 = newMonsterPath[0];
        const p1 = newMonsterPath[1];
        if (!p1) { flag = false; break; }
        const cx0 = p0[1] * this._gameMapService.mapConfig.CELL_WIDTH + this._gameMapService.mapConfig.CELL_WIDTH / 2;
        const cx1 = p1[1] * this._gameMapService.mapConfig.CELL_WIDTH + this._gameMapService.mapConfig.CELL_WIDTH / 2;
        const cy0 = p0[0] * this._gameMapService.mapConfig.CELL_HEIGHT + this._gameMapService.mapConfig.GAME_BOARD_PADDING_TOP;
        const cy1 = p1[0] * this._gameMapService.mapConfig.CELL_HEIGHT + this._gameMapService.mapConfig.GAME_BOARD_PADDING_TOP;
        if (
          (cx0 > this.x && this.x > cx1) ||
          (cx0 < this.x && this.x < cx1) ||
          (cy0 > this.y && this.y > cy1) ||
          (cy0 < this.y && this.y < cy1)
        ) {
          newMonsterPath.splice(0, 1);
        } else {
          flag = false;
        }
      }

      newMonsterPath.forEach((i) => {
        this.path!.lineTo(
          this._gameMapService.mapConfig.CELL_WIDTH * i[1] + this._gameMapService.mapConfig.CELL_WIDTH / 2,
          i[0] * this._gameMapService.mapConfig.CELL_HEIGHT +
            this._gameMapService.mapConfig.CELL_HEIGHT / 2 +
            this._gameMapService.mapConfig.GAME_BOARD_PADDING_TOP,
        );
      });

      this.duration = (Math.sqrt(this.path.getLength() ** 2) / this.speed) * 1000;
      this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

      this.tween = this.scene.tweens.add({
        targets: this.follower,
        t: 1,
        ease: 'Linear',
        duration: this.duration,
        yoyo: false,
        repeat: -2,
        onComplete: this._monsterReachEndpoint as any,
        onCompleteParams: [this],
      });
    } else if (this.getMoveType() === CONSTANTS.MONSTER_MOVE_TYPE_FLY) {
      if (this.tween) return;

      this.path = new Phaser.Curves.Path(this.x, this.y);

      [this._gameMapService.mapConfig.START_POSITION, this._gameMapService.mapConfig.END_POSITION].forEach((i) => {
        this.path!.lineTo(
          this._gameMapService.mapConfig.CELL_WIDTH * i[1] + this._gameMapService.mapConfig.CELL_WIDTH / 2,
          i[0] * this._gameMapService.mapConfig.CELL_HEIGHT + this._gameMapService.mapConfig.GAME_BOARD_PADDING_TOP,
        );
      });

      this.duration = (Math.sqrt(this.path.getLength() ** 2) / this.speed) * 1000;
      this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

      this.tween = this.scene.tweens.add({
        targets: this.follower,
        t: 1,
        ease: 'Linear',
        duration: this.duration,
        yoyo: false,
        repeat: -2,
        onComplete: this._monsterReachEndpoint as any,
        onCompleteParams: [this],
      });
    }
  }

  dead() {
    this._gameStateService.setGold((prev) => prev + this.getGoldOnDead());
    this.tween?.stop();

    const monsters = this._gameStateService.savedData!.monsters;
    const bullets = this._gameStateService.savedData!.bullets;

    let i = bullets.length - 1;
    while (i >= 0) {
      if (bullets[i].target === this) {
        bullets[i].destroy();
        bullets.splice(i, 1);
      }
      i--;
    }
    monsters.splice(monsters.indexOf(this), 1);

    this.anims.play('dead');
    this.setAlpha(0.5);
    this.setDisplaySize(30, 40);

    setTimeout(() => this.destroy(), 2000);
  }

  setPosWithHealth(posX: number, posY: number) {
    this.lastPosX = this.x;
    this.lastPosY = this.y;
    this.setPosition(posX, posY);

    if (this.getMoveType() === CONSTANTS.MONSTER_MOVE_TYPE_GROUND) {
      if (this.lastPosX > this.x && this.direction !== CONSTANTS.MONSTER_MOVE_DIRECTION_TO_LEFT) {
        this.direction = CONSTANTS.MONSTER_MOVE_DIRECTION_TO_LEFT;
        this.anims.play(getMonsterAnimationAssetName(this.getName(), this.direction));
      } else if (this.lastPosX < this.x && this.direction !== CONSTANTS.MONSTER_MOVE_DIRECTION_TO_RIGHT) {
        this.direction = CONSTANTS.MONSTER_MOVE_DIRECTION_TO_RIGHT;
        this.anims.play(getMonsterAnimationAssetName(this.getName(), this.direction));
      } else if (this.lastPosY > this.y && this.direction !== CONSTANTS.MONSTER_MOVE_DIRECTION_TO_TOP) {
        this.direction = CONSTANTS.MONSTER_MOVE_DIRECTION_TO_TOP;
        this.anims.play(getMonsterAnimationAssetName(this.getName(), this.direction));
      } else if (this.lastPosY < this.y && this.direction !== CONSTANTS.MONSTER_MOVE_DIRECTION_TO_BOTTOM) {
        this.direction = CONSTANTS.MONSTER_MOVE_DIRECTION_TO_BOTTOM;
        this.anims.play(getMonsterAnimationAssetName(this.getName(), this.direction));
      }
    }

    const g = this._graphics;
    g.lineStyle(2, 0xff00, 0.5);
    g.strokeRoundedRect(
      this.x - this._gameMapService.mapConfig.CELL_WIDTH / 2.5,
      this.y + 22,
      this._gameMapService.mapConfig.CELL_WIDTH,
      3,
      0,
    );
    g.fillStyle(0x00ff00, 1);
    g.fillRect(
      this.x - this._gameMapService.mapConfig.CELL_WIDTH / 2.5,
      this.y + 22,
      (this._gameMapService.mapConfig.CELL_WIDTH * this.health) / this.maxHealth,
      3,
    );
  }

  getGoldOnDead(): number {
    return getMonsterGoldOnDead(this.getName());
  }

  getName(): string {
    return this.monsterType;
  }

  getMoveType(): string {
    return (gameCoreConfig.monsters as Record<string, { goldOnDead: number; moveType: string }>)[this.getName()].moveType;
  }
}
