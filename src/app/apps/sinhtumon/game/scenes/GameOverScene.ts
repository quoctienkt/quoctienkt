import * as Phaser from 'phaser';
import * as C from '../constants';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: C.SCENE_GAME_OVER });
  }

  init(data: { victory: boolean }): void {
    this.registry.set('victory', data.victory);
  }

  create(): void {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const victory = this.registry.get('victory') as boolean;

    // Gradient background
    const bg = this.add.graphics();
    if (victory) {
      bg.fillGradientStyle(0x00081a, 0x00081a, 0x0a1c3a, 0x0a1c3a, 1);
    } else {
      bg.fillGradientStyle(0x100000, 0x100000, 0x220505, 0x220505, 1);
    }
    bg.fillRect(0, 0, W, H);

    // Crack lines on defeat
    if (!victory) {
      this.showCracksEffect(W, H);
    }

    const title = this.add
      .text(
        W / 2,
        victory ? H * 0.28 : -100,
        victory ? '🏆 VICTORY!' : '💀 DEFEAT',
        {
          fontSize: '56px',
          fontFamily: '"Cinzel", "Georgia", serif',
          color: victory ? '#ffd700' : '#ff4444',
          stroke: victory ? '#006600' : '#660000',
          strokeThickness: 6,
          shadow: {
            blur: 30,
            color: victory ? '#00ff88' : '#ff0000',
            fill: true,
          },
        },
      )
      .setOrigin(0.5);

    if (victory) {
      title.setScale(0);
      this.tweens.add({
        targets: title,
        scale: 1,
        duration: 900,
        ease: 'Back.Out',
        onComplete: () => {
          this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
        },
      });
    } else {
      // Fall down & bounce
      this.tweens.add({
        targets: title,
        y: H * 0.28,
        duration: 800,
        ease: 'Bounce.easeOut',
        onComplete: () => {
          this.cameras.main.shake(200, 0.008);
          // Continuous scale pulse
          this.tweens.add({
            targets: title,
            scaleX: 1.03,
            scaleY: 1.03,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
        },
      });
    }

    const subtitle = this.add
      .text(
        W / 2,
        H * 0.44,
        victory
          ? 'The realm is safe… for now.'
          : 'The enemies breached the gates!',
        {
          fontSize: '18px',
          color: victory ? '#88ff88' : '#ff8888',
          fontFamily: 'Roboto, sans-serif',
        },
      )
      .setOrigin(0.5)
      .setScale(0)
      .setAlpha(0);

    this.tweens.add({
      targets: subtitle,
      scale: 1,
      alpha: 1,
      duration: 600,
      ease: 'Quad.Out',
      delay: victory ? 300 : 800,
    });

    // Buttons
    const btnY = H * 0.62;
    this.addBtn(
      W / 2 - 100,
      btnY,
      'PLAY AGAIN',
      () => {
        this.scene.start(C.SCENE_GAME, {
          mapKey: this.registry.get('mapKey') ?? C.MAP_CROSSROADS,
        });
      },
      victory ? 0x114422 : 0x441111,
      victory ? 0x228844 : 0x882222,
    );

    this.addBtn(
      W / 2 + 100,
      btnY,
      'MAP SELECT',
      () => this.scene.start(C.SCENE_MAP_SELECT),
      victory ? 0x112244 : 0x111111,
      victory ? 0x224488 : 0x333333,
    );

    // Extra premium effects
    if (victory) {
      this.celebrationParticles(W, H);
    } else {
      this.enemyMarchSilhouettes(W, H);
    }
  }

  private addBtn(
    x: number,
    y: number,
    label: string,
    onClick: () => void,
    fill: number,
    hover: number,
  ): void {
    const bg = this.add
      .rectangle(x, y, 170, 48, fill, 0.9)
      .setStrokeStyle(2, 0xffffff, 0.35)
      .setInteractive();

    const txt = this.add
      .text(x, y, label, {
        fontSize: '16px',
        fontFamily: '"Cinzel", serif',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Pop button
    bg.setScale(0);
    txt.setScale(0);
    this.tweens.add({
      targets: [bg, txt],
      scale: 1,
      duration: 500,
      ease: 'Back.Out',
      delay: 500,
    });

    bg.on('pointerover', () => {
      bg.setFillStyle(hover, 0.95);
      this.tweens.add({
        targets: [bg, txt],
        scale: 1.05,
        duration: 100,
      });
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(fill, 0.9);
      this.tweens.add({
        targets: [bg, txt],
        scale: 1,
        duration: 100,
      });
    });
    bg.on('pointerdown', onClick);
  }

  private celebrationParticles(W: number, H: number): void {
    const colors = [0xffd700, 0x00ff88, 0xff8800, 0x88ddff];
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, W);
      const y = H + 10;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const dot = this.add.rectangle(x, y, 6, 10, color);
      this.tweens.add({
        targets: dot,
        y: Phaser.Math.Between(-40, H * 0.5),
        x: x + Phaser.Math.Between(-60, 60),
        angle: Phaser.Math.Between(0, 720),
        alpha: 0,
        delay: Phaser.Math.Between(0, 1500),
        duration: Phaser.Math.Between(1500, 3000),
        onComplete: () => dot.destroy(),
      });
    }
  }

  private showCracksEffect(W: number, H: number): void {
    const g = this.add.graphics().setDepth(1);
    g.lineStyle(1.5, 0x220505, 0.85);

    const centers = [
      { x: W * 0.25, y: H * 0.4 },
      { x: W * 0.75, y: H * 0.6 },
    ];

    for (const c of centers) {
      for (let i = 0; i < 5; i++) {
        g.beginPath();
        g.moveTo(c.x, c.y);
        let px = c.x;
        let py = c.y;
        for (let step = 0; step < 5; step++) {
          px += Phaser.Math.Between(-35, 35);
          py += Phaser.Math.Between(-35, 35);
          g.lineTo(px, py);
        }
        g.strokePath();
      }
    }
  }

  private enemyMarchSilhouettes(W: number, H: number): void {
    const count = 7;
    for (let i = 0; i < count; i++) {
      const m = this.add
        .rectangle(-50, H - 40, 16, 22, 0x050505)
        .setOrigin(0.5);
      this.tweens.add({
        targets: m,
        x: W + 100,
        delay: i * 900,
        duration: 9000,
        repeat: -1,
      });
    }
  }
}
