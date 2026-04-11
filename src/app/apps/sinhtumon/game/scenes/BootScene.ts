import * as Phaser from 'phaser';
import { EventBus } from '../services/EventBus';
import * as C from '../constants';
import { monstersConfig } from '../config/monsters.config';
import { towersConfig } from '../config/towers.config';
import { heroesConfig } from '../config/heroes.config';

/**
 * BootScene — registers the EventBus in game.registry then preloads all assets.
 * After loading, it starts MenuScene.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: C.SCENE_BOOT });
  }

  preload(): void {
    // ─── Register EventBus ─────────────────────────────────────────────────
    const bus = new EventBus();
    this.game.registry.set('eventBus', bus);

    // ─── Loading bar ───────────────────────────────────────────────────────
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const bar = this.add.graphics();
    const bgBar = this.add.graphics();
    bgBar.fillStyle(0x222222, 0.8).fillRect(W / 2 - 160, H / 2 - 20, 320, 30);
    this.load.on('progress', (v: number) => {
      bar.clear();
      bar.fillStyle(0x4af7a0, 1).fillRect(W / 2 - 156, H / 2 - 16, 312 * v, 22);
    });
    const txt = this.add
      .text(W / 2, H / 2 + 28, 'Loading…', {
        fontSize: '16px',
        color: '#fff',
        fontFamily: 'Roboto, sans-serif',
      })
      .setOrigin(0.5);
    this.load.on('complete', () => {
      bar.destroy();
      bgBar.destroy();
      txt.destroy();
    });

    // ─── Background images ─────────────────────────────────────────────────
    this.load.image('background1', '/quoctienkt/sinhtumon/img/background1.png');
    // Placeholder fallbacks for maps without assets yet
    this.load.image(
      'background_volcano',
      '/quoctienkt/sinhtumon/img/background1.png',
    );
    this.load.image(
      'background_ice',
      '/quoctienkt/sinhtumon/img/background1.png',
    );
    this.load.image(
      'background_forest',
      '/quoctienkt/sinhtumon/img/background1.png',
    );

    // ─── UI assets ────────────────────────────────────────────────────────
    this.load.image('upgrade', '/quoctienkt/sinhtumon/img/loop.png');
    this.load.spritesheet('sell', '/quoctienkt/sinhtumon/img/coin.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image('tower_range', '/quoctienkt/sinhtumon/img/tower_range.png');
    this.load.spritesheet('onDead', '/quoctienkt/sinhtumon/img/explosion.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image('skill_rain_of_fire', '/quoctienkt/sinhtumon/img/blue.png');
    this.load.image('skill_fortify', '/quoctienkt/sinhtumon/img/green.png');
    this.load.image('skill_hero_rally', '/quoctienkt/sinhtumon/img/snow.png');
    this.load.image('menu_bg', '/quoctienkt/sinhtumon/img/background1.png');

    // ─── Legacy / existing assets first (keep for backward compat) ─────────
    this.load.spritesheet(
      C.MONSTER_GRUNT,
      '/quoctienkt/sinhtumon/monsters/ani_beast.png',
      { frameWidth: 32, frameHeight: 53 },
    );
    this.load.spritesheet(
      C.MONSTER_MUMMY,
      '/quoctienkt/sinhtumon/monsters/metalslug_mummy37x45.png',
      { frameWidth: 37, frameHeight: 45 },
    );
    this.load.spritesheet(
      C.MONSTER_HARPY,
      '/quoctienkt/sinhtumon/monsters/butterfly.png',
      { frameWidth: 70, frameHeight: 65 },
    );

    // ─── Tower assets (per level) ──────────────────────────────────────────
    for (const [type, cfg] of Object.entries(towersConfig)) {
      for (let lvl = 1; lvl <= cfg.maxLevel; lvl++) {
        this.loadImageFallback(
          `${type}_level_${lvl}`,
          `/quoctienkt/sinhtumon${cfg.assetPathFn(lvl)}`,
        );
        this.loadImageFallback(
          `${type}_level_${lvl}_ammo`,
          `/quoctienkt/sinhtumon${cfg.ammoAssetPathFn(lvl)}`,
        );
      }
    }

    // ─── Monster sprite sheets ─────────────────────────────────────────────
    for (const [mt, mcfg] of Object.entries(monstersConfig)) {
      // Only load new monsters not already loaded under legacy keys
      if ([C.MONSTER_GRUNT, C.MONSTER_MUMMY, C.MONSTER_HARPY].includes(mt))
        continue;
      this.load.spritesheet(
        mcfg.spriteKey,
        `/quoctienkt/sinhtumon${mcfg.assetPath}`,
        { frameWidth: mcfg.frameWidth, frameHeight: mcfg.frameHeight },
      );
    }

    // ─── Hero sprite sheets ────────────────────────────────────────────────
    for (const [ht, hcfg] of Object.entries(heroesConfig)) {
      this.load.spritesheet(
        hcfg.spriteKey,
        `/quoctienkt/sinhtumon${hcfg.assetPath}`,
        { frameWidth: hcfg.frameWidth, frameHeight: hcfg.frameHeight },
      );
    }
  }

  create(): void {
    this.scene.start(C.SCENE_MENU);
  }

  /** Try loading an asset path; if the server 404s, Phaser uses the fallback texture. */
  private loadImageFallback(key: string, path: string): void {
    this.load.image(key, path);
  }
}
