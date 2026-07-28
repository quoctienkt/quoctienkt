import * as Phaser from 'phaser';
import type { GameMapConfig } from '../types';
import { findWay } from '../utils/mazePuzzle';
import { GameStateService } from '../services/GameStateService';
import * as C from '../constants';

export abstract class GameMapServiceBase {
  scene: Phaser.Scene | null = null;
  gameStateService: GameStateService | null = null;
  mapConfig: GameMapConfig;

  currentStartPosition: [number, number];
  currentEndPosition: [number, number];
  groundMonsterMovingPathDefault: [number, number][] | null;

  constructor(mapConfig: GameMapConfig) {
    this.mapConfig = {
      ...mapConfig,
      map: mapConfig.map.map(row => [...row]),
      START_POSITION: [...mapConfig.START_POSITION],
      END_POSITION: [...mapConfig.END_POSITION],
    };
    this.currentStartPosition = [...this.mapConfig.START_POSITION];
    this.currentEndPosition = [...this.mapConfig.END_POSITION];
    this.groundMonsterMovingPathDefault = this.getGroundMonsterMovingPath();
  }


  setScene(scene: Phaser.Scene): void {
    this.scene = scene;
  }

  init(gameStateService: GameStateService): void {
    this.gameStateService = gameStateService;

    // Global animations registered once at scene init
    if (!this.scene!.anims.exists('dead')) {
      this.scene!.anims.create({
        key: 'dead',
        frames: 'onDead',
        frameRate: 500,
        repeat: 0,
      });
    }
    if (!this.scene!.anims.exists('rotate')) {
      this.scene!.anims.create({
        key: 'rotate',
        frames: 'sell',
        frameRate: 10,
        repeat: -1,
      });
    }

    const CW = this.mapConfig.CELL_WIDTH;
    const CH = this.mapConfig.CELL_HEIGHT;
    const W = this.scene!.game.config.width as number;
    const H = this.scene!.game.config.height as number;

    const numCols = this.mapConfig.map[0]?.length ?? 13;
    const numRows = this.mapConfig.map.length;
    const gridW = numCols * CW;
    const gridH = numRows * CH;
    const gridX = Math.max(0, Math.floor((W - gridW) / 2)); // centre the grid

    // Calculate vertical offset dynamically to center the map between the top HUD bar and bottom info bar
    const availableHeight = H - 150; // top HUD (y=60), bottom panel (y=H-90)
    const padTop = 60 + Math.max(10, Math.floor((availableHeight - gridH) / 2));
    this.mapConfig.GAME_BOARD_PADDING_TOP = padTop;
    const PAD = padTop;
    const gridTop = PAD;
    const gridBot = gridTop + gridH;

    // Pick themed colors for the surrounding terrain/desert frame and full-screen ambient background
    const mapKey = this.mapConfig.mapKey;
    let terrainFill: number, terrainEdge: number;
    let ambientTop: number, ambientBot: number;

    if (mapKey.includes('volcano')) {
      terrainFill = 0x330a00; terrainEdge = 0x541400;
      ambientTop = 0x2b0600; ambientBot = 0x120200;
    } else if (mapKey.includes('ice')) {
      terrainFill = 0x061d36; terrainEdge = 0x0d325c;
      ambientTop = 0x0a2342; ambientBot = 0x040f1f;
    } else if (mapKey.includes('forest') || mapKey.includes('cursed')) {
      terrainFill = 0x120624; terrainEdge = 0x230c45;
      ambientTop = 0x0e041f; ambientBot = 0x05010d;
    } else {
      // Crossroads / grass plains
      terrainFill = 0x112b14; terrainEdge = 0x1a3e1e;
      ambientTop = 0x122b14; ambientBot = 0x09180a;
    }

    // Store the centering offset so Square / monsters can apply it
    this.mapConfig.GRID_OFFSET_X = gridX;

    // 1. Draw a full-screen ambient backdrop
    if (this.scene!.textures.exists('rocky_mountain_bg')) {
      const bg = this.scene!.add.image(W / 2, H / 2, 'rocky_mountain_bg');
      bg.setDepth(-5);
      bg.setDisplaySize(W, H);
      
      // Add a dark overlay so the game grid stands out
      const overlay = this.scene!.add.graphics().setDepth(-4.9);
      overlay.fillStyle(0x000000, 0.45); // 45% black opacity overlay
      overlay.fillRect(0, 0, W, H);
    } else {
      // Fallback to ambient gradient backdrop
      const ambient = this.scene!.add.graphics().setDepth(-5);
      ambient.fillGradientStyle(ambientTop, ambientTop, ambientBot, ambientBot, 1);
      ambient.fillRect(0, 0, W, H);
    }

    // 2. Draw soft drop-shadow behind the floating board
    const shadow = this.scene!.add.graphics().setDepth(-4);
    shadow.fillStyle(0x000000, 0.55);
    shadow.fillRect(gridX + 8, gridTop + 8, gridW, gridH);

    // 3. Draw soft translucent side vignettes around the board
    const terrain = this.scene!.add.graphics().setDepth(-3.8);
    terrain.fillStyle(0x000000, 0.25);
    // Left strip
    terrain.fillRect(0, gridTop, gridX, gridH);
    // Right strip
    terrain.fillRect(gridX + gridW, gridTop, W - gridX - gridW, gridH);

    // 4. Draw premium stone frame border around the board
    const border = this.scene!.add.graphics().setDepth(-2.5);
    border.lineStyle(3, terrainEdge, 1);
    border.strokeRect(gridX, gridTop, gridW, gridH);

    // ─── Entrance portal ─────────────────────────────────────────────────────
    const startCol = this.currentStartPosition[1];
    const entranceX = gridX + startCol * CW + CW; // Shifted 0.5 cell to the right (CW/2 + CW/2)
    const entranceY = PAD - 1.5 * CH; // Moved 1.5 cells away from the map

    // ─── Exit portal ─────────────────────────────────────────────────────────
    const endRow = this.currentEndPosition[0];
    const endCol  = this.currentEndPosition[1];
    const exitX = gridX + endCol * CW + CW; // Shifted 0.5 cell to the right
    const exitY = gridBot + 1.5 * CH; // Moved 1.5 cells away from the map

    // Entrance Gate (Green portal)
    const entrancePortal = this.scene!.add.graphics().setDepth(-2);
    // Exit Gate (Red portal)
    const exitPortal = this.scene!.add.graphics().setDepth(-2);

    this.scene!.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      onUpdate: (tw) => {
        if (!entrancePortal.active || !exitPortal.active) return;
        entrancePortal.clear();
        exitPortal.clear();
        
        const progress = tw.getValue() ?? 0.5;
        this.drawGate(entrancePortal, entranceX, entranceY, CW, 0x00ff88, progress);
        this.drawGate(exitPortal, exitX, exitY, CW, 0xff3333, progress);
      },
    });


    // ─── Draw path tiles ─────────────────────────────────────────────────────
    // Road cells (CELL_BLOCKED=1) are rendered as colored cobblestone tiles
    const pathGraphics = this.scene!.add.graphics().setDepth(-2);
    const map = this.mapConfig.map;
    const AVAILABLE = this.mapConfig.CELL_AVAILABLE;

    // Pick path color palette by map theme
    let roadBase: number, roadEdge: number, roadHighlight: number;
    if (mapKey.includes('volcano')) {
      roadBase = 0x3a1a0a; roadEdge = 0x220e04; roadHighlight = 0x6a3018;
    } else if (mapKey.includes('ice')) {
      roadBase = 0x0e2a40; roadEdge = 0x081828; roadHighlight = 0x1a4a66;
    } else if (mapKey.includes('forest') || mapKey.includes('cursed')) {
      roadBase = 0x0e2010; roadEdge = 0x071208; roadHighlight = 0x1a3a18;
    } else {
      // Crossroads / default
      roadBase = 0x1a2030; roadEdge = 0x0e1420; roadHighlight = 0x2a3448;
    }

    const isCrossroads = this.mapConfig.mapKey === C.MAP_CROSSROADS;
    if (!isCrossroads) {
      for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
          const x = gridX + col * CW;
          const y = row * CH + PAD;
          if (map[row][col] !== AVAILABLE) {
            // Road base fill
            pathGraphics.fillStyle(roadBase, 1);
            pathGraphics.fillRect(x + 1, y + 1, CW - 2, CH - 2);

            // Top/left highlight
            pathGraphics.fillStyle(roadHighlight, 0.4);
            pathGraphics.fillRect(x + 1, y + 1, CW - 2, 2);
            pathGraphics.fillRect(x + 1, y + 1, 2, CH - 2);

            // Bottom/right shadow
            pathGraphics.fillStyle(roadEdge, 0.6);
            pathGraphics.fillRect(x + 1, y + CH - 3, CW - 2, 2);
            pathGraphics.fillRect(x + CW - 3, y + 1, 2, CH - 2);

            // Center cobblestone pattern (subtle)
            pathGraphics.fillStyle(roadHighlight, 0.12);
            pathGraphics.fillRect(x + CW / 2 - 4, y + CH / 2 - 3, 8, 6);
          }
        }
      }
    }

    // ─── Background image (drawn exactly inside the map grid boundary) ────────
    const bgKey = this.mapConfig.backgroundKey ?? 'background1';
    const background = this.scene!.add.image(gridX, gridTop, bgKey).setOrigin(0);
    background.setDepth(-3);
    background.setDisplaySize(gridW, gridH);

    // Draw subtle grid lines on top of the map background texture
    if (!isCrossroads) {
      const gridLines = this.scene!.add.graphics().setDepth(-2.9);
      
      // Choose line color based on the map theme
      let gridColor = 0x4af7a0; // default green-gold
      let gridAlpha = 0.18;
      if (bgKey.includes('volcano')) {
        gridColor = 0xff5a00;
        gridAlpha = 0.22;
      } else if (bgKey.includes('ice')) {
        gridColor = 0x64dcff;
        gridAlpha = 0.25;
      } else if (bgKey.includes('forest')) {
        gridColor = 0xb464ff;
        gridAlpha = 0.22;
      }
      
      gridLines.lineStyle(1, gridColor, gridAlpha);
      
      // Vertical grid lines
      for (let c = 0; c <= numCols; c++) {
        const lx = gridX + c * CW;
        gridLines.beginPath();
        gridLines.moveTo(lx, gridTop);
        gridLines.lineTo(lx, gridTop + gridH);
        gridLines.strokePath();
      }
      // Horizontal grid lines
      for (let r = 0; r <= numRows; r++) {
        const ly = gridTop + r * CH;
        gridLines.beginPath();
        gridLines.moveTo(gridX, ly);
        gridLines.lineTo(gridX + gridW, ly);
        gridLines.strokePath();
      }

      // Intersection dots
      gridLines.fillStyle(gridColor, gridAlpha * 1.5);
      for (let c = 0; c <= numCols; c++) {
        for (let r = 0; r <= numRows; r++) {
          gridLines.fillCircle(gridX + c * CW, gridTop + r * CH, 1.2);
        }
      }
    }
  }

  getGroundMonsterMovingPath(
    map: number[][] | null = null,
    startPosition: [number, number] | null = null,
    endPosition: [number, number] | null = null,
  ): [number, number][] | null {
    const currentMap = map ?? this.mapConfig.map;
    const defaultStart = startPosition ?? this.currentStartPosition;
    const end = endPosition ?? this.currentEndPosition;

    if (startPosition) {
      return findWay(currentMap, startPosition, end);
    }

    const [sr, sc] = defaultStart;
    
    // 1. Try the default start cell
    const path = findWay(currentMap, [sr, sc], end);
    if (path) return path;

    // 2. If default start cell is blocked, find the nearest open cell on the entry row
    const cols = currentMap[sr]?.length ?? 0;
    let bestPath: [number, number][] | null = null;
    let minDistance = Infinity;

    for (let col = 0; col < cols; col++) {
      if (currentMap[sr][col] === 0) {
        const altPath = findWay(currentMap, [sr, col], end);
        if (altPath) {
          const dist = Math.abs(col - sc);
          if (dist < minDistance) {
            minDistance = dist;
            bestPath = altPath;
          }
        }
      }
    }
    return bestPath;
  }

  tryUpdateMap(col: number, row: number, cellState: number): boolean {
    const nextMapState = this.mapConfig.map.map((r) => [...r]);
    nextMapState[row][col] = cellState;

    const newGroundPath = this.getGroundMonsterMovingPath(nextMapState);
    if (!newGroundPath) return false;

    const newMonstersPathList: ([number, number][] | null)[] = [];
    const mapRows = nextMapState.length;
    const mapCols = nextMapState[0]?.length ?? 0;
    for (const monster of this.gameStateService!.savedData!.monsters) {
      if (monster.getMoveType() === C.MONSTER_MOVE_TYPE_GROUND) {
        const rawRow = Math.floor(
          (monster.y - this.mapConfig.GAME_BOARD_PADDING_TOP) /
            this.mapConfig.CELL_HEIGHT,
        );
        const ox = this.mapConfig.GRID_OFFSET_X ?? 0;
        const rawCol = Math.floor((monster.x - ox) / this.mapConfig.CELL_WIDTH);
        // Clamp to valid map indices — monster may be in the entrance gate (row -1)
        const monsterPosition: [number, number] = [
          Math.max(0, Math.min(mapRows - 1, rawRow)),
          Math.max(0, Math.min(mapCols - 1, rawCol)),
        ];
        const newPath = this.getGroundMonsterMovingPath(
          nextMapState,
          monsterPosition,
          this.mapConfig.END_POSITION,
        );
        if (!newPath) return false;
        newMonstersPathList.push(newPath);
      } else {
        newMonstersPathList.push(null);
      }
    }

    this.gameStateService!.savedData!.monsters.forEach((monster, i) => {
      monster.updateMonsterPath(newMonstersPathList[i]);
    });

    this.mapConfig.map = nextMapState;
    this.groundMonsterMovingPathDefault = newGroundPath;
    return true;
  }

  private drawGate(graphics: Phaser.GameObjects.Graphics, x: number, y: number, cellWidth: number, color: number, pulseProgress: number): void {
    const W = cellWidth * 2;  // Spans exactly 2 cells wide
    const H = 14;             // Thin horizontal gate

    // Dark backdrop
    graphics.fillStyle(0x0e1124, 0.95);
    graphics.fillRect(x - W/2, y - H/2, W, H);

    // Stone frame border
    graphics.lineStyle(2, 0x3a4f66, 1);
    graphics.strokeRect(x - W/2, y - H/2, W, H);

    // Glowing energy portal interior fill
    graphics.fillStyle(color, 0.18 + pulseProgress * 0.18);
    graphics.fillRect(x - W/2 + 2, y - H/2 + 2, W - 4, H - 4);

    // Glowing border line
    graphics.lineStyle(1.5, color, 0.45 + pulseProgress * 0.45);
    graphics.strokeRect(x - W/2 + 2, y - H/2 + 2, W - 4, H - 4);

    // Scanning vertical laser lines
    const lineCount = 4;
    for (let i = 0; i < lineCount; i++) {
      const lineProgress = (pulseProgress + i / lineCount) % 1;
      const lx = x - W / 2 + 4 + (W - 8) * lineProgress;
      graphics.lineStyle(1, color, 0.35 * (1 - lineProgress));
      graphics.lineBetween(lx, y - H/2 + 3, lx, y + H/2 - 3);
    }
  }

}
