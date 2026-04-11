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

    this.add
      .image(0, 0, 'menu_bg')
      .setOrigin(0)
      .setDisplaySize(W, H)
      .setAlpha(0.6);
    this.add.rectangle(0, 0, W, H, 0x000000, 0.55).setOrigin(0);

    this.add
      .text(W / 2, 36, 'SELECT YOUR BATTLEFIELD', {
        fontSize: '28px',
        fontFamily: '"Cinzel", "Georgia", serif',
        color: '#ffd700',
        stroke: '#3a0a00',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Back button
    const back = this.add
      .text(40, 36, '← Back', {
        fontSize: '16px',
        color: '#aaa',
        fontFamily: 'Roboto, sans-serif',
      })
      .setOrigin(0, 0.5)
      .setInteractive();
    back.on('pointerover', () => back.setColor('#fff'));
    back.on('pointerout', () => back.setColor('#aaa'));
    back.on('pointerdown', () => this.scene.start(C.SCENE_MENU));

    const CARD_W = 140;
    const CARD_H = 200;
    const GAP = 18;
    const total = MAPS.length;
    const startX = W / 2 - ((CARD_W + GAP) * total - GAP) / 2 + CARD_W / 2;

    MAPS.forEach((map, i) => {
      const cx = startX + i * (CARD_W + GAP);
      const cy = H / 2 + 10;
      this.createMapCard(cx, cy, CARD_W, CARD_H, map);
    });
  }

  private createMapCard(
    cx: number,
    cy: number,
    w: number,
    h: number,
    map: MapInfo,
  ): void {
    // Card background
    const card = this.add
      .rectangle(cx, cy, w, h, 0x111111, 0.92)
      .setStrokeStyle(2, map.accentColor, 0.6)
      .setInteractive();

    // Thumbnail using BG color
    const thumb = this.add
      .rectangle(cx, cy - 40, w - 12, 80, map.accentColor, 0.2)
      .setStrokeStyle(1, map.accentColor, 0.5);

    // Name
    this.add
      .text(cx, cy + 16, map.name, {
        fontSize: '16px',
        fontFamily: '"Cinzel", serif',
        color: '#ffd700',
        align: 'center',
      })
      .setOrigin(0.5);

    // Difficulty stars
    const stars = '★'.repeat(map.difficulty) + '☆'.repeat(5 - map.difficulty);
    this.add
      .text(cx, cy + 36, stars, { fontSize: '13px', color: '#ff9933' })
      .setOrigin(0.5);

    // Description
    this.add
      .text(cx, cy + 65, map.description, {
        fontSize: '10px',
        color: '#cccccc',
        fontFamily: 'Roboto, sans-serif',
        align: 'center',
        wordWrap: { width: w - 8 },
      })
      .setOrigin(0.5);

    // Hover & click
    card.on('pointerover', () => {
      card.setStrokeStyle(2, map.accentColor, 1);
      this.tweens.add({
        targets: [card, thumb],
        scaleX: 1.03,
        scaleY: 1.03,
        duration: 100,
      });
    });
    card.on('pointerout', () => {
      card.setStrokeStyle(2, map.accentColor, 0.6);
      this.tweens.add({
        targets: [card, thumb],
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });
    card.on('pointerdown', () => {
      this.scene.start(C.SCENE_GAME, { mapKey: map.key });
    });
  }
}
