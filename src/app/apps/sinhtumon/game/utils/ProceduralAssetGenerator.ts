import * as Phaser from 'phaser';
import * as C from '../constants';
import { towersConfig } from '../config/towers.config';
import { monstersConfig } from '../config/monsters.config';
import { heroesConfig } from '../config/heroes.config';

/**
 * Procedurally generates all required game assets using HTML5 Canvas.
 * This resolves all 404 errors and guarantees perfect sprite sizes and click hitboxes.
 */
export function generateAllProceduralAssets(scene: Phaser.Scene): void {
  const textures = scene.textures;

  // ─── 1. Core Backgrounds & UI ──────────────────────────────────────────────
  
  // Tactical Defense Grid Background (520x520)
  if (!textures.exists('background1')) {
    const canvas = textures.createCanvas('background1', 520, 520)!;
    const ctx = canvas.context;
    ctx.fillStyle = '#090d1a';
    ctx.fillRect(0, 0, 520, 520);
    
    // Draw subtle grid lines
    ctx.strokeStyle = '#141c30';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 520; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 520); ctx.stroke();
    }
    for (let y = 0; y <= 520; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(520, y); ctx.stroke();
    }
    
    // Add decorative corner marks
    ctx.strokeStyle = '#2d3d5a';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, 512, 512);
    canvas.refresh();
  }

  // Duplicate for volcano, ice, and forest theme fallbacks
  const themes = ['background_volcano', 'background_ice', 'background_forest', 'menu_bg'];
  themes.forEach(t => {
    if (!textures.exists(t)) {
      const canvas = textures.createCanvas(t, 520, 520)!;
      const ctx = canvas.context;
      const gradient = ctx.createLinearGradient(0, 0, 520, 520);
      if (t === 'background_volcano') {
        gradient.addColorStop(0, '#1c0a0a');
        gradient.addColorStop(1, '#0c0505');
      } else if (t === 'background_ice') {
        gradient.addColorStop(0, '#0a1624');
        gradient.addColorStop(1, '#050a12');
      } else { // forest / menu_bg
        gradient.addColorStop(0, '#06100f');
        gradient.addColorStop(1, '#030808');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 520, 520);
      
      // Hex grid effect
      ctx.strokeStyle = 'rgba(255,255,255,0.015)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= 520; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 520); ctx.stroke();
      }
      canvas.refresh();
    }
  });

  // Upgrade Icon (Green arrow)
  if (!textures.exists('upgrade')) {
    const canvas = textures.createCanvas('upgrade', 32, 32)!;
    const ctx = canvas.context;
    ctx.fillStyle = '#00ff88';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#00ff88';
    ctx.beginPath();
    ctx.moveTo(16, 4);
    ctx.lineTo(28, 16);
    ctx.lineTo(20, 16);
    ctx.lineTo(20, 28);
    ctx.lineTo(12, 28);
    ctx.lineTo(12, 16);
    ctx.lineTo(4, 16);
    ctx.closePath();
    ctx.fill();
    canvas.refresh();
  }

  // Sell Icon (Rotating coin sheet — 6 frames of 32x32)
  if (!textures.exists('sell')) {
    const canvas = textures.createCanvas('sell', 192, 32)!;
    const ctx = canvas.context;
    for (let f = 0; f < 6; f++) {
      const cx = f * 32 + 16;
      const cy = 16;
      const scaleX = Math.abs(Math.cos((f * Math.PI) / 3)); // rotating effect
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scaleX, 1);
      
      // Coin base
      ctx.fillStyle = '#ffd700';
      ctx.strokeStyle = '#b8860b';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      
      // Coin detail
      ctx.fillStyle = '#b8860b';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 0, 0.5);
      
      ctx.restore();
    }
    canvas.refresh();
    textures.get('sell').add('__BASE', 0, 0, 0, 192, 32);
    for (let f = 0; f < 6; f++) {
      textures.get('sell').add(f, 0, f * 32, 0, 32, 32);
    }
  }

  // Tower Range Indicator Ring
  if (!textures.exists('tower_range')) {
    const canvas = textures.createCanvas('tower_range', 128, 128)!;
    const ctx = canvas.context;
    ctx.strokeStyle = '#4af7a0';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.arc(64, 64, 60, 0, Math.PI * 2); ctx.stroke();
    canvas.refresh();
  }

  // Death Explosion (8 frames of 64x64)
  if (!textures.exists('onDead')) {
    const canvas = textures.createCanvas('onDead', 512, 64)!;
    const ctx = canvas.context;
    for (let f = 0; f < 8; f++) {
      const cx = f * 64 + 32;
      const cy = 32;
      const radius = (f + 1) * 3.5;
      const alpha = 1 - f / 8;
      
      ctx.fillStyle = `rgba(255, 120, 0, ${alpha})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ff6600';
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fill();
      
      // inner core
      ctx.fillStyle = `rgba(255, 230, 150, ${alpha})`;
      ctx.beginPath(); ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2); ctx.fill();
    }
    canvas.refresh();
    textures.get('onDead').add('__BASE', 0, 0, 0, 512, 64);
    for (let f = 0; f < 8; f++) {
      textures.get('onDead').add(f, 0, f * 64, 0, 64, 64);
    }
  }

  // Skills
  const skills = [
    { key: 'skill_rain_of_fire', color: '#ff4400', sym: '🔥' },
    { key: 'skill_fortify', color: '#4af7a0', sym: '🛡' },
    { key: 'skill_hero_rally', color: '#88ddff', sym: '🏃' }
  ];
  skills.forEach(s => {
    if (!textures.exists(s.key)) {
      const canvas = textures.createCanvas(s.key, 36, 36)!;
      const ctx = canvas.context;
      
      // Radial glow
      const grad = ctx.createRadialGradient(18, 18, 2, 18, 18, 18);
      grad.addColorStop(0, s.color);
      grad.addColorStop(1, '#0a1424');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 36, 36);
      
      // Symbol
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.sym, 18, 18);
      canvas.refresh();
    }
  });

  // ─── 2. Tower Assets ───────────────────────────────────────────────────────
  
  const drawTowerGraphics = (ctx: CanvasRenderingContext2D, type: string, lvl: number) => {
    // Canvas size is 64x64
    ctx.save();
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath(); ctx.ellipse(32, 54, 18, 6, 0, 0, Math.PI * 2); ctx.fill();
    
    // Tower base pedestal (metallic ring)
    ctx.fillStyle = '#2c3540';
    ctx.strokeStyle = '#4e5b6e';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(32, 48, 16, 0, Math.PI, false); ctx.fill(); ctx.stroke();
    
    // Draw specific tower top/pillar based on type
    if (type === C.TOWER_FROST) {
      // Frost Spires (Glow Crystal)
      const crystalHeight = 16 + lvl * 4;
      const crystalColor = lvl >= 4 ? '#88eeff' : '#00aaff';
      ctx.fillStyle = '#1c2e3d';
      ctx.fillRect(26, 26, 12, 22); // stone stand
      
      ctx.fillStyle = crystalColor;
      ctx.shadowBlur = 8 + lvl * 2;
      ctx.shadowColor = crystalColor;
      ctx.beginPath();
      ctx.moveTo(32, 26 - crystalHeight); // apex
      ctx.lineTo(24, 26);
      ctx.lineTo(32, 32);
      ctx.lineTo(40, 26);
      ctx.closePath();
      ctx.fill();
    } 
    else if (type === C.TOWER_ARCHER) {
      // Archer watchtower
      ctx.fillStyle = '#5c4033'; // wood pillar
      ctx.fillRect(29, 24, 6, 24);
      
      ctx.fillStyle = '#3d2b1f'; // platform
      ctx.fillRect(20, 20, 24, 5);
      
      // Golden ballista/bow
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(32, 14, 8, Math.PI, 0);
      ctx.stroke();
    }
    else if (type === C.TOWER_CANNON) {
      // Heavy iron cannon turret
      ctx.fillStyle = '#111111'; // armored block
      ctx.fillRect(22, 28, 20, 20);
      
      ctx.fillStyle = '#444444'; // barrel
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 2;
      ctx.fillRect(28, 10, 8, 20);
      ctx.strokeRect(28, 10, 8, 20);
    }
    else if (type === C.TOWER_LIGHTNING) {
      // Tesla Coil
      ctx.fillStyle = '#333333'; // base
      ctx.fillRect(28, 24, 8, 24);
      
      // Copper Rings
      ctx.fillStyle = '#d2691e';
      ctx.fillRect(24, 28, 16, 3);
      ctx.fillRect(26, 36, 12, 3);
      
      // Floating Energy Node
      const nodeColor = lvl >= 4 ? '#ffffff' : '#ffff00';
      ctx.fillStyle = nodeColor;
      ctx.shadowBlur = 10 + lvl * 2;
      ctx.shadowColor = '#ffff00';
      ctx.beginPath(); ctx.arc(32, 16, 6 + lvl * 0.5, 0, Math.PI * 2); ctx.fill();
    }
    else if (type === C.TOWER_POISON) {
      // Acidic Vat / Vial
      ctx.fillStyle = '#444444'; // rack
      ctx.fillRect(22, 32, 20, 16);
      
      // Glass Beaker
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.fillStyle = '#00ff00'; // bubbling slime
      ctx.beginPath();
      ctx.arc(32, 30, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Cork
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(29, 17, 6, 4);
    }
    
    ctx.restore();
  };

  const drawAmmoGraphics = (ctx: CanvasRenderingContext2D, type: string, lvl: number) => {
    // Canvas size is 16x16
    ctx.save();
    if (type === C.TOWER_FROST) {
      ctx.fillStyle = '#88ddff';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#88ddff';
      ctx.beginPath();
      ctx.moveTo(8, 0); ctx.lineTo(14, 8); ctx.lineTo(8, 16); ctx.lineTo(2, 8);
      ctx.closePath(); ctx.fill();
    }
    else if (type === C.TOWER_ARCHER) {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(8, 2); ctx.lineTo(8, 14); ctx.stroke();
      ctx.fillStyle = '#ff3333';
      ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(11, 4); ctx.lineTo(5, 4); ctx.closePath(); ctx.fill();
    }
    else if (type === C.TOWER_CANNON) {
      ctx.fillStyle = '#222222';
      ctx.strokeStyle = '#444444';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(8, 8, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    else if (type === C.TOWER_LIGHTNING) {
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ffff00';
      ctx.beginPath();
      ctx.moveTo(8, 0); ctx.lineTo(13, 6); ctx.lineTo(5, 9); ctx.lineTo(10, 16);
      ctx.stroke();
    }
    else if (type === C.TOWER_POISON) {
      ctx.fillStyle = '#39ff14';
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#39ff14';
      ctx.beginPath(); ctx.arc(8, 8, 4.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  };

  // Generate for all towers (level 1 to 5)
  for (const [type, cfg] of Object.entries(towersConfig)) {
    for (let lvl = 1; lvl <= cfg.maxLevel; lvl++) {
      const key = `${type}_level_${lvl}`;
      if (!textures.exists(key)) {
        const canvas = textures.createCanvas(key, 64, 64)!;
        drawTowerGraphics(canvas.context, type, lvl);
        canvas.refresh();
      }
      
      const ammoKey = `${type}_level_${lvl}_ammo`;
      if (!textures.exists(ammoKey)) {
        const canvas = textures.createCanvas(ammoKey, 16, 16)!;
        drawAmmoGraphics(canvas.context, type, lvl);
        canvas.refresh();
      }
    }
  }

  // ─── 3. Monster Assets (walk and attack animations) ───────────────────────
  
  const drawMonsterFrame = (
    ctx: CanvasRenderingContext2D,
    type: string,
    action: string,
    dir: string,
    frame: number,
    w: number,
    h: number
  ) => {
    ctx.save();
    
    // Compute animated offsets (swaying and bobbing)
    const bob = Math.sin((frame * Math.PI) / 4) * 2;
    const sway = Math.cos((frame * Math.PI) / 4) * 1.5;
    
    const cx = w / 2 + sway;
    const cy = h / 2 + bob;
    
    // Draw base shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath(); ctx.ellipse(w / 2, h - 8, 12, 4, 0, 0, Math.PI * 2); ctx.fill();

    // Map monster styles to colors
    let primary = '#00ff00';
    let secondary = '#00aa00';
    let isBoss = false;
    let sizeScale = 1;

    if (type.includes('Grunt')) {
      primary = '#4a752c'; secondary = '#2a4d13'; sizeScale = 0.85;
    } else if (type.includes('Orc')) {
      primary = '#1c4a16'; secondary = '#0f290b'; sizeScale = 1.05;
    } else if (type.includes('Troll')) {
      primary = '#5c6f80'; secondary = '#303f4d'; sizeScale = 1.2;
    } else if (type.includes('Mummy')) {
      primary = '#e6d8ad'; secondary = '#a8986c'; sizeScale = 0.95;
    } else if (type.includes('Spider')) {
      primary = '#4b0082'; secondary = '#1a0033'; sizeScale = 0.8;
    } else if (type.includes('Larva')) {
      primary = '#ff4500'; secondary = '#8b0000'; sizeScale = 0.85;
    } else if (type.includes('Skeleton')) {
      primary = '#f5f5dc'; secondary = '#c0c0c0'; sizeScale = 0.9;
    } else if (type.includes('IceElemental')) {
      primary = '#88ddff'; secondary = '#00aaff'; sizeScale = 1.1;
    } else if (type.includes('Wolf')) {
      primary = '#808080'; secondary = '#404040'; sizeScale = 0.95;
    } else if (type.includes('Harpy')) {
      primary = '#ff69b4'; secondary = '#c71585'; sizeScale = 0.9;
    } else if (type.includes('Bat')) {
      primary = '#363636'; secondary = '#1c1c1c'; sizeScale = 0.75;
    } else if (type.includes('Dragon')) {
      primary = '#ff0000'; secondary = '#8b0000'; sizeScale = 1.25;
    } else if (type.includes('Vulture')) {
      primary = '#8b7355'; secondary = '#554433'; sizeScale = 0.85;
    } else if (type.includes('Golem')) {
      primary = '#2f4f4f'; secondary = '#121e1e'; isBoss = true; sizeScale = 1.5;
    } else if (type.includes('Demon')) {
      primary = '#a30000'; secondary = '#5e0000'; isBoss = true; sizeScale = 1.6;
    } else if (type.includes('Beholder')) {
      primary = '#bf30a3'; secondary = '#6b0f59'; isBoss = true; sizeScale = 1.55;
    }

    const r = (w / 4) * sizeScale;

    // Draw unique creature geometry
    if (type.includes('Spider')) {
      // Spider body & legs
      ctx.fillStyle = primary;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      
      // Draw 6 spidery legs
      ctx.strokeStyle = secondary;
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 + (frame * 0.1);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * (r + 10), cy + Math.sin(angle) * (r + 10));
        ctx.stroke();
      }
    } 
    else if (type.includes('Bat') || type.includes('Dragon') || type.includes('Harpy') || type.includes('Demon')) {
      // Flying winged creatures
      ctx.fillStyle = primary;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      
      // Wing flaps
      ctx.fillStyle = secondary;
      const wingW = r * 1.5;
      const wingH = Math.sin((frame * Math.PI) / 3) * r;
      ctx.beginPath();
      // left wing
      ctx.ellipse(cx - r, cy - 2, wingW, Math.abs(wingH), -Math.PI/6, 0, Math.PI * 2);
      // right wing
      ctx.ellipse(cx + r, cy - 2, wingW, Math.abs(wingH), Math.PI/6, 0, Math.PI * 2);
      ctx.fill();
    } 
    else if (type.includes('Larva')) {
      // Worm segment stack
      ctx.fillStyle = primary;
      for (let segment = 0; segment < 3; segment++) {
        const segX = cx - segment * 4 + 4;
        const segY = cy + segment * 3 - 3;
        ctx.beginPath();
        ctx.arc(segX, segY, r - segment * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } 
    else {
      // Humanoids (Orc, Grunt, Troll, Golem, Mummy, Skeleton, IceElemental, Wolf)
      // Head
      ctx.fillStyle = secondary;
      ctx.beginPath(); ctx.arc(cx, cy - r * 0.8, r * 0.6, 0, Math.PI * 2); ctx.fill();
      
      // Body torso
      ctx.fillStyle = primary;
      ctx.beginPath(); ctx.arc(cx, cy + r * 0.2, r, 0, Math.PI * 2); ctx.fill();
      
      // Shield or Weapon if attacking
      if (action === C.MONSTER_ACTION_ATTACK) {
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.arc(cx + r, cy, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Glowing boss core / evil eyes
    if (isBoss) {
      ctx.fillStyle = '#ffff00';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ffff00';
      ctx.beginPath(); ctx.arc(cx - 3, cy - r * 0.8, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 3, cy - r * 0.8, 2, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = '#ff0000'; // red eyes
      ctx.beginPath(); ctx.arc(cx - 2, cy - r * 0.8, 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 2, cy - r * 0.8, 1.5, 0, Math.PI * 2); ctx.fill();
    }
    
    ctx.restore();
  };

  // Generate for all monsters walk and attack directions
  for (const [mt, mcfg] of Object.entries(monstersConfig)) {
    for (const act of mcfg.actions) {
      const animKey = act.direction 
        ? `${mcfg.spriteBaseKey}_${act.action}_${act.direction}`
        : `${mcfg.spriteBaseKey}_${act.action}`;

      if (!textures.exists(animKey)) {
        const frameCount = act.frameCount ?? 8;
        const w = act.frameWidth;
        const h = act.frameHeight;
        
        // Horizontal strip of frameCount frames
        const canvas = textures.createCanvas(animKey, w * frameCount, h)!;
        for (let f = 0; f < frameCount; f++) {
          const frameCtx = canvas.context;
          frameCtx.save();
          frameCtx.translate(f * w, 0);
          drawMonsterFrame(frameCtx, mt, act.action, act.direction ?? 'TO_BOTTOM_RIGHT', f, w, h);
          frameCtx.restore();
        }
        canvas.refresh();
        
        // Slice the dynamically added canvas texture into frame slots inside Phaser
        textures.get(animKey).add('__BASE', 0, 0, 0, w * frameCount, h);
        for (let f = 0; f < frameCount; f++) {
          textures.get(animKey).add(f, 0, f * w, 0, w, h);
        }
      }
    }
  }

  // ─── 4. Hero Assets ────────────────────────────────────────────────────────
  for (const [ht, hcfg] of Object.entries(heroesConfig)) {
    if (!textures.exists(hcfg.spriteKey)) {
      const w = hcfg.frameWidth;
      const h = hcfg.frameHeight;
      const frameCount = 16; // 16 frames horizontally
      
      const canvas = textures.createCanvas(hcfg.spriteKey, w * frameCount, h)!;
      const ctx = canvas.context;
      
      for (let f = 0; f < frameCount; f++) {
        ctx.save();
        ctx.translate(f * w, 0);
        
        // Sway / bob
        const bob = Math.sin((f * Math.PI) / 2) * 1.5;
        const cx = w / 2;
        const cy = h / 2 + bob;
        
        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath(); ctx.ellipse(w / 2, h - 6, 10, 3, 0, 0, Math.PI * 2); ctx.fill();
        
        // Body base colors based on hero type
        let bodyColor = '#00ff88';
        let headColor = '#ffe0bd';
        let accessoryColor = '#ffffff';
        
        if (ht === C.HERO_KNIGHT) {
          bodyColor = '#708090'; // iron armor
          accessoryColor = '#ff0000'; // red plume / shield
        } else if (ht === C.HERO_MAGE) {
          bodyColor = '#4b0082'; // purple robe
          accessoryColor = '#00ffff'; // glowing staff
        } else if (ht === C.HERO_ARCHER) {
          bodyColor = '#228b22'; // forest green cloak
          accessoryColor = '#ffd700'; // golden bow
        }
        
        // Head
        ctx.fillStyle = headColor;
        ctx.beginPath(); ctx.arc(cx, cy - 14, 8, 0, Math.PI * 2); ctx.fill();
        
        // Torso/Body
        ctx.fillStyle = bodyColor;
        ctx.beginPath(); ctx.arc(cx, cy + 4, 12, 0, Math.PI * 2); ctx.fill();
        
        // Accessory / Weapon
        ctx.fillStyle = accessoryColor;
        if (ht === C.HERO_KNIGHT) {
          // Shield & Sword
          ctx.fillRect(cx - 14, cy - 4, 4, 12); // shield
          ctx.fillRect(cx + 8, cy - 14, 3, 16); // sword
        } else if (ht === C.HERO_MAGE) {
          // Mage staff
          ctx.fillRect(cx + 8, cy - 18, 3, 28);
          ctx.fillStyle = '#00ffff';
          ctx.shadowBlur = 6; ctx.shadowColor = '#00ffff';
          ctx.beginPath(); ctx.arc(cx + 9.5, cy - 20, 4, 0, Math.PI * 2); ctx.fill();
        } else if (ht === C.HERO_ARCHER) {
          // Archer bow
          ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(cx - 8, cy, 10, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        }
        
        ctx.restore();
      }
      canvas.refresh();
      
      // Slice into frames
      textures.get(hcfg.spriteKey).add('__BASE', 0, 0, 0, w * frameCount, h);
      for (let f = 0; f < frameCount; f++) {
        textures.get(hcfg.spriteKey).add(f, 0, f * w, 0, w, h);
      }
    }
  }

  console.log('[ProceduralAssetGenerator] ✅ All assets generated programmatically!');
}
