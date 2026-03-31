import * as Phaser from 'phaser';
import type { SavedData } from '../types';

export class GameStateService {
  scene: Phaser.Scene | null = null;
  savedData: SavedData | null = null;

  private waveText: Phaser.GameObjects.Text | null = null;
  private lifeText: Phaser.GameObjects.Text | null = null;
  private goldText: Phaser.GameObjects.Text | null = null;

  setScene(scene: Phaser.Scene): void {
    this.scene = scene;
  }

  setGold(callback: (prev: number) => number): void {
    this.savedData!.gold = callback(this.savedData!.gold);
    this.goldText?.setText(`${this.savedData!.gold}`);
  }

  setWave(callback: (prev: number) => number): void {
    this.savedData!.wave = callback(this.savedData!.wave);
    this.waveText?.setText(`Wave: ${this.savedData!.wave}`);
  }

  setLife(callback: (prev: number) => number): void {
    this.savedData!.life = callback(this.savedData!.life);
    this.lifeText?.setText(`Lives: ${this.savedData!.life}`);
  }

  init(gameData: SavedData): void {
    this.savedData = gameData;

    this.waveText = this.scene!.add.text(290, 29, `Wave: ${gameData.wave}`, {
      fontSize: '15px',
      color: '#ffffff',
      fontFamily: 'Roboto, sans-serif',
    });

    this.lifeText = this.scene!.add.text(360, 150, `Lives: ${gameData.life}`, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Roboto, sans-serif',
    });

    this.goldText = this.scene!.add.text(615, 230, `${gameData.gold}`, {
      fontSize: '13px',
      color: '#ffd64c',
      fontFamily: 'Roboto, sans-serif',
    });
  }
}
