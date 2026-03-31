import * as Phaser from 'phaser';
import { GameStateService } from '../../services/GameStateService';
import { GameMapServiceBase } from '../../maps/GameMapServiceBase';
import * as C from '../../constants';
import { getMonsterGoldOnDead, getMonsterAnimationAssetName, gameCoreConfig } from '../../config';

export abstract class MonsterBase extends Phaser.Physics.Arcade.Sprite {
  gameStateService: GameStateService;
  gameMapService: GameMapServiceBase;
  monsterType: string;

  speed: number = 0;
  maxHealth: number = 0;
  health: number = 0;
  aimed: any[] = [];

  lastPosX: number = 0;
  lastPosY: number = 0;
  tween: Phaser.Tweens.Tween | null = null;
  follower: { t: number; vec: Phaser.Math.Vector2 } | null = null;
  path: Phaser.Curves.Path | null = null;
  direction: string = '';

  private onReachEndpoint: (monster: MonsterBase) => void;
  private getGraphics: () => Phaser.GameObjects.Graphics;
  private getDetailText: () => any;
  private setDetailText: (t: any) => void;

  constructor(
    scene: Phaser.Scene,
    monsterType: string,
    col: number,
    row: number,
    gameStateService: GameStateService,
    gameMapService: GameMapServiceBase,
    onReachEndpoint: (monster: MonsterBase) => void,
    getGraphics: () => Phaser.GameObjects.Graphics,
    getDetailText: () => any,
    setDetailText: (t: any) => void,
  ) {
    super(
      scene,
      col * gameMapService.mapConfig.CELL_WIDTH + gameMapService.mapConfig.CELL_WIDTH / 2,
      row * gameMapService.mapConfig.CELL_HEIGHT + gameMapService.mapConfig.GAME_BOARD_PADDING_TOP,
      monsterType,
    );
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.gameStateService = gameStateService;
    this.gameMapService = gameMapService;
    this.monsterType = monsterType;
    this.onReachEndpoint = onReachEndpoint;
    this.getGraphics = getGraphics;
    this.getDetailText = getDetailText;
    this.setDetailText = setDetailText;

    this.setDepth(2);
    this.setInteractive();
    this.on('pointerdown', () => this.pointerdown());

    this.initDirection();
    this.prepareSpriteAsset();
    this.initMovingPath();
  }

  /** Each monster subclass implements this to set up its animation/size/health/speed */
  protected abstract prepareSpriteAsset(): void;

  private initDirection(): void {
    if (this.getMoveType() === C.MONSTER_MOVE_TYPE_FLY) {
      this.direction = C.MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT;
    } else {
      this.direction = C.MONSTER_MOVE_DIRECTION_TO_BOTTOM;
    }
  }

  private initMovingPath(): void {
    if (this.getMoveType() === C.MONSTER_MOVE_TYPE_FLY) {
      this.updateMonsterPath(null);
    } else {
      this.updateMonsterPath(this.gameMapService.groundMonsterMovingPathDefault);
    }
  }

  private pointerdown(): void {
    this.getDetailText()?.destroy();
    const text = this.scene.add.text(
      150,
      600,
      `HP: ${this.health}\nSpeed: ${this.speed}\nGold: ${this.getGoldOnDead()}`,
      {
        fontStyle: 'bold',
        fontSize: '20px',
        color: '#ff4444',
        fontFamily: 'Roboto, sans-serif',
      },
    );
    this.setDetailText(text);
  }

  updateMonsterPath(newMonsterPath: [number, number][] | null): void {
    if (this.getMoveType() === C.MONSTER_MOVE_TYPE_GROUND) {
      if (!newMonsterPath) return;
      this.tween?.stop();

      this.path = new Phaser.Curves.Path(this.x, this.y);

      // Skip path segments already behind this monster
      let path = [...newMonsterPath];
      let flag = true;
      while (flag && path.length > 1) {
        const p0x = path[0][1] * this.gameMapService.mapConfig.CELL_WIDTH + this.gameMapService.mapConfig.CELL_WIDTH / 2;
        const p1x = path[1][1] * this.gameMapService.mapConfig.CELL_WIDTH + this.gameMapService.mapConfig.CELL_WIDTH / 2;
        const p0y = path[0][0] * this.gameMapService.mapConfig.CELL_HEIGHT + this.gameMapService.mapConfig.GAME_BOARD_PADDING_TOP;
        const p1y = path[1][0] * this.gameMapService.mapConfig.CELL_HEIGHT + this.gameMapService.mapConfig.GAME_BOARD_PADDING_TOP;

        if (
          (p0x > this.x && this.x > p1x) || (p0x < this.x && this.x < p1x) ||
          (p0y > this.y && this.y > p1y) || (p0y < this.y && this.y < p1y)
        ) {
          path.splice(0, 1);
        } else {
          flag = false;
        }
      }

      path.forEach((i) => {
        this.path!.lineTo(
          this.gameMapService.mapConfig.CELL_WIDTH * i[1] + this.gameMapService.mapConfig.CELL_WIDTH / 2,
          i[0] * this.gameMapService.mapConfig.CELL_HEIGHT +
            this.gameMapService.mapConfig.CELL_HEIGHT / 2 +
            this.gameMapService.mapConfig.GAME_BOARD_PADDING_TOP,
        );
      });

      const duration = (this.path.getLength() / this.speed) * 1000;
      this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
      this.tween = this.scene.tweens.add({
        targets: this.follower,
        t: 1,
        ease: 'Linear',
        duration,
        yoyo: false,
        repeat: 0,
        onComplete: () => this.onReachEndpoint(this),
      });
    } else {
      // FLY type
      if (this.tween) return;
      this.path = new Phaser.Curves.Path(this.x, this.y);

      [this.gameMapService.mapConfig.START_POSITION, this.gameMapService.mapConfig.END_POSITION].forEach((i) => {
        this.path!.lineTo(
          this.gameMapService.mapConfig.CELL_WIDTH * i[1] + this.gameMapService.mapConfig.CELL_WIDTH / 2,
          i[0] * this.gameMapService.mapConfig.CELL_HEIGHT + this.gameMapService.mapConfig.GAME_BOARD_PADDING_TOP,
        );
      });

      const duration = (this.path.getLength() / this.speed) * 1000;
      this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
      this.tween = this.scene.tweens.add({
        targets: this.follower,
        t: 1,
        ease: 'Linear',
        duration,
        yoyo: false,
        repeat: 0,
        onComplete: () => this.onReachEndpoint(this),
      });
    }
  }

  dead(): void {
    this.gameStateService.setGold((prev) => prev + this.getGoldOnDead());
    this.tween?.stop();

    const monsters = this.gameStateService.savedData!.monsters;
    const bullets = this.gameStateService.savedData!.bullets;

    for (let i = bullets.length - 1; i >= 0; i--) {
      if (bullets[i].target === this) {
        bullets[i].destroy();
        bullets.splice(i, 1);
      }
    }
    monsters.splice(monsters.indexOf(this), 1);

    this.anims.play('dead');
    this.setAlpha(0.5);
    this.setDisplaySize(30, 40);

    setTimeout(() => this.destroy(), 2000);
  }

  setPosWithHealth(posX: number, posY: number): void {
    this.lastPosX = this.x;
    this.lastPosY = this.y;
    this.setPosition(posX, posY);

    if (this.getMoveType() === C.MONSTER_MOVE_TYPE_GROUND) {
      const anim = (dir: string) => {
        if (this.direction !== dir) {
          this.direction = dir;
          this.anims.play(getMonsterAnimationAssetName(this.getName(), dir));
        }
      };
      if (this.lastPosX > this.x) anim(C.MONSTER_MOVE_DIRECTION_TO_LEFT);
      else if (this.lastPosX < this.x) anim(C.MONSTER_MOVE_DIRECTION_TO_RIGHT);
      else if (this.lastPosY > this.y) anim(C.MONSTER_MOVE_DIRECTION_TO_TOP);
      else if (this.lastPosY < this.y) anim(C.MONSTER_MOVE_DIRECTION_TO_BOTTOM);
    }

    // Health bar
    const g = this.getGraphics();
    const cw = this.gameMapService.mapConfig.CELL_WIDTH;
    g.lineStyle(2, 0x00ff00, 0.5);
    g.strokeRoundedRect(this.x - cw / 2.5, this.y + 22, cw, 3, 0);
    g.fillStyle(0x00ff00, 1);
    g.fillRect(this.x - cw / 2.5, this.y + 22, (cw * this.health) / this.maxHealth, 3);
  }

  getGoldOnDead(): number {
    return getMonsterGoldOnDead(this.getName());
  }

  getName(): string {
    return this.monsterType;
  }

  getMoveType(): string {
    return gameCoreConfig.monsters[this.getName()].moveType;
  }
}
