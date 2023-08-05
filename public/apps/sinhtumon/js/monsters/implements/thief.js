window.loadMonsterThief = () => {
  window.MonsterThief = class extends MonsterBase {
    constructor(scene, monsterType, col, row) {
      super(scene, monsterType, col, row);
    }

    prepareSpriteAsset() {
      this.Phaserscene.anims.create({
        key: window.getMonsterAnimationAssetName(
          this.getName(),
          window.getConstants().MONSTER_MOVE_DIRECTION_TO_RIGHT
        ),
        frames: this.Phaserscene.anims.generateFrameNumbers(
          window.getConstants().MONSTER_THIEF,
          {
            start: 0,
            end: 5,
          }
        ),
        frameRate: 10,
        repeat: -1,
      });

      this.Phaserscene.anims.create({
        key: window.getMonsterAnimationAssetName(
          this.getName(),
          window.getConstants().MONSTER_MOVE_DIRECTION_TO_BOTTOM
        ),
        frames: this.Phaserscene.anims.generateFrameNumbers(
          window.getConstants().MONSTER_THIEF,
          {
            start: 0,
            end: 5,
          }
        ),
        frameRate: 10,
        repeat: -1,
      });

      this.Phaserscene.anims.create({
        key: window.getMonsterAnimationAssetName(
          this.getName(),
          window.getConstants().MONSTER_MOVE_DIRECTION_TO_LEFT
        ),
        frames: this.Phaserscene.anims.generateFrameNumbers(
          window.getConstants().MONSTER_THIEF,
          {
            start: 6,
            end: 11,
          }
        ),
        frameRate: 10,
        repeat: -1,
      });

      this.Phaserscene.anims.create({
        key: window.getMonsterAnimationAssetName(
          this.getName(),
          window.getConstants().MONSTER_MOVE_DIRECTION_TO_TOP
        ),
        frames: this.Phaserscene.anims.generateFrameNumbers(this.getName(), {
          start: 6,
          end: 11,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.play(
        window.getMonsterAnimationAssetName(this.getName(), this.direction),
        true
      );

      this.setCircle(10, 3, 15);
      this.maxHealth = 30 + this._gameStateService.savedData.wave * 100;
      this.health = 30 + this._gameStateService.savedData.wave * 100;
      this.speed = 75;
    }
  };
};
