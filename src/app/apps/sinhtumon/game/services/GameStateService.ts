import * as Phaser from 'phaser';

export class GameStateService {
  scene: Phaser.Scene | null = null;
  savedData: {
    towers: any[];
    monsters: any[];
    bullets: any[];
    wave: number;
    life: number;
    gold: number;
  } | null = null;

  waveText: Phaser.GameObjects.Text | null = null;
  lifeText: Phaser.GameObjects.Text | null = null;
  goldText: Phaser.GameObjects.Text | null = null;

  setScene(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setGold(callback: (prev: number) => number) {
    this.savedData!.gold = callback(this.savedData!.gold);
    this.goldText!.setText(`${this.savedData!.gold}`);
  }

  setWave(callback: (prev: number) => number) {
    this.savedData!.wave = callback(this.savedData!.wave);
    this.waveText!.setText(`Đợt: ${this.savedData!.wave}`);
  }

  setLife(callback: (prev: number) => number) {
    this.savedData!.life = callback(this.savedData!.life);
    this.lifeText!.setText(`Máu: ${this.savedData!.life}`);
  }

  init(gameData: typeof this.savedData) {
    this.savedData = gameData;

    this.waveText = this.scene!.add.text(290, 29, `${this.savedData!.wave}`, {
      fontSize: '15px',
      color: '#fff',
      fontFamily: 'roboto',
    });

    this.lifeText = this.scene!.add.text(360, 150, `Máu ${this.savedData!.life}`, {
      fontSize: '20px',
      color: '#fff',
      fontFamily: 'roboto',
    });

    this.goldText = this.scene!.add.text(615, 230, `${this.savedData!.gold}`, {
      fontSize: '13px',
      color: '#ffd64c',
      fontFamily: 'roboto',
    });
  }
}
