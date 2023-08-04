window.setupBullet = (gameStateService, gameMapService) => {
  window.Bullet = class extends Phaser.Physics.Arcade.Sprite {
    //Type : range, melee, sample
    //name: power arrow frozen thunder
    _gameStateService;
    _gameMapService;
    constructor(scene, x, y, tower, level) {
      super(scene, x, y, window.getTowerAmmoAssetName(tower.towerType, level));
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.Phaserscene = scene;
      this._gameStateService = gameStateService;
      this._gameMapService = gameMapService;

      this.setDepth(3);
      this.tower = tower;
      this.level = level;
      this.target;

      const ammoData = window.getAmmoData(this.tower.towerType, this.level);
      this.speed = ammoData.attackSpeed;
      this.damage = ammoData.attackDamage;

      if (ammoData.ammoDisplayTint !== null) {
        this.setTint(ammoData.ammoDisplayTint);
      }
      if (ammoData.ammoDisplaySize !== null) {
        this.setDisplaySize(
          ammoData.ammoDisplaySize[0],
          ammoData.ammoDisplaySize[1]
        );
      }
    }

    getName() {
      return this.texture.key;
    }
  };
};
