import * as Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { MapSelectScene } from './scenes/MapSelectScene';
import { GameScene } from './scenes/GameScene';
import { HUDScene } from './scenes/HUDScene';
import { GameOverScene } from './scenes/GameOverScene';
// MainScene import removed — legacy file kept on disk for reference only
// import { MainScene } from './scenes/MainScene';

export function createGame(canvas: HTMLCanvasElement): Phaser.Game {
  const GAME_WIDTH = 520 + 150; // map + sidebar
  const GAME_HEIGHT = 60 + 520 + 80;

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS,
    canvas,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    physics: { default: 'arcade' },
    scene: [
      BootScene, // 1. Preloads all assets, registers EventBus
      MenuScene, // 2. Main menu
      MapSelectScene, // 3. Map picker
      GameScene, // 4. Core gameplay
      HUDScene, // 5. Layered HUD (launched in parallel by GameScene)
      GameOverScene, // 6. Win / Lose screen
    ],
  };

  const game = new Phaser.Game(config);
  return game;
}
