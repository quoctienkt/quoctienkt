window.loadMonsterButterfly = () => {
  window.MonsterButterfly = class extends MonsterBase {
    constructor(scene, monsterType, col, row) {
      super(scene, monsterType, col, row);
    }

    prepareSpriteAsset() {
      this.Phaserscene.anims.create({
        key: window.getMonsterAnimationAssetName(
          this.getName(),
          window.getConstants().MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT
        ),
        frames: this.Phaserscene.anims.generateFrameNumbers(this.getName(), {
          start: 0,
          end: 19,
        }),
        frameRate: 20,
        repeat: -1,
      });

      this.setDisplaySize(40, 40);
      this.anims.play(
        window.getMonsterAnimationAssetName(this.getName(), this.direction)
      );
      this.setCircle(15, 30, 28);
      this.maxHealth = 30 + this._gameStateService.savedData.wave * 100;
      this.health = 30 + this._gameStateService.savedData.wave * 100;
      this.speed = 75;
    }
  };
};
