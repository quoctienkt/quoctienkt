import * as Phaser from 'phaser';
import { EventBus } from '../services/EventBus';
import { WaveService } from '../services/WaveService';
import * as C from '../constants';
import { FXHelper } from '../utils/FXHelper';
import { SoundManager } from '../services/SoundManager';

/**
 * HUDScene — runs in parallel on top of GameScene.
 * Subscribes to EventBus events and updates display elements.
 *
 * Layout:
 *   Top bar: Gold | Lives | Wave counter | Countdown
 *   Bottom right: Skill icons (Rain of Fire, Fortify, Rally)
 *   Info panel: bottom-left, shows selected monster/tower details
 */
export class HUDScene extends Phaser.Scene {
  private eventBus!: EventBus;
  private waveService!: WaveService;

  private goldText!: Phaser.GameObjects.Text;
  private lifeText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;
  private countdownText!: Phaser.GameObjects.Text;
  private infoPanel!: Phaser.GameObjects.Container;
  private sendWaveBtn!: Phaser.GameObjects.Text;

  private waveProgress!: Phaser.GameObjects.Graphics;
  private displayedGold = 0;

  private skillCooldowns: Record<string, number> = {};
  private skillBars: Record<string, Phaser.GameObjects.Graphics> = {};
  private skillBarPositions: Record<string, { x: number; y: number }> = {};

  constructor() {
    super({ key: C.SCENE_HUD });
  }

  init(data: { waveService: WaveService }): void {
    this.waveService = data.waveService;
  }

  create(): void {
    const W = this.cameras.main.width;
    this.eventBus = this.game.registry.get('eventBus') as EventBus;

    // ─── Top bar Glassmorphism ──────────────────────────────────────────
    const bar = this.add.graphics();
    bar.fillStyle(0x0a1424, 0.85);
    bar.fillRoundedRect(6, 4, W - 12, 32, 6);
    bar.lineStyle(1.5, 0x4af7a0, 0.25);
    bar.strokeRoundedRect(6, 4, W - 12, 32, 6);

    this.waveProgress = this.add.graphics().setDepth(1);

    this.add.text(14, 8, '🪙', { fontSize: '18px' });
    this.goldText = this.add.text(38, 12, '0', {
      fontSize: '14px',
      color: '#ffd700',
      fontFamily: 'Roboto, sans-serif',
      fontStyle: 'bold',
    });
    this.add.text(120, 8, '❤️', { fontSize: '18px' });
    this.lifeText = this.add.text(144, 12, '20', {
      fontSize: '14px',
      color: '#ff6666',
      fontFamily: 'Roboto, sans-serif',
      fontStyle: 'bold',
    });
    this.waveText = this.add.text(230, 12, 'Wave 0 / 20', {
      fontSize: '13px',
      color: '#88ddff',
      fontFamily: 'Roboto, sans-serif',
      fontStyle: 'bold',
    });
    this.countdownText = this.add.text(360, 12, '', {
      fontSize: '12px',
      color: '#aaaaaa',
      fontFamily: 'Roboto, sans-serif',
    });

    // Send wave early button
    this.sendWaveBtn = this.add
      .text(W - 130, 12, '⏩ SEND WAVE', {
        fontSize: '12px',
        color: '#88ff88',
        fontFamily: 'Roboto, sans-serif',
        fontStyle: 'bold',
      })
      .setInteractive();
    this.sendWaveBtn.on('pointerover', () =>
      this.sendWaveBtn.setColor('#ffffff'),
    );
    this.sendWaveBtn.on('pointerout', () =>
      this.sendWaveBtn.setColor('#88ff88'),
    );
    this.sendWaveBtn.on('pointerdown', () => {
      this.eventBus.emit('HUD_SEND_WAVE_EARLY', {});
    });

    // ─── Skill bar (bottom right) ─────────────────────────────────────────
    const skillDefs: any[] = [
      { id: C.SKILL_RAIN_OF_FIRE, label: '🔥', cooldown: 45000, x: W - 130 },
      { id: C.SKILL_FORTIFY, label: '🛡', cooldown: 60000, x: W - 85 },
      { id: C.SKILL_HERO_RALLY, label: '🏃', cooldown: 15000, x: W - 40 },
    ];
    const bH = this.cameras.main.height;
    for (const s of skillDefs) {
      const g = this.add.graphics();
      this.skillBars[s.id] = g;
      this.skillCooldowns[s.id] = 0;
      this.skillBarPositions[s.id] = { x: s.x, y: bH - 35 };

      // Glassmorphism button back
      const btnBg = this.add.graphics();
      btnBg.fillStyle(0x0a1424, 0.8);
      btnBg.fillRoundedRect(s.x - 18, bH - 53, 36, 36, 6);
      btnBg.lineStyle(1.5, 0x888888, 0.4);
      btnBg.strokeRoundedRect(s.x - 18, bH - 53, 36, 36, 6);

      const label = this.add
        .text(s.x, bH - 35, s.label, { fontSize: '20px' })
        .setOrigin(0.5)
        .setInteractive();

      label.on('pointerover', () => {
        btnBg.clear();
        btnBg.fillStyle(0x1a2e4a, 0.9);
        btnBg.fillRoundedRect(s.x - 18, bH - 53, 36, 36, 6);
        btnBg.lineStyle(1.5, 0x4af7a0, 0.8);
        btnBg.strokeRoundedRect(s.x - 18, bH - 53, 36, 36, 6);
      });

      label.on('pointerout', () => {
        btnBg.clear();
        btnBg.fillStyle(0x0a1424, 0.8);
        btnBg.fillRoundedRect(s.x - 18, bH - 53, 36, 36, 6);
        btnBg.lineStyle(1.5, 0x888888, 0.4);
        btnBg.strokeRoundedRect(s.x - 18, bH - 53, 36, 36, 6);
      });

      label.on('pointerdown', () => {
        if (this.skillCooldowns[s.id] <= 0) {
          this.eventBus.emit(C.EVT_SKILL_CAST, { skillId: s.id });
          this.skillCooldowns[s.id] = s.cooldown;
        }
      });

      // Draw graphic overlay on top of text
      g.setDepth(2);
    }

    // ─── Info panel (bottom left) ─────────────────────────────────────────
    this.infoPanel = this.add.container(-300, bH - 80).setDepth(3);
    const ipBg = this.add.graphics();
    ipBg.fillStyle(0x0a1424, 0.85);
    ipBg.fillRoundedRect(0, 0, 280, 64, 6);
    ipBg.lineStyle(1.5, 0x4af7a0, 0.25);
    ipBg.strokeRoundedRect(0, 0, 280, 64, 6);
    this.infoPanel.add(ipBg);

    // ─── EventBus bindings ────────────────────────────────────────────────
    const updateGold = ({ gold }: any) => {
      this.tweens.addCounter({
        from: this.displayedGold,
        to: gold,
        duration: 350,
        ease: 'Quad.Out',
        onUpdate: (tw) =>
          this.goldText.setText(`${Math.floor(tw.getValue() ?? 0)}`),
      });
      this.displayedGold = gold;
    };

    const updateLife = ({ life }: any) => {
      this.lifeText.setText(`${life}`);
      this.cameras.main.flash(120, 255, 50, 50, false);
      this.tweens.add({
        targets: this.lifeText,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 80,
        yoyo: true,
      });
    };

    const updateWave = ({ wave, total }: any) => {
      this.waveText.setText(`Wave ${wave} / ${total}`);
      const ratio = total > 0 ? wave / total : 0;
      this.waveProgress.clear();
      this.waveProgress.fillGradientStyle(
        0x4af7a0,
        0x4af7a0,
        0x00ff88,
        0x00ff88,
        1,
      );
      this.waveProgress.fillRect(6, 36, (W - 12) * ratio, 3);
    };

    const clearInfo = () => {
      this.tweens.add({
        targets: this.infoPanel,
        x: -300,
        duration: 180,
        ease: 'Quad.In',
        onComplete: () => {
          this.clearInfoPanel();
        },
      });
    };

    const playGameOverSound = () => SoundManager.getInstance().playGameOver();
    const playVictorySound = () => SoundManager.getInstance().playVictory();
    const playWaveStartSound = () => SoundManager.getInstance().playWaveStart();

    this.eventBus.on(C.EVT_GOLD_CHANGED, updateGold, this);
    this.eventBus.on(C.EVT_LIFE_CHANGED, updateLife, this);
    this.eventBus.on(C.EVT_WAVE_START, updateWave, this);
    this.eventBus.on(C.EVT_WAVE_START, playWaveStartSound, this);
    this.eventBus.on(C.EVT_MONSTER_SELECTED, this.showMonsterInfo, this);
    this.eventBus.on(C.EVT_TOWER_SELECTED, this.showTowerInfo, this);
    this.eventBus.on(C.EVT_TOWER_DESELECTED, clearInfo, this);
    this.eventBus.on(C.EVT_GAME_OVER, this.onGameOver, this);
    this.eventBus.on(C.EVT_GAME_OVER, playGameOverSound, this);
    this.eventBus.on(C.EVT_GAME_WIN, this.onGameWin, this);
    this.eventBus.on(C.EVT_GAME_WIN, playVictorySound, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.eventBus.off(C.EVT_GOLD_CHANGED, updateGold, this);
      this.eventBus.off(C.EVT_LIFE_CHANGED, updateLife, this);
      this.eventBus.off(C.EVT_WAVE_START, updateWave, this);
      this.eventBus.off(C.EVT_WAVE_START, playWaveStartSound, this);
      this.eventBus.off(C.EVT_MONSTER_SELECTED, this.showMonsterInfo, this);
      this.eventBus.off(C.EVT_TOWER_SELECTED, this.showTowerInfo, this);
      this.eventBus.off(C.EVT_TOWER_DESELECTED, clearInfo, this);
      this.eventBus.off(C.EVT_GAME_OVER, this.onGameOver, this);
      this.eventBus.off(C.EVT_GAME_OVER, playGameOverSound, this);
      this.eventBus.off(C.EVT_GAME_WIN, this.onGameWin, this);
      this.eventBus.off(C.EVT_GAME_WIN, playVictorySound, this);
    });
  }

  update(_time: number, delta: number): void {
    // Countdown
    if (this.waveService) {
      const sec = Math.ceil(this.waveService.nextWaveCountdown / 1000);
      this.countdownText.setText(sec > 0 ? `Next wave: ${sec}s` : '');
    }
    // Skill cooldown overlays (render pie arcs)
    for (const [id, g] of Object.entries(this.skillBars)) {
      g.clear();
      if (this.skillCooldowns[id] > 0) {
        this.skillCooldowns[id] = Math.max(0, this.skillCooldowns[id] - delta);
        const pos = this.skillBarPositions[id];
        if (pos) {
          const maxCooldown =
            id === C.SKILL_RAIN_OF_FIRE
              ? 45000
              : id === C.SKILL_FORTIFY
                ? 60000
                : 15000;
          const ratio = this.skillCooldowns[id] / maxCooldown;

          g.fillStyle(0x000000, 0.65);
          g.beginPath();
          g.moveTo(pos.x, pos.y);
          g.arc(
            pos.x,
            pos.y,
            18,
            -Math.PI / 2,
            -Math.PI / 2 + ratio * Math.PI * 2,
            false,
          );
          g.lineTo(pos.x, pos.y);
          g.closePath();
          g.fillPath();
        }
      }
    }
  }

  private showMonsterInfo({
    monsterType,
    hp,
    maxHp,
    speed,
    gold,
    armor,
    isBoss,
  }: any): void {
    this.clearInfoPanel();

    const lines = [
      `${monsterType.replace('Monster_', '').replace('Boss_', '⚠ ')}  ${isBoss ? '[BOSS]' : ''}`,
      `HP: ${hp}/${maxHp}  Spd: ${speed}  Gold: ${gold}  Armor: ${Math.round(armor * 100)}%`,
    ];
    lines.forEach((txt, i) => {
      this.infoPanel.add(
        this.add.text(12, 10 + i * 20, txt, {
          fontSize: i === 0 ? '13px' : '11px',
          color: isBoss ? '#ff8888' : '#ffffaa',
          fontFamily: 'Roboto, sans-serif',
          fontStyle: i === 0 ? 'bold' : 'normal',
        }),
      );
    });

    this.tweens.add({
      targets: this.infoPanel,
      x: 8,
      duration: 200,
      ease: 'Back.Out',
    });
  }

  private showTowerInfo({
    towerType,
    level,
    range,
    priority,
    cost,
    description,
    isBuyingPreview,
    upgradeCost,
    sellPrice,
    isMaxLevel,
  }: any): void {
    this.clearInfoPanel();

    const cleanName = towerType.replace('Tower_', '');
    let lines = [];
    if (isBuyingPreview) {
      lines = [
        `${cleanName} (Preview) — Buy: ${cost}🪙`,
        `Range: ${range} | ${description || ''}`,
      ];
    } else {
      const upgradeText = isMaxLevel ? 'MAX' : `${upgradeCost}🪙`;
      lines = [
        `${cleanName}  Lv ${level} (Priority: ${priority || 'first'})`,
        `Range: ${range} | Upgrade: ${upgradeText} | Sell: ${sellPrice}🪙`,
      ];
    }

    lines.forEach((txt, i) => {
      this.infoPanel.add(
        this.add.text(12, 10 + i * 22, txt, {
          fontSize: i === 0 ? '13px' : '11px',
          color: i === 0 ? '#4af7a0' : '#aaddff',
          fontFamily: 'Roboto, sans-serif',
          fontStyle: i === 0 ? 'bold' : 'normal',
        }),
      );
    });

    this.tweens.add({
      targets: this.infoPanel,
      x: 8,
      duration: 200,
      ease: 'Back.Out',
    });
  }

  private onGameOver({ victory }: any): void {
    this.scene.start(C.SCENE_GAME_OVER, { victory });
  }

  private onGameWin(): void {
    this.scene.start(C.SCENE_GAME_OVER, { victory: true });
  }

  private clearInfoPanel(): void {
    if (!this.infoPanel || !this.infoPanel.list) return;
    for (let i = this.infoPanel.list.length - 1; i >= 1; i--) {
      this.infoPanel.list[i].destroy();
    }
  }
}
