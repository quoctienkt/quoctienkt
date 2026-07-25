import * as Phaser from 'phaser';
import * as C from '../constants';

interface MapInfo {
  key: string;
  name: string;
  description: string;
  difficulty: number; // 1–5
  bgKey: string;
  accentColor: number;
}

const MAPS: MapInfo[] = [
  {
    key: C.MAP_CROSSROADS,
    name: 'Crossroads',
    description: 'A classic spiral path.\nGood hunting for new commanders.',
    difficulty: 2,
    bgKey: 'background1',
    accentColor: 0x4af7a0,
  },
  {
    key: C.MAP_VOLCANO,
    name: 'Volcano Pass',
    description: 'Dragons roam here.\nFire-immune enemies abound.',
    difficulty: 3,
    bgKey: 'background_volcano',
    accentColor: 0xff5533,
  },
  {
    key: C.MAP_ICE_VALLEY,
    name: 'Ice Valley',
    description: 'Fast creatures surge in swarms.\nFrost towers excel here.',
    difficulty: 3,
    bgKey: 'background_ice',
    accentColor: 0x88ddff,
  },
  {
    key: C.MAP_CURSED_FOREST,
    name: 'Cursed Forest',
    description: 'Demons and golems lurk the trees.\nOnly veterans survive.',
    difficulty: 5,
    bgKey: 'background_forest',
    accentColor: 0xaa44ff,
  },
];

/**
 * MapSelectScene — shows a map card for each available map.
 * Player clicks one to launch that map in GameScene.
 */
export class MapSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: C.SCENE_MAP_SELECT });
  }

  create(): void {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    // --- Procedural Parallax Background ---
    const sky = this.add.graphics().setDepth(-10);
    sky.fillGradientStyle(0x050515, 0x050515, 0x101530, 0x101530, 1);
    sky.fillRect(-50, -50, W + 100, H + 100);

    const hills = this.add.graphics().setDepth(-8);
    hills.fillStyle(0x0a0c1a, 0.7);
    hills.fillEllipse(W * 0.3, H + 20, W * 0.9, H * 0.5);
    hills.fillEllipse(W * 0.7, H + 60, W * 1.0, H * 0.6);

    this.tweens.add({
      targets: hills,
      y: '+=10',
      duration: 7000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.add
      .text(W / 2, 45, 'SELECT YOUR BATTLEFIELD', {
        fontSize: '28px',
        fontFamily: '"Cinzel", "Georgia", serif',
        color: '#ffd700',
        stroke: '#3a0a00',
        strokeThickness: 4,
        shadow: {
          blur: 10,
          color: '#ff8800',
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Back button
    const back = this.add
      .text(40, 45, '← Back', {
        fontSize: '16px',
        color: '#aaa',
        fontFamily: 'Roboto, sans-serif',
      })
      .setOrigin(0, 0.5)
      .setInteractive();

    back.on('pointerover', () => back.setColor('#fff'));
    back.on('pointerout', () => back.setColor('#aaa'));
    back.on('pointerdown', () => this.scene.start(C.SCENE_MENU));

    const CARD_W = 145;
    const CARD_H = 210;
    const GAP = 16;
    const total = MAPS.length;
    const startX = W / 2 - ((CARD_W + GAP) * total - GAP) / 2 + CARD_W / 2;

    MAPS.forEach((map, i) => {
      const cx = startX + i * (CARD_W + GAP);
      const cy = H / 2 + 25;
      this.createMapCard(cx, cy, CARD_W, CARD_H, map, i);
    });
  }

  private createMapCard(
    cx: number,
    cy: number,
    w: number,
    h: number,
    map: MapInfo,
    index: number,
  ): void {
    // 1. Drop shadow (drawn in scene space below card)
    const shadow = this.add
      .graphics()
      .fillStyle(0x000000, 0.45)
      .fillRoundedRect(cx - w / 2 + 4, cy - h / 2 + 6, w, h, 10)
      .setDepth(0);

    // 2. Card Container
    const container = this.add.container(cx, cy).setDepth(1);

    // Card background
    const bg = this.add
      .graphics()
      .fillStyle(0x11111d, 0.95)
      .fillRoundedRect(-w / 2, -h / 2, w, h, 10)
      .lineStyle(2, map.accentColor, 0.5)
      .strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
    container.add(bg);

    // Thumbnail gradient area
    const thumb = this.add.graphics();
    thumb.fillGradientStyle(
      map.accentColor,
      map.accentColor,
      0x050510,
      0x050510,
      0.45,
    );
    thumb.fillRoundedRect(-w / 2 + 6, -h / 2 + 6, w - 12, 85, 6);
    thumb.lineStyle(1, map.accentColor, 0.4);
    thumb.strokeRoundedRect(-w / 2 + 6, -h / 2 + 6, w - 12, 85, 6);
    container.add(thumb);

    // Map Name
    const nameText = this.add
      .text(0, 18, map.name, {
        fontSize: '16px',
        fontFamily: '"Cinzel", serif',
        color: '#ffd700',
        align: 'center',
      })
      .setOrigin(0.5);
    container.add(nameText);

    // Difficulty stars
    const starText = this.add
      .text(0, 38, '', { fontSize: '13px', color: '#ff9933' })
      .setOrigin(0.5);
    container.add(starText);

    // Star pop-in stagger-animation
    let visibleStars = '';
    for (let s = 0; s < 5; s++) {
      this.time.delayedCall(500 + index * 150 + s * 80, () => {
        if (s < map.difficulty) {
          visibleStars += '★';
        } else {
          visibleStars += '☆';
        }
        starText.setText(visibleStars);
      });
    }

    // Description
    const descText = this.add
      .text(0, 68, map.description, {
        fontSize: '10px',
        color: '#cccccc',
        fontFamily: 'Roboto, sans-serif',
        align: 'center',
        wordWrap: { width: w - 16 },
      })
      .setOrigin(0.5);
    container.add(descText);

    // Lock indicator overlay for hard maps (maps 3 & 4: difficulty >= 3, or let's say index >= 2)
    // We make it click-playable but show a "Locked" status label or "HARD / EXPERT" badge
    if (map.difficulty >= 4) {
      const badgeBg = this.add.graphics();
      badgeBg.fillStyle(0x4a0000, 0.85);
      badgeBg.fillRoundedRect(-40, -h / 2 + 10, 80, 18, 4);
      container.add(badgeBg);
      const badgeText = this.add
        .text(0, -h / 2 + 19, 'EXPERT', {
          fontSize: '9px',
          color: '#ff4444',
          fontFamily: 'Roboto, sans-serif',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
      container.add(badgeText);
    }

    // Invisible hit zone on top of container to drive interaction
    const hitZone = this.add
      .rectangle(0, 0, w, h, 0x000000, 0.001)
      .setInteractive();
    container.add(hitZone);

    // Card pop-in animation
    container.setScale(0);
    container.setAlpha(0);
    shadow.setScale(0);
    shadow.setAlpha(0);

    this.tweens.add({
      targets: [container, shadow],
      scale: 1,
      alpha: 1,
      duration: 600,
      ease: 'Back.Out',
      delay: index * 100,
    });

    // Hover & click events
    hitZone.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x1a1a2e, 0.95)
        .fillRoundedRect(-w / 2, -h / 2, w, h, 10)
        .lineStyle(2.5, map.accentColor, 1)
        .strokeRoundedRect(-w / 2, -h / 2, w, h, 10);

      this.tweens.add({
        targets: container,
        y: cy - 10,
        duration: 180,
        ease: 'Cubic.easeOut',
      });
      this.tweens.add({
        targets: shadow,
        y: cy + 4,
        scaleX: 1.04,
        scaleY: 1.04,
        alpha: 0.6,
        duration: 180,
        ease: 'Cubic.easeOut',
      });
    });

    hitZone.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x11111d, 0.95)
        .fillRoundedRect(-w / 2, -h / 2, w, h, 10)
        .lineStyle(2, map.accentColor, 0.5)
        .strokeRoundedRect(-w / 2, -h / 2, w, h, 10);

      this.tweens.add({
        targets: container,
        y: cy,
        duration: 180,
        ease: 'Cubic.easeIn',
      });
      this.tweens.add({
        targets: shadow,
        y: cy,
        scaleX: 1.0,
        scaleY: 1.0,
        alpha: 0.45,
        duration: 180,
        ease: 'Cubic.easeIn',
      });
    });

    hitZone.on('pointerdown', () => {
      this.scene.start(C.SCENE_GAME, { mapKey: map.key });
    });
  }
}
