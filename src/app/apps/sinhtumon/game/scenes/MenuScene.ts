import * as Phaser from 'phaser';
import * as C from '../constants';

/**
 * MenuScene — Kingdom Rush-style main menu with animated background.
 */
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: C.SCENE_MENU });
  }

  create(): void {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    // Background
    this.add
      .image(0, 0, 'menu_bg')
      .setOrigin(0)
      .setDisplaySize(W, H)
      .setAlpha(0.85);
    this.add.rectangle(0, 0, W, H, 0x000000, 0.45).setOrigin(0);

    // Animated particles (embers)
    this.addEmbersEffect(W, H);

    // Title
    const title = this.add
      .text(W / 2, H * 0.2, '⚔  TOWER DEFENSE  ⚔', {
        fontSize: '42px',
        fontFamily: '"Cinzel", "Georgia", serif',
        color: '#ffd700',
        stroke: '#4a1500',
        strokeThickness: 6,
        shadow: {
          blur: 20,
          color: '#ff8800',
          fill: true,
          offsetX: 0,
          offsetY: 0,
        },
      })
      .setOrigin(0.5);

    // Pulse the title
    this.tweens.add({
      targets: title,
      scaleX: 1.04,
      scaleY: 1.04,
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.add
      .text(W / 2, H * 0.32, 'Kingdom of Sins: Defend the Realm', {
        fontSize: '16px',
        fontFamily: 'Roboto, sans-serif',
        color: '#ffcc88',
      })
      .setOrigin(0.5)
      .setAlpha(0.9);

    // Buttons
    this.addButton(W / 2, H * 0.52, '▶  PLAY', () =>
      this.scene.start(C.SCENE_MAP_SELECT),
    );
    this.addButton(W / 2, H * 0.65, 'HOW TO PLAY', () => this.showHowToPlay());

    // Version
    this.add
      .text(W - 10, H - 10, 'v2.0', {
        fontSize: '11px',
        color: '#888',
        fontFamily: 'Roboto, sans-serif',
      })
      .setOrigin(1);
  }

  private addButton(
    x: number,
    y: number,
    label: string,
    onClick: () => void,
  ): void {
    const bg = this.add
      .rectangle(x, y, 240, 52, 0x1a0800, 0.85)
      .setInteractive();
    const border = this.add.rectangle(x, y, 244, 56, 0xffd700, 1).setDepth(-1);
    border.setFillStyle(0x00000000, 0);
    border.setStrokeStyle(2, 0xffd700, 1);
    const txt = this.add
      .text(x, y, label, {
        fontSize: '22px',
        fontFamily: '"Cinzel", "Georgia", serif',
        color: '#ffd700',
      })
      .setOrigin(0.5);

    bg.on('pointerover', () => {
      bg.setFillStyle(0x4a1500, 0.9);
      border.setStrokeStyle(2, 0xff8800, 1);
      txt.setColor('#ff8800');
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(0x1a0800, 0.85);
      border.setStrokeStyle(2, 0xffd700, 1);
      txt.setColor('#ffd700');
    });
    bg.on('pointerup', onClick);
  }

  private showHowToPlay(): void {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const panel = this.add
      .rectangle(W / 2, H / 2, 460, 340, 0x110800, 0.97)
      .setStrokeStyle(2, 0xffd700)
      .setDepth(1000);

    const helpText = [
      '🗺  Select a map to start',
      '🏰  Click a square to build a tower',
      '⬆  Click a tower to upgrade or sell',
      '💰  Kill enemies to earn gold',
      '⚡  Use skills to turn the tide',
      '🧙  Your hero respawns automatically',
      '',
      '      Press anywhere to close',
    ];

    const text = this.add
      .text(W / 2, H / 2, helpText.join('\n'), {
        fontSize: '15px',
        fontFamily: 'Roboto, sans-serif',
        color: '#ffe066',
        align: 'left',
        lineSpacing: 10,
      })
      .setOrigin(0.5)
      .setDepth(1001);

    const close = () => {
      panel.destroy();
      text.destroy();
    };

    // Use a tiny delay to prevent the current click from immediately closing the panel
    this.time.delayedCall(100, () => {
      this.input.once('pointerdown', close);
    });
  }

  private createEmbers(W: number, H: number): void {
    // Simple ember particles using Graphics rectangles
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, W);
      const y = Phaser.Math.Between(0, H);
      const size = Phaser.Math.Between(2, 5);
      const ember = this.add.rectangle(
        x,
        y,
        size,
        size,
        0xff4400,
        Phaser.Math.FloatBetween(0.3, 0.8),
      );
      this.tweens.add({
        targets: ember,
        y: y - Phaser.Math.Between(80, 220),
        alpha: 0,
        duration: Phaser.Math.Between(1800, 3500),
        delay: Phaser.Math.Between(0, 2000),
        onComplete: () => ember.destroy(),
      });
    }
  }

  private addEmbersEffect(W: number, H: number): void {
    this.createEmbers(W, H);
    // Re-spawn embers every 1.5s
    this.time.addEvent({
      delay: 1500,
      loop: true,
      callback: () => this.createEmbers(W, H),
    });
  }
}
