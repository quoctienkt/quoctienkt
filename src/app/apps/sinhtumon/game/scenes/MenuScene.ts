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

    // --- Procedural Parallax Layers ---
    // 1. Sky Layer (depth -10)
    const sky = this.add.graphics().setDepth(-10);
    sky.fillGradientStyle(0x050515, 0x050515, 0x151a3a, 0x151a3a, 1);
    sky.fillRect(-50, -50, W + 100, H + 100);

    // 2. Mist/Hills Layer (depth -8)
    const hills = this.add.graphics().setDepth(-8);
    hills.fillStyle(0x0e1124, 0.6);
    hills.fillEllipse(W * 0.25, H + 40, W * 0.8, H * 0.5);
    hills.fillEllipse(W * 0.75, H + 80, W * 0.9, H * 0.6);
    hills.fillEllipse(W * 0.5, H + 120, W * 1.0, H * 0.7);

    // 3. Foreground silhouette (depth -6)
    const fgTrees = this.add.graphics().setDepth(-6);
    fgTrees.fillStyle(0x08060f, 1);
    const points: Phaser.Geom.Point[] = [];
    points.push(new Phaser.Geom.Point(-50, H + 100));
    let currentX = -50;
    while (currentX < W + 50) {
      currentX += 40 + Math.random() * 40;
      const height = 40 + Math.random() * 80;
      points.push(new Phaser.Geom.Point(currentX, H - height));
      currentX += 20 + Math.random() * 20;
      points.push(new Phaser.Geom.Point(currentX, H));
    }
    points.push(new Phaser.Geom.Point(W + 50, H + 100));
    fgTrees.fillPoints(points);

    // Mouse parallax interaction
    this.input.on('pointermove', (ptr: Phaser.Input.Pointer) => {
      const dx = (ptr.x - W / 2) / (W / 2);
      const dy = (ptr.y - H / 2) / (H / 2);
      sky.setPosition(dx * -10, dy * -10);
      hills.setPosition(dx * -25, dy * -25);
      fgTrees.setPosition(dx * -45, dy * -45);
    });

    // Slow continuous drift tweens
    this.tweens.add({
      targets: hills,
      y: '+=15',
      duration: 8000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    this.tweens.add({
      targets: fgTrees,
      y: '+=10',
      duration: 6000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

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
      .setOrigin(0.5)
      .setScale(0)
      .setAlpha(0);

    // Bounce-in title
    this.tweens.add({
      targets: title,
      scale: 1,
      alpha: 1,
      duration: 1000,
      ease: 'Back.Out',
      onComplete: () => {
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

        // Continuous gold shimmer
        let colorIdx = 0;
        const colors = [0xffd700, 0xffaa00, 0xffd700, 0xffffaa];
        this.time.addEvent({
          delay: 600,
          loop: true,
          callback: () => {
            title.setTint(colors[colorIdx]);
            colorIdx = (colorIdx + 1) % colors.length;
          }
        });
      }
    });

    const subtitle = this.add
      .text(W / 2, H * 0.32, 'Kingdom of Sins: Defend the Realm', {
        fontSize: '16px',
        fontFamily: 'Roboto, sans-serif',
        color: '#ffcc88',
      })
      .setOrigin(0.5)
      .setScale(0)
      .setAlpha(0);

    this.tweens.add({
      targets: subtitle,
      scale: 1,
      alpha: 0.9,
      delay: 300,
      duration: 800,
      ease: 'Back.Out'
    });

    // Buttons
    this.addButton(W / 2, H * 0.52, '▶  PLAY', () =>
      this.scene.start(C.SCENE_MAP_SELECT),
    );
    this.addButton(W / 2, H * 0.65, 'HOW TO PLAY', () => this.showHowToPlay());

    // Version
    this.add
      .text(W - 10, H - 10, 'v3.0 🔥', {
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
    
    // Add glow ring
    const glow = this.add.rectangle(x, y, 248, 60).setDepth(-2);
    glow.setFillStyle(0x00000000, 0);
    glow.setStrokeStyle(3, 0xffaa00, 0);

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

    // Pop-in buttons
    bg.setScale(0);
    border.setScale(0);
    txt.setScale(0);

    this.tweens.add({
      targets: [bg, border, txt],
      scale: 1,
      duration: 800,
      ease: 'Back.Out',
      delay: 500
    });

    bg.on('pointerover', () => {
      bg.setFillStyle(0x4a1500, 0.9);
      border.setStrokeStyle(2, 0xff8800, 1);
      txt.setColor('#ff8800');

      // Glow pulse
      glow.setStrokeStyle(3, 0xffaa00, 0.8);
      this.tweens.add({
        targets: glow,
        alpha: { from: 0.8, to: 0.2 },
        scaleX: 1.05,
        scaleY: 1.08,
        duration: 500,
        yoyo: true,
        repeat: -1
      });

      this.tweens.add({
        targets: [bg, border, txt],
        scale: 1.04,
        duration: 150,
        ease: 'Quad.Out'
      });
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(0x1a0800, 0.85);
      border.setStrokeStyle(2, 0xffd700, 1);
      txt.setColor('#ffd700');

      glow.setStrokeStyle(3, 0xffaa00, 0);
      this.tweens.killTweensOf(glow);
      glow.setScale(1);
      glow.setAlpha(1);

      this.tweens.add({
        targets: [bg, border, txt],
        scale: 1,
        duration: 150,
        ease: 'Quad.Out'
      });
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

    this.time.delayedCall(100, () => {
      this.input.once('pointerdown', close);
    });
  }

  private createEmbers(W: number, H: number): void {
    for (let i = 0; i < 15; i++) {
      const x = Phaser.Math.Between(0, W);
      const y = H + 10;
      const size = Phaser.Math.Between(2, 5);
      const ember = this.add.rectangle(
        x,
        y,
        size,
        size,
        0xff5500,
        Phaser.Math.FloatBetween(0.4, 0.9),
      );
      this.tweens.add({
        targets: ember,
        y: y - Phaser.Math.Between(100, 300),
        x: x + Phaser.Math.Between(-40, 40),
        alpha: 0,
        duration: Phaser.Math.Between(2000, 4000),
        onComplete: () => ember.destroy(),
      });
    }
  }

  private addEmbersEffect(W: number, H: number): void {
    this.createEmbers(W, H);
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.createEmbers(W, H),
    });
  }
}
