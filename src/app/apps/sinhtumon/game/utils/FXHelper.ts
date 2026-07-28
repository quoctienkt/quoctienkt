import * as Phaser from 'phaser';

export class FXHelper {
  static dustBurst(scene: Phaser.Scene, x: number, y: number): void {
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 8 + Math.random() * 18;
      const rect = scene.add.rectangle(x, y, 4, 4, 0xbbaa88).setDepth(999);
      scene.tweens.add({
        targets: rect,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scaleX: 0.2,
        scaleY: 0.2,
        duration: 350 + Math.random() * 150,
        onComplete: () => rect.destroy(),
      });
    }
  }

  static sparkBurst(
    scene: Phaser.Scene,
    x: number,
    y: number,
    color: number,
  ): void {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 12 + Math.random() * 20;
      const rect = scene.add.rectangle(x, y, 3, 3, color).setDepth(999);
      scene.tweens.add({
        targets: rect,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        duration: 200 + Math.random() * 100,
        onComplete: () => rect.destroy(),
      });
    }
  }

  static floatingText(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    color: string,
  ): void {
    const txt = scene.add
      .text(x, y - 20, text, {
        fontSize: '12px',
        color: color,
        fontFamily: '"Roboto", sans-serif',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(9999);

    scene.tweens.add({
      targets: txt,
      y: y - 60,
      alpha: 0,
      duration: 800,
      onComplete: () => txt.destroy(),
    });
  }

  static goldFloat(
    scene: Phaser.Scene,
    x: number,
    y: number,
    amount: number,
  ): void {
    this.floatingText(scene, x, y, `+${amount}🪙`, '#ffd700');
  }

  static shockwave(
    scene: Phaser.Scene,
    x: number,
    y: number,
    radius: number,
    color = 0xffffff,
  ): void {
    const g = scene.add.graphics().setDepth(999);
    g.lineStyle(2, color, 1);

    scene.tweens.addCounter({
      from: 0,
      to: radius,
      duration: 500,
      onUpdate: (tween) => {
        if (!g.active) return;
        g.clear();
        const val = tween.getValue() ?? 0;
        const progress = radius > 0 ? val / radius : 1;
        g.lineStyle(2, color, 1 - progress);
        g.strokeCircle(x, y, val);
      },
      onComplete: () => g.destroy(),
    });
  }

  static waveBanner(
    scene: Phaser.Scene,
    message: string,
    accentColor: number,
  ): void {
    const W = scene.cameras.main.width;
    const bannerContainer = scene.add.container(0, -80).setDepth(9999);

    const bg = scene.add.graphics();
    bg.fillStyle(0x0a1a2a, 0.9);
    bg.fillRoundedRect(W / 2 - 160, 0, 320, 48, 8);
    bg.lineStyle(2, accentColor, 0.8);
    bg.strokeRoundedRect(W / 2 - 160, 0, 320, 48, 8);
    bannerContainer.add(bg);

    const txt = scene.add
      .text(W / 2, 24, message, {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: '"Cinzel", serif',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);
    bannerContainer.add(txt);

    // Slide down, hold, slide up
    scene.tweens.add({
      targets: bannerContainer,
      y: 80,
      duration: 500,
      ease: 'Back.Out',
      onComplete: () => {
        scene.time.delayedCall(1500, () => {
          if (scene && bannerContainer) {
            scene.tweens.add({
              targets: bannerContainer,
              y: -80,
              duration: 400,
              ease: 'Back.In',
              onComplete: () => bannerContainer.destroy(),
            });
          }
        });
      },
    });
  }

  static screenShake(
    scene: Phaser.Scene,
    duration = 100,
    intensity = 0.005,
  ): void {
    scene.cameras.main.shake(duration, intensity);
  }
}
