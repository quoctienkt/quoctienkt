window.setupSquare = (gameStateService) => {
  window.Square = class extends Phaser.Physics.Arcade.Sprite {
    //Type : range, melee, sample
    //name: power arrow frozen thunder

    _gameStateService;
    constructor(scene, x, y, isInit = true) {
      super(scene, x * CELL_SIZE + 20, y * CELL_SIZE + OFFSET_Y, "square");
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.Phaserscene = scene;

      this._gameStateService = gameStateService;
      this.posX = x;
      this.posY = y;
      this.setAlpha(0.1);
      // this.setDepth(2)
      if (isInit) {
        this.init();
      }
    }

    init() {
      //decide buy
      this.setDisplaySize(50, 50);
      this.setInteractive();

      this.on("pointerdown", (pointer) => {
        this.setAlpha(0.1);

        console.log('clicked square');
        // TODO: replace hardcoded 70 with tempTowerPrice
        if (isBuying && this._gameStateService.savedData.gold >= 70) {
          //Check isOkPath
          let success = _gameMapService.tryUpdateMap(this.posX, this.posY, this._gameStateService.BLOCKED)
          if (!success) {
            return;
          }

          let tower = new Tower(
            this.Phaserscene,
            this.x,
            this.y,
            tempTower.getName(),
            1
          );

          this._gameStateService.setGold((gold) => gold - tempTower.getUpgradeCost());

          this.destroy();
          this._gameStateService.savedData.towers.push(tower);
        }
      });

      this.on("pointerover", (pointer) => {
        if (isBuying) {
          this.setAlpha(1);
        }
      });

      this.on("pointerout", (pointer) => {
        if (isBuying) {
          this.setAlpha(0.1);
        }
      });
    }
  };
};
