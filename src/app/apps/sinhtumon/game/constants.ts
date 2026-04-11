// ─── Monster Types ────────────────────────────────────────────────────────────
export const MONSTER_GRUNT = 'Monster_Grunt';
export const MONSTER_ORC = 'Monster_Orc';
export const MONSTER_TROLL = 'Monster_Troll';
export const MONSTER_MUMMY = 'Monster_Mummy';
export const MONSTER_SPIDER = 'Monster_Spider';
export const MONSTER_HARPY = 'Monster_Harpy';
export const MONSTER_BAT = 'Monster_Bat';
export const MONSTER_DRAGON = 'Monster_Dragon';
export const BOSS_GOLEM = 'Boss_Golem';
export const BOSS_DEMON = 'Boss_Demon';

// ─── Tower Types ──────────────────────────────────────────────────────────────
export const TOWER_FROST = 'Tower_Frost';
export const TOWER_ARCHER = 'Tower_Archer';
export const TOWER_CANNON = 'Tower_Cannon';
export const TOWER_LIGHTNING = 'Tower_Lightning';
export const TOWER_POISON = 'Tower_Poison';

// ─── Hero Types ───────────────────────────────────────────────────────────────
export const HERO_KNIGHT = 'Hero_Knight';
export const HERO_MAGE = 'Hero_Mage';
export const HERO_ARCHER = 'Hero_Archer';

// ─── Skill Types ──────────────────────────────────────────────────────────────
export const SKILL_RAIN_OF_FIRE = 'Skill_RainOfFire';
export const SKILL_FORTIFY = 'Skill_Fortify';
export const SKILL_HERO_RALLY = 'Skill_HeroRally';

// ─── Move Types ───────────────────────────────────────────────────────────────
export const MONSTER_MOVE_TYPE_GROUND = 'Monster_Ground';
export const MONSTER_MOVE_TYPE_FLY = 'Monster_Fly';

// ─── Directions ───────────────────────────────────────────────────────────────
export const MONSTER_MOVE_DIRECTION_TO_TOP = 'TO_TOP';
export const MONSTER_MOVE_DIRECTION_TO_RIGHT = 'TO_RIGHT';
export const MONSTER_MOVE_DIRECTION_TO_BOTTOM = 'TO_BOTTOM';
export const MONSTER_MOVE_DIRECTION_TO_LEFT = 'TO_LEFT';
export const MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT = 'TO_BOTTOM_RIGHT';

// ─── Damage Types ─────────────────────────────────────────────────────────────
export const DAMAGE_PHYSICAL = 'physical';
export const DAMAGE_MAGIC = 'magic';
export const DAMAGE_FIRE = 'fire';
export const DAMAGE_ICE = 'ice';
export const DAMAGE_LIGHTNING = 'lightning';
export const DAMAGE_POISON = 'poison';

// ─── Status Effects ───────────────────────────────────────────────────────────
export const STATUS_SLOW = 'slow';
export const STATUS_FREEZE = 'freeze';
export const STATUS_POISON_DOT = 'poison_dot';
export const STATUS_STUN = 'stun';
export const STATUS_WEB = 'web';

// ─── Target Priorities ────────────────────────────────────────────────────────
export const TARGET_FIRST = 'first';
export const TARGET_LAST = 'last';
export const TARGET_STRONGEST = 'strongest';
export const TARGET_NEAREST = 'nearest';

// ─── Scene Keys ───────────────────────────────────────────────────────────────
export const SCENE_BOOT = 'BootScene';
export const SCENE_MENU = 'MenuScene';
export const SCENE_MAP_SELECT = 'MapSelectScene';
export const SCENE_GAME = 'GameScene';
export const SCENE_HUD = 'HUDScene';
export const SCENE_GAME_OVER = 'GameOverScene';

// ─── Map Keys ─────────────────────────────────────────────────────────────────
export const MAP_CROSSROADS = 'MAP_CROSSROADS';
export const MAP_VOLCANO = 'MAP_VOLCANO';
export const MAP_ICE_VALLEY = 'MAP_ICE_VALLEY';
export const MAP_CURSED_FOREST = 'MAP_CURSED_FOREST';

// ─── EventBus Event Names ─────────────────────────────────────────────────────
export const EVT_MONSTER_DEAD = 'monster:dead';
export const EVT_MONSTER_REACHED_END = 'monster:end';
export const EVT_MONSTER_SELECTED = 'monster:selected';
export const EVT_WAVE_START = 'wave:start';
export const EVT_WAVE_COMPLETE = 'wave:complete';
export const EVT_ALL_WAVES_DONE = 'wave:allDone';
export const EVT_GOLD_CHANGED = 'gold:changed';
export const EVT_LIFE_CHANGED = 'life:changed';
export const EVT_SCORE_CHANGED = 'score:changed';
export const EVT_SKILL_CAST = 'skill:cast';
export const EVT_SKILL_AREA_SELECTED = 'skill:areaSelected';
export const EVT_TOWER_SELECTED = 'tower:selected';
export const EVT_TOWER_DESELECTED = 'tower:deselected';
export const EVT_HERO_DEAD = 'hero:dead';
export const EVT_HERO_RESPAWNED = 'hero:respawned';
export const EVT_HERO_SELECTED = 'hero:selected';
export const EVT_GAME_OVER = 'game:over';
export const EVT_GAME_WIN = 'game:win';
