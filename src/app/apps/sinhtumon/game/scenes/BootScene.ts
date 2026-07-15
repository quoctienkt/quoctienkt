import * as Phaser from 'phaser';
import { EventBus } from '../services/EventBus';
import * as C from '../constants';
import { generateAllProceduralAssets } from '../utils/ProceduralAssetGenerator';

/**
 * BootScene — registers the EventBus in game.registry then preloads all assets.
 * After loading, it starts MenuScene.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: C.SCENE_BOOT });
  }

  preload(): void {
    const bus = new EventBus();
    this.game.registry.set('eventBus', bus);

    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    // Gradient background sky
    const sky = this.add.graphics();
    sky.fillGradientStyle(0x0a0e2a, 0x0a0e2a, 0x1a2a6c, 0x1a2a6c, 1);
    sky.fillRect(0, 0, W, H);

    const bgBar = this.add.graphics();
    bgBar.fillStyle(0x222222, 0.6);
    bgBar.fillRoundedRect(W / 2 - 160, H / 2 - 15, 320, 24, 12);
    bgBar.lineStyle(2, 0x4af7a0, 0.3);
    bgBar.strokeRoundedRect(W / 2 - 160, H / 2 - 15, 320, 24, 12);

    const bar = this.add.graphics();
    bar.fillStyle(0x4af7a0, 1);
    bar.fillRoundedRect(W / 2 - 156, H / 2 - 11, 312, 16, 8);

    const txt = this.add
      .text(W / 2, H / 2 + 35, 'Forging the realm…', {
        fontSize: '14px',
        color: '#ffcc88',
        fontFamily: '"Cinzel", serif',
      })
      .setOrigin(0.5);

    // Pulse the text
    this.tweens.add({
      targets: txt,
      alpha: 0.4,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Generate all assets programmatically in texture cache
    generateAllProceduralAssets(this);
  }

  create(): void {
    this.cameras.main.fade(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(C.SCENE_MENU);
    });
  }
}
