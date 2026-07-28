import * as C from '../constants';
import type { HeroConfig, SkillConfig } from '../types';

export const heroesConfig: Record<string, HeroConfig> = {
  [C.HERO_KNIGHT]: {
    heroType: C.HERO_KNIGHT,
    displayName: 'Sir Roland',
    maxHp: 600,
    attackDamage: 80,
    attackRange: 55,
    attackReload: 800,
    moveSpeed: 120,
    spriteKey: C.HERO_KNIGHT,
    assetPath: '/heroes/hero_knight.png',
    frameWidth: 48,
    frameHeight: 64,
    respawnDelay: 30000,
    skills: [
      { skillId: 'knight_bash', displayName: 'Shield Bash', cooldown: 12000 },
      { skillId: 'knight_rally', displayName: 'War Cry', cooldown: 25000 },
    ],
  },

  [C.HERO_MAGE]: {
    heroType: C.HERO_MAGE,
    displayName: 'Alleria',
    maxHp: 300,
    attackDamage: 150,
    attackRange: 120,
    attackReload: 1500,
    moveSpeed: 95,
    spriteKey: C.HERO_MAGE,
    assetPath: '/heroes/hero_mage.png',
    frameWidth: 48,
    frameHeight: 64,
    respawnDelay: 35000,
    skills: [
      { skillId: 'mage_meteor', displayName: 'Meteor', cooldown: 20000 },
      { skillId: 'mage_blizzard', displayName: 'Blizzard', cooldown: 30000 },
    ],
  },

  [C.HERO_ARCHER]: {
    heroType: C.HERO_ARCHER,
    displayName: 'Vanessa',
    maxHp: 400,
    attackDamage: 100,
    attackRange: 180,
    attackReload: 600,
    moveSpeed: 140,
    spriteKey: C.HERO_ARCHER,
    assetPath: '/heroes/hero_archer.png',
    frameWidth: 48,
    frameHeight: 64,
    respawnDelay: 28000,
    skills: [
      { skillId: 'archer_barrage', displayName: 'Barrage', cooldown: 15000 },
      {
        skillId: 'archer_multishot',
        displayName: 'Multishot',
        cooldown: 22000,
      },
    ],
  },
};

export const skillsConfig: Record<string, SkillConfig> = {
  [C.SKILL_RAIN_OF_FIRE]: {
    skillId: C.SKILL_RAIN_OF_FIRE,
    displayName: 'Rain of Fire',
    description: 'Call down fire on a target area for 3 seconds',
    cooldown: 45000,
    iconKey: 'skill_rain_of_fire',
  },
  [C.SKILL_FORTIFY]: {
    skillId: C.SKILL_FORTIFY,
    displayName: 'Fortify',
    description: "Boost a tower's attack speed by 50% for 10 seconds",
    cooldown: 60000,
    iconKey: 'skill_fortify',
  },
  [C.SKILL_HERO_RALLY]: {
    skillId: C.SKILL_HERO_RALLY,
    displayName: 'Rally',
    description: 'Send your hero sprinting to a location',
    cooldown: 15000,
    iconKey: 'skill_hero_rally',
  },
};
