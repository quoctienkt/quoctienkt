import * as Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';

export function createGame(
  canvas: HTMLCanvasElement,
  assetPathPrefix: string,
): Phaser.Game {
  const GAME_WIDTH = 520 + 150;
  const GAME_HEIGHT = 60 + 520 + 80; // +80 for GAME_BOARD_PADDING_TOP

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS,
    canvas,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    physics: {
      default: 'arcade',
    },
    scene: MainScene,
  };

  const game = new Phaser.Game(config);

  game.registry.set('assetPathPrefix', assetPathPrefix);

  return game;
}
