import * as Phaser from 'phaser';
import { EventBus } from '../services/EventBus';
import { WaveService } from '../services/WaveService';
import * as C from '../constants';

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

  private skillCooldowns: Record<string, number> = {};
  private skillBars: Record<string, Phaser.GameObjects.Graphics> = {};

  constructor() {
    super({ key: C.SCENE_HUD });
  }

  init(data: { waveService: WaveService }): void {
    this.waveService = data.waveService;
  }

  create(): void {
    const W = this.cameras.main.width;
    this.eventBus = this.game.registry.get('eventBus') as EventBus;

    // ─── Top bar ──────────────────────────────────────────────────────────
    this.add.rectangle(0, 0, W, 38, 0x0a0a0a, 0.88).setOrigin(0);
    this.add.text(8, 4, '🪙', { fontSize: '20px' });
    this.goldText = this.add.text(32, 8, '0', {
      fontSize: '16px',
      color: '#ffd700',
      fontFamily: 'Roboto, sans-serif',
    });
    this.add.text(130, 4, '❤️', { fontSize: '20px' });
    this.lifeText = this.add.text(154, 8, '20', {
      fontSize: '16px',
      color: '#ff6666',
      fontFamily: 'Roboto, sans-serif',
    });
    this.waveText = this.add.text(250, 8, 'Wave 0 / 20', {
      fontSize: '14px',
      color: '#88ddff',
      fontFamily: 'Roboto, sans-serif',
    });
    this.countdownText = this.add.text(400, 8, '', {
      fontSize: '13px',
      color: '#aaaaaa',
      fontFamily: 'Roboto, sans-serif',
    });

    // Send wave early button
    this.sendWaveBtn = this.add
      .text(500, 8, '⏩ SEND WAVE', {
        fontSize: '13px',
        color: '#88ff88',
        fontFamily: 'Roboto, sans-serif',
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
      // Hidden by user request
      // { id: C.SKILL_RAIN_OF_FIRE, label: '🔥', cooldown: 45000, x: W - 130 },
      // { id: C.SKILL_FORTIFY, label: '🛡', cooldown: 60000, x: W - 85 },
      // { id: C.SKILL_HERO_RALLY, label: '🏃', cooldown: 15000, x: W - 40 },
    ];
    const bH = this.cameras.main.height;
    for (const s of skillDefs) {
      const g = this.add.graphics();
      this.skillBars[s.id] = g;
      this.skillCooldowns[s.id] = 0;
      this.add
        .rectangle(s.x, bH - 35, 36, 36, 0x111111, 0.85)
        .setStrokeStyle(1, 0x888888);
      this.add
        .text(s.x, bH - 35, s.label, { fontSize: '22px' })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
          if (this.skillCooldowns[s.id] <= 0) {
            this.eventBus.emit(C.EVT_SKILL_CAST, { skillId: s.id });
            this.skillCooldowns[s.id] = s.cooldown;
          }
        });
    }

    // ─── Info panel (bottom left) ─────────────────────────────────────────
    this.infoPanel = this.add.container(4, bH - 80);
    this.add
      .rectangle(4 + 140, bH - 50, 280, 60, 0x111111, 0.8)
      .setStrokeStyle(1, 0x444444);

    // ─── EventBus bindings ────────────────────────────────────────────────
    const updateGold = ({ gold }: any) => this.goldText.setText(`${gold}`);
    const updateLife = ({ life }: any) => this.lifeText.setText(`${life}`);
    const updateWave = ({ wave, total }: any) =>
      this.waveText.setText(`Wave ${wave} / ${total}`);
    const clearInfo = () => this.infoPanel.removeAll(true);

    this.eventBus.on(C.EVT_GOLD_CHANGED, updateGold, this);
    this.eventBus.on(C.EVT_LIFE_CHANGED, updateLife, this);
    this.eventBus.on(C.EVT_WAVE_START, updateWave, this);
    this.eventBus.on(C.EVT_MONSTER_SELECTED, this.showMonsterInfo, this);
    this.eventBus.on(C.EVT_TOWER_SELECTED, this.showTowerInfo, this);
    this.eventBus.on(C.EVT_TOWER_DESELECTED, clearInfo, this);
    this.eventBus.on(C.EVT_GAME_OVER, this.onGameOver, this);
    this.eventBus.on(C.EVT_GAME_WIN, this.onGameWin, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.eventBus.off(C.EVT_GOLD_CHANGED, updateGold, this);
      this.eventBus.off(C.EVT_LIFE_CHANGED, updateLife, this);
      this.eventBus.off(C.EVT_WAVE_START, updateWave, this);
      this.eventBus.off(C.EVT_MONSTER_SELECTED, this.showMonsterInfo, this);
      this.eventBus.off(C.EVT_TOWER_SELECTED, this.showTowerInfo, this);
      this.eventBus.off(C.EVT_TOWER_DESELECTED, clearInfo, this);
      this.eventBus.off(C.EVT_GAME_OVER, this.onGameOver, this);
      this.eventBus.off(C.EVT_GAME_WIN, this.onGameWin, this);
    });
  }

  update(_time: number, delta: number): void {
    // Countdown
    if (this.waveService) {
      const sec = Math.ceil(this.waveService.nextWaveCountdown / 1000);
      this.countdownText.setText(sec > 0 ? `Next wave: ${sec}s` : '');
    }
    // Skill cooldown overlays
    for (const [id, g] of Object.entries(this.skillBars)) {
      g.clear();
      if (this.skillCooldowns[id] > 0) {
        this.skillCooldowns[id] = Math.max(0, this.skillCooldowns[id] - delta);
        // gray overlay not shown here (icons are emoji) — could add pie overlay
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
    this.infoPanel.removeAll(true);
    const lines = [
      `${monsterType.replace('Monster_', '').replace('Boss_', '⚠ ')}  ${isBoss ? '[BOSS]' : ''}`,
      `HP: ${hp}/${maxHp}  Spd: ${speed}  Gold: ${gold}  Armor: ${Math.round(armor * 100)}%`,
    ];
    lines.forEach((txt, i) => {
      this.infoPanel.add(
        this.add.text(0, i * 18, txt, {
          fontSize: i === 0 ? '13px' : '11px',
          color: isBoss ? '#ff8888' : '#ffffaa',
          fontFamily: 'Roboto, sans-serif',
        }),
      );
    });
  }

  private showTowerInfo({ towerType, level, range, priority }: any): void {
    this.infoPanel.removeAll(true);
    const lines = [
      `${towerType.replace('Tower_', '')}  Lv ${level}`,
      `Range: ${range}  Priority: ${priority}`,
    ];
    lines.forEach((txt, i) => {
      this.infoPanel.add(
        this.add.text(0, i * 18, txt, {
          fontSize: '12px',
          color: '#aaddff',
          fontFamily: 'Roboto, sans-serif',
        }),
      );
    });
  }

  private onGameOver({ victory }: any): void {
    this.scene.start(C.SCENE_GAME_OVER, { victory });
  }

  private onGameWin(): void {
    this.scene.start(C.SCENE_GAME_OVER, { victory: true });
  }
}
