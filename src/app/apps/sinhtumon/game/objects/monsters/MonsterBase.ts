import * as Phaser from 'phaser';
import { GameStateService } from '../../services/GameStateService';
import { GameMapServiceBase } from '../../maps/GameMapServiceBase';
import { EventBus } from '../../services/EventBus';
import { getMonsterConfig } from '../../config';
import {
  createAnimSafe,
  buildAnimKey,
  drawHealthBar,
} from '../../utils/spriteHelper';
import * as C from '../../constants';
import type { StatusEffect } from '../../types';

export interface MonsterContext {
  monsterType: string;
  col: number;
  row: number;
  stateService: GameStateService;
  mapService: GameMapServiceBase;
  eventBus: EventBus;
  onReachEndpoint: (monster: MonsterBase) => void;
}

export abstract class MonsterBase extends Phaser.Physics.Arcade.Sprite {
  // ─── Context refs ─────────────────────────────────────────────────────────
  protected stateService: GameStateService;
  protected mapService: GameMapServiceBase;
  protected eventBus: EventBus;
  readonly monsterType: string;

  // ─── Stats ────────────────────────────────────────────────────────────────
  speed: number = 0;
  maxHealth: number = 0;
  health: number = 0;
  armor: number = 0; // 0–1 physical damage reduction
  regenPerSec: number = 0; // HP/sec regeneration (Mummy)
  isBoss: boolean = false;

  // ─── Status effects ───────────────────────────────────────────────────────
  statusEffects: StatusEffect[] = [];
  private currentSpeedMultiplier = 1;

  // ─── Targeting / path tracking ────────────────────────────────────────────
  aimed: any[] = []; // bullets currently tracking this monster
  tween: Phaser.Tweens.Tween | null = null;
  follower: { t: number; vec: Phaser.Math.Vector2 } | null = null;
  path: Phaser.Curves.Path | null = null;
  direction: string = '';
  lastPosX: number = 0;
  lastPosY: number = 0;

  private onReachEndpoint: (monster: MonsterBase) => void;

  constructor(scene: Phaser.Scene, ctx: MonsterContext) {
    const cfg = getMonsterConfig(ctx.monsterType);
    super(
      scene,
      ctx.col * ctx.mapService.mapConfig.CELL_WIDTH +
        ctx.mapService.mapConfig.CELL_WIDTH / 2,
      ctx.row * ctx.mapService.mapConfig.CELL_HEIGHT +
        ctx.mapService.mapConfig.GAME_BOARD_PADDING_TOP,
      cfg.spriteKey,
    );
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.stateService = ctx.stateService;
    this.mapService = ctx.mapService;
    this.eventBus = ctx.eventBus;
    this.monsterType = ctx.monsterType;
    this.onReachEndpoint = ctx.onReachEndpoint;

    this.setDepth(2);
    this.setInteractive();
    this.on('pointerdown', () => this.onPointerDown());

    this.initDirection();
    this.prepareSpriteAsset();
    this.initMovingPath();
  }

  /** Each monster subclass calls setupAnimations() here (or adds custom logic). */
  protected abstract prepareSpriteAsset(): void;

  // ─── Per-frame tick (called from GameScene.update) ────────────────────────

  tick(delta: number, graphics: Phaser.GameObjects.Graphics): void {
    // Update world position from path tween
    if (this.follower && this.path) {
      this.path.getPoint(this.follower.t, this.follower.vec);
      this.updatePos(this.follower.vec.x, this.follower.vec.y);
    }
    // HP regeneration
    if (this.regenPerSec > 0 && this.health < this.maxHealth) {
      this.health = Math.min(
        this.maxHealth,
        this.health + (this.regenPerSec * delta) / 1000,
      );
    }
    // Status effects
    this.tickStatusEffects(delta);
    // Draw HP bar via shared Graphics
    const cfg = getMonsterConfig(this.monsterType);
    drawHealthBar(
      graphics,
      this.x,
      this.y,
      cfg.displayWidth ?? 32,
      this.health,
      this.maxHealth,
      this.isBoss,
    );
  }

  // ─── Damage & status ──────────────────────────────────────────────────────

  takeDamage(amount: number, damageType: string): void {
    let dmg = amount;
    if (damageType === C.DAMAGE_PHYSICAL && this.armor > 0) {
      dmg *= 1 - this.armor;
    }
    this.health -= dmg;
    if (this.health <= 0 && this.active) {
      this.health = 0;
      this.dead();
    }
  }

  applyStatus(effect: StatusEffect): void {
    const existing = this.statusEffects.find((e) => e.type === effect.type);
    if (existing) {
      existing.duration = Math.max(existing.duration, effect.duration);
      if (
        effect.speedMultiplier !== undefined &&
        existing.speedMultiplier !== undefined
      ) {
        existing.speedMultiplier = Math.min(
          existing.speedMultiplier,
          effect.speedMultiplier,
        );
      }
    } else {
      this.statusEffects.push({ ...effect });
    }
    this.recalcSpeedMultiplier();
    this.updateStatusTint();
  }

  private tickStatusEffects(delta: number): void {
    for (let i = this.statusEffects.length - 1; i >= 0; i--) {
      const e = this.statusEffects[i];
      e.duration -= delta;
      if (e.dotDps) {
        this.takeDamage((e.dotDps * delta) / 1000, C.DAMAGE_POISON);
      }
      if (e.duration <= 0) this.statusEffects.splice(i, 1);
    }
    this.recalcSpeedMultiplier();
    if (this.statusEffects.length === 0) this.clearTint();
  }

  private recalcSpeedMultiplier(): void {
    let mult = 1;
    for (const e of this.statusEffects) {
      if (e.speedMultiplier !== undefined)
        mult = Math.min(mult, e.speedMultiplier);
    }
    if (mult !== this.currentSpeedMultiplier) {
      this.currentSpeedMultiplier = mult;
      if (this.tween) this.tween.timeScale = mult;
    }
  }

  private updateStatusTint(): void {
    if (this.statusEffects.some((e) => e.type === C.STATUS_FREEZE)) {
      this.setTint(0x88ddff);
    } else if (this.statusEffects.some((e) => e.type === C.STATUS_SLOW)) {
      this.setTint(0x88aaff);
    } else if (this.statusEffects.some((e) => e.type === C.STATUS_POISON_DOT)) {
      this.setTint(0x88ff88);
    } else if (this.statusEffects.some((e) => e.type === C.STATUS_STUN)) {
      this.setTint(0xffff88);
    }
  }

  // ─── Death ────────────────────────────────────────────────────────────────

  dead(): void {
    if (!this.active) return;
    this.setActive(false);

    const gold = this.getGoldOnDead();
    this.stateService.setGold((prev) => prev + gold);
    this.stateService.addScore(gold * 10);
    this.tween?.stop();

    // Remove from state array
    const monsters = this.stateService.savedData!.monsters;
    const idx = monsters.indexOf(this);
    if (idx >= 0) monsters.splice(idx, 1);

    // Destroy all bullets targeting this monster
    const bullets = this.stateService.savedData!.bullets;
    for (let i = bullets.length - 1; i >= 0; i--) {
      if (bullets[i].target === this) {
        bullets[i].destroy();
        bullets.splice(i, 1);
      }
    }

    this.eventBus.emit(C.EVT_MONSTER_DEAD, {
      monsterType: this.monsterType,
      gold,
    });

    // Death flash
    this.setAlpha(0.6);
    this.setDisplaySize(30, 38);

    // Play explosion effect
    const explosion = this.scene.add.sprite(this.x, this.y, 'onDead');
    explosion.setDepth(5);
    if (this.scene.anims && !this.scene.anims.exists('anim_onDead')) {
      this.scene.anims.create({
        key: 'anim_onDead',
        frames: this.scene.anims.generateFrameNumbers('onDead', {
          start: 0,
          end: 11,
        }),
        frameRate: 15,
        repeat: 0,
      });
    }
    explosion.play('anim_onDead');
    explosion.on('animationcomplete', () => explosion.destroy());

    this.scene.time.delayedCall(1500, () => {
      if (this.scene) this.destroy();
    });
  }

  // ─── Path management ──────────────────────────────────────────────────────

  updateMonsterPath(newMonsterPath: [number, number][] | null): void {
    const {
      CELL_WIDTH: CW,
      CELL_HEIGHT: CH,
      GAME_BOARD_PADDING_TOP: PAD,
    } = this.mapService.mapConfig;

    if (this.getMoveType() === C.MONSTER_MOVE_TYPE_GROUND) {
      if (!newMonsterPath) return;
      this.tween?.stop();

      this.path = new Phaser.Curves.Path(this.x, this.y);
      let path = [...newMonsterPath];

      // Skip path segments already behind this monster
      let flag = true;
      while (flag && path.length > 1) {
        const p0x = path[0][1] * CW + CW / 2;
        const p1x = path[1][1] * CW + CW / 2;
        const p0y = path[0][0] * CH + PAD;
        const p1y = path[1][0] * CH + PAD;
        if (
          (p0x > this.x && this.x > p1x) ||
          (p0x < this.x && this.x < p1x) ||
          (p0y > this.y && this.y > p1y) ||
          (p0y < this.y && this.y < p1y)
        ) {
          path.splice(0, 1);
        } else {
          flag = false;
        }
      }

      path.forEach((i) => {
        this.path!.lineTo(CW * i[1] + CW / 2, i[0] * CH + CH / 2 + PAD);
      });

      const duration = (this.path.getLength() / this.speed) * 1000;
      this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
      this.tween = this.scene.tweens.add({
        targets: this.follower,
        t: 1,
        ease: 'Linear',
        duration,
        repeat: 0,
        onComplete: () => this.onReachEndpoint(this),
      });
      this.tween.timeScale = this.currentSpeedMultiplier;
    } else {
      // Flying — straight line from start to end
      if (this.tween) return;
      this.path = new Phaser.Curves.Path(this.x, this.y);

      const [sr, sc] = this.mapService.mapConfig.START_POSITION;
      const [er, ec] = this.mapService.mapConfig.END_POSITION;
      this.path.lineTo(CW * sc + CW / 2, sr * CH + PAD);
      this.path.lineTo(CW * ec + CW / 2, er * CH + PAD);

      const duration = (this.path.getLength() / this.speed) * 1000;
      this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
      this.tween = this.scene.tweens.add({
        targets: this.follower,
        t: 1,
        ease: 'Linear',
        duration,
        repeat: 0,
        onComplete: () => this.onReachEndpoint(this),
      });
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private updatePos(posX: number, posY: number): void {
    this.lastPosX = this.x;
    this.lastPosY = this.y;
    this.setPosition(posX, posY);

    if (this.getMoveType() === C.MONSTER_MOVE_TYPE_GROUND) {
      const dx = this.x - this.lastPosX;
      const dy = this.y - this.lastPosY;
      let dir: string | null = null;
      if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) {
        if (Math.abs(dx) >= Math.abs(dy)) {
          dir =
            dx < 0
              ? C.MONSTER_MOVE_DIRECTION_TO_LEFT
              : C.MONSTER_MOVE_DIRECTION_TO_RIGHT;
        } else {
          dir =
            dy < 0
              ? C.MONSTER_MOVE_DIRECTION_TO_TOP
              : C.MONSTER_MOVE_DIRECTION_TO_BOTTOM;
        }
      }
      if (dir && this.direction !== dir) {
        this.direction = dir;
        const key = buildAnimKey(this.monsterType, dir);
        if (this.scene.anims.exists(key)) this.anims.play(key, true);
      }
    }
  }

  /**
   * Register animations from monstersConfig and set initial stats.
   * Call this from prepareSpriteAsset() in every subclass.
   */
  protected setupAnimations(): void {
    const cfg = getMonsterConfig(this.monsterType);
    const fps = cfg.isFlying ? 18 : 10;

    const dirMap: [keyof typeof cfg.walkFrames, string][] = [
      ['right', C.MONSTER_MOVE_DIRECTION_TO_RIGHT],
      ['left', C.MONSTER_MOVE_DIRECTION_TO_LEFT],
      ['up', C.MONSTER_MOVE_DIRECTION_TO_TOP],
      ['down', C.MONSTER_MOVE_DIRECTION_TO_BOTTOM],
      ['fly', C.MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT],
    ];
    for (const [k, dir] of dirMap) {
      const frames = cfg.walkFrames[k];
      if (frames) {
        createAnimSafe(this.scene, {
          key: buildAnimKey(this.monsterType, dir),
          textureKey: cfg.spriteKey,
          startFrame: frames[0],
          endFrame: frames[1],
          frameRate: fps,
          repeat: -1,
        });
      }
    }

    // Stats from config
    this.maxHealth =
      cfg.baseHp +
      cfg.hpScalePerWave * (this.stateService.savedData?.wave ?? 1);
    this.health = this.maxHealth;
    this.speed = cfg.baseSpeed;
    this.armor = cfg.armor ?? 0;
    this.regenPerSec = cfg.regenPerSec ?? 0;
    this.isBoss = cfg.isBoss ?? false;

    if (cfg.displayWidth && cfg.displayHeight)
      this.setDisplaySize(cfg.displayWidth, cfg.displayHeight);
    if (cfg.hitCircleRadius !== undefined) {
      this.setCircle(
        cfg.hitCircleRadius,
        cfg.hitCircleOffsetX ?? 0,
        cfg.hitCircleOffsetY ?? 0,
      );
    }

    const initKey = buildAnimKey(this.monsterType, this.direction);
    if (this.scene.anims.exists(initKey)) this.anims.play(initKey, true);
  }

  private initDirection(): void {
    this.direction =
      this.getMoveType() === C.MONSTER_MOVE_TYPE_FLY
        ? C.MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT
        : C.MONSTER_MOVE_DIRECTION_TO_BOTTOM;
  }

  private initMovingPath(): void {
    if (this.getMoveType() === C.MONSTER_MOVE_TYPE_FLY) {
      this.updateMonsterPath(null);
    } else {
      this.updateMonsterPath(this.mapService.groundMonsterMovingPathDefault);
    }
  }

  private onPointerDown(): void {
    this.eventBus.emit(C.EVT_MONSTER_SELECTED, {
      monsterType: this.monsterType,
      hp: Math.round(this.health),
      maxHp: this.maxHealth,
      speed: this.speed,
      gold: this.getGoldOnDead(),
      armor: this.armor,
      isBoss: this.isBoss,
    });
  }

  // ─── Public accessors ─────────────────────────────────────────────────────

  getGoldOnDead(): number {
    return getMonsterConfig(this.monsterType).goldOnDead;
  }
  getName(): string {
    return this.monsterType;
  }
  getMoveType(): string {
    return getMonsterConfig(this.monsterType).moveType;
  }

  /** @deprecated Use tick() instead. Kept for any legacy callers. */
  setPosWithHealth(posX: number, posY: number): void {
    this.updatePos(posX, posY);
  }
}
