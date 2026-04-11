import * as Phaser from 'phaser';
import type { SavedData } from '../types';
import { EventBus } from './EventBus';
import * as C from '../constants';

/**
 * Pure state container — NO text rendering.
 * All UI text is handled by HUDScene listening to EventBus events.
 */
export class GameStateService {
  scene: Phaser.Scene | null = null;
  savedData: SavedData | null = null;
  private eventBus: EventBus | null = null;

  setScene(scene: Phaser.Scene): void {
    this.scene = scene;
    this.eventBus = scene.game.registry.get('eventBus') as EventBus;
  }

  init(gameData: SavedData): void {
    this.savedData = gameData;
    // Notify HUDScene of initial values
    this.eventBus?.emit(C.EVT_GOLD_CHANGED, { gold: gameData.gold });
    this.eventBus?.emit(C.EVT_LIFE_CHANGED, { life: gameData.life });
  }

  setGold(callback: (prev: number) => number): void {
    this.savedData!.gold = callback(this.savedData!.gold);
    this.eventBus?.emit(C.EVT_GOLD_CHANGED, { gold: this.savedData!.gold });
  }

  setWave(callback: (prev: number) => number): void {
    this.savedData!.wave = callback(this.savedData!.wave);
  }

  setLife(callback: (prev: number) => number): void {
    this.savedData!.life = callback(this.savedData!.life);
    this.eventBus?.emit(C.EVT_LIFE_CHANGED, { life: this.savedData!.life });
    if (this.savedData!.life <= 0) {
      this.eventBus?.emit(C.EVT_GAME_OVER, { victory: false });
    }
  }

  addScore(amount: number): void {
    this.savedData!.score += amount;
    this.eventBus?.emit(C.EVT_SCORE_CHANGED, { score: this.savedData!.score });
  }
}
