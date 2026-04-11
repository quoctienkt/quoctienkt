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

    this.add
      .rectangle(0, 0, W, H, victory ? 0x001133 : 0x220000, 0.92)
      .setOrigin(0);

    const title = this.add
      .text(W / 2, H * 0.28, victory ? '🏆 VICTORY!' : '💀 DEFEAT', {
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
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: title,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.add
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
      .setOrigin(0.5);

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
      0x226622,
      0x44aa44,
    );

    this.addBtn(
      W / 2 + 100,
      btnY,
      'MAP SELECT',
      () => this.scene.start(C.SCENE_MAP_SELECT),
      0x222266,
      0x4444aa,
    );

    // Particles
    if (victory) this.celebrationParticles(W, H);
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
      .setStrokeStyle(2, 0xffffff, 0.5)
      .setInteractive();
    const txt = this.add
      .text(x, y, label, {
        fontSize: '18px',
        fontFamily: '"Cinzel", serif',
        color: '#ffffff',
      })
      .setOrigin(0.5);
    bg.on('pointerover', () => bg.setFillStyle(hover, 0.95));
    bg.on('pointerout', () => bg.setFillStyle(fill, 0.9));
    bg.on('pointerdown', onClick);
    void txt;
  }

  private celebrationParticles(W: number, H: number): void {
    const colors = [0xffd700, 0x00ff88, 0xff8800, 0x88ddff];
    for (let i = 0; i < 40; i++) {
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
}
