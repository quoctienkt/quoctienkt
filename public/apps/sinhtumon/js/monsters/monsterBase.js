window.setupMonster = (gameStateService, gameMapService) => {
  window.MonsterFactory = class {
    static createMonster(scene, monsterType, col, row) {
      if (monsterType === window.getConstants().MONSTER_THIEF) {
        return new MonsterThief(scene, monsterType, col, row);
      } else if (monsterType === window.getConstants().MONSTER_BUTTERFLY) {
        return new MonsterButterfly(scene, monsterType, col, row);
      }
    }
  };

  window.MonsterBase = class extends Phaser.Physics.Arcade.Sprite {
    //Type : range, melee, sample
    //name: power arrow frozen thunder
    _gameStateService;
    _gameMapService;

    // TODO: need to change (col, row) to (posX, posY)
    constructor(scene, monsterType, col, row) {
      super(
        scene,
        col * gameMapService.mapConfig.CELL_WIDTH +
          gameMapService.mapConfig.CELL_WIDTH / 2,
        row * gameMapService.mapConfig.CELL_HEIGHT +
          gameMapService.mapConfig.GAME_BOARD_PADDING_TOP,
        monsterType
      );
      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.Phaserscene = scene;
      this._gameStateService = gameStateService;
      this._gameMapService = gameMapService;

      this.monsterType = monsterType;

      this.speed;
      this.maxHealth;
      this.health;
      this.aimed = [];

      this.lastPosX;
      this.lastPosY;
      this.tween;
      this.follower;
      this.duration;
      this.path;
      this.direction;

      this.setDepth(2);
      this.setInteractive();
      this.on("pointerdown", (pointer) => this.pointerdown());
      this.initDirection();
      this.prepareSpriteAsset();
      this.initMovingPath();
    }

    /**
     * @abstract
     * @void
     */
    prepareSpriteAsset() {
      throw "Abstract method cannot be implemented";
    }

    initDirection() {
      if (this.getMoveType() === window.getConstants().MONSTER_MOVE_TYPE_FLY) {
        this.direction =
          window.getConstants().MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT;
      } else if (
        this.getMoveType() === window.getConstants().MONSTER_MOVE_TYPE_GROUND
      ) {
        this.direction = window.getConstants().MONSTER_MOVE_DIRECTION_TO_BOTTOM;
      }
    }

    initMovingPath() {
      if (this.getMoveType() === window.getConstants().MONSTER_MOVE_TYPE_FLY) {
        this.updateMonsterPath(null);
      } else if (
        this.getMoveType() === window.getConstants().MONSTER_MOVE_TYPE_GROUND
      ) {
        this.updateMonsterPath(
          this._gameMapService.groundMonsterMovingPathDefault
        );
      }
    }

    pointerdown(pointer) {
      // console.log("monster clicked")
      if (detailText) {
        detailText.destroy();
      }
      detailText = this.Phaserscene.add.text(
        150,
        600,
        `Máu: ${this.health}\nTốc độ: ${
          this.speed
        }km/h\nVàng: ${this.getGoldOnDead()}`,
        {
          fontStyle: "bold",
          fontSize: "20px",
          fill: "#ff0000",
          fontFamily: "roboto",
        }
      );
      detailTextClicked = false;
      this.Phaserscene.time.addEvent({
        delay: 100,
        callback: () => (detailTextClicked = true),
        callbackScope: this,
        loop: true,
      });
    }

    updateMonsterPath(newMonsterPath) {
      if (
        this.getMoveType() == window.getConstants().MONSTER_MOVE_TYPE_GROUND
      ) {
        if (this.tween) {
          this.tween.stop();
        }

        this.path = new Phaser.Curves.Path(this.x, this.y);

        // for moving more smoothly
        let flag = true;
        while (flag) {
          if (
            (newMonsterPath[0][1] * this._gameMapService.mapConfig.CELL_WIDTH +
              this._gameMapService.mapConfig.CELL_WIDTH / 2 >
              this.x &&
              this.x >
                newMonsterPath[1][1] *
                  this._gameMapService.mapConfig.CELL_WIDTH +
                  this._gameMapService.mapConfig.CELL_WIDTH / 2) ||
            (newMonsterPath[0][1] * this._gameMapService.mapConfig.CELL_WIDTH +
              this._gameMapService.mapConfig.CELL_WIDTH / 2 <
              this.x &&
              this.x <
                newMonsterPath[1][1] *
                  this._gameMapService.mapConfig.CELL_WIDTH +
                  this._gameMapService.mapConfig.CELL_WIDTH / 2) ||
            (newMonsterPath[0][0] * this._gameMapService.mapConfig.CELL_HEIGHT +
              this._gameMapService.mapConfig.GAME_BOARD_PADDING_TOP >
              this.y &&
              this.y >
                newMonsterPath[1][0] *
                  this._gameMapService.mapConfig.CELL_HEIGHT +
                  this._gameMapService.mapConfig.GAME_BOARD_PADDING_TOP) ||
            (newMonsterPath[0][0] * this._gameMapService.mapConfig.CELL_HEIGHT +
              this._gameMapService.mapConfig.GAME_BOARD_PADDING_TOP <
              this.y &&
              this.y <
                newMonsterPath[1][0] *
                  this._gameMapService.mapConfig.CELL_HEIGHT +
                  this._gameMapService.mapConfig.GAME_BOARD_PADDING_TOP)
          ) {
            newMonsterPath.splice(0, 1);
          }
          else {
            flag = false;
          }
        }

        newMonsterPath.forEach((i) => {
          this.path.lineTo(
            this._gameMapService.mapConfig.CELL_WIDTH * i[1] +
              this._gameMapService.mapConfig.CELL_WIDTH / 2,
            i[0] * this._gameMapService.mapConfig.CELL_HEIGHT +
              this._gameMapService.mapConfig.CELL_HEIGHT / 2 +
              this._gameMapService.mapConfig.GAME_BOARD_PADDING_TOP
          );
        });

        this.duration =
          (Math.sqrt(this.path.getLength() * this.path.getLength()) /
            this.speed) *
          1000;
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

        this.tween = this.Phaserscene.tweens.add({
          targets: this.follower,
          t: 1,
          ease: "start",
          duration: this.duration, // change
          yoyo: false,
          repeat: -2,
          onComplete: monsterReachEndpoint,
          onCompleteParams: [this],
        });
      } else if (
        this.getMoveType() === window.getConstants().MONSTER_MOVE_TYPE_FLY
      ) {
        if (this.tween) {
          //this.tween.stop();
          return;
        }

        this.path = new Phaser.Curves.Path(this.x, this.y);

        [
          this._gameMapService.mapConfig.START_POSITION,
          this._gameMapService.mapConfig.END_POSITION,
        ].forEach((i) => {
          this.path.lineTo(
            this._gameMapService.mapConfig.CELL_WIDTH * i[1] +
              this._gameMapService.mapConfig.CELL_WIDTH / 2,
            i[0] * this._gameMapService.mapConfig.CELL_HEIGHT +
              this._gameMapService.mapConfig.GAME_BOARD_PADDING_TOP
          );
        });

        this.duration =
          (Math.sqrt(this.path.getLength() * this.path.getLength()) /
            this.speed) *
          1000;
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

        this.tween = this.Phaserscene.tweens.add({
          targets: this.follower,
          t: 1,
          ease: "start",
          duration: this.duration, // change
          yoyo: false,
          repeat: -2,
          onComplete: monsterReachEndpoint,
          onCompleteParams: [this],
        });
      }
    }

    dead() {
      this._gameStateService.setGold((prev) => prev + this.getGoldOnDead());
      this.tween.stop();
      let index = this._gameStateService.savedData.monsters.indexOf(this);

      let i = this._gameStateService.savedData.bullets.length - 1;
      while (i >= 0) {
        if (this._gameStateService.savedData.bullets[i].target === this) {
          this._gameStateService.savedData.bullets[i].destroy();
          this._gameStateService.savedData.bullets.splice(i, 1);
        }
        i--;
      }

      this._gameStateService.savedData.monsters.splice(index, 1);

      this.anims.play("dead");
      this.setAlpha(0.5);
      this.setDisplaySize(30, 40);

      // delay destroy for dead animation
      setTimeout(() => {
        this.destroy();
      }, 2000);
    }

    setPosWithHealth(posX, posY) {
      this.lastPosX = this.x;
      this.lastPosY = this.y;
      this.setPosition(posX, posY);
      if (
        this.getMoveType() == window.getConstants().MONSTER_MOVE_TYPE_GROUND
      ) {
        if (
          this.lastPosX > this.x &&
          this.direction != window.getConstants().MONSTER_MOVE_DIRECTION_TO_LEFT
        ) {
          this.direction = window.getConstants().MONSTER_MOVE_DIRECTION_TO_LEFT;
          this.anims.play(
            window.getMonsterAnimationAssetName(this.getName(), this.direction)
          );
        } else if (
          this.lastPosX < this.x &&
          this.direction !=
            window.getConstants().MONSTER_MOVE_DIRECTION_TO_RIGHT
        ) {
          this.direction =
            window.getConstants().MONSTER_MOVE_DIRECTION_TO_RIGHT;
          this.anims.play(
            window.getMonsterAnimationAssetName(this.getName(), this.direction)
          );
        } else if (
          this.lastPosY > this.y &&
          this.direction != window.getConstants().MONSTER_MOVE_DIRECTION_TO_TOP
        ) {
          this.direction = window.getConstants().MONSTER_MOVE_DIRECTION_TO_TOP;
          this.anims.play(
            window.getMonsterAnimationAssetName(this.getName(), this.direction)
          );
        } else if (
          this.lastPosY < this.y &&
          this.direction !=
            window.getConstants().MONSTER_MOVE_DIRECTION_TO_BOTTOM
        ) {
          this.direction =
            window.getConstants().MONSTER_MOVE_DIRECTION_TO_BOTTOM;
          this.anims.play(
            window.getMonsterAnimationAssetName(this.getName(), this.direction)
          );
        }
      } else if (
        this.getMoveType() === window.getConstants().MONSTER_MOVE_TYPE_FLY
      ) {
        // butterfly
      }

      // health draw
      graphics.lineStyle(2, 0xff00, 0.5);
      graphics.strokeRoundedRect(
        this.x - this._gameMapService.mapConfig.CELL_WIDTH / 2.5,
        this.y + 22,
        this._gameMapService.mapConfig.CELL_WIDTH,
        3,
        0
      );
      graphics.fillStyle(0x00ff00, 1, 0.5);
      graphics.fillRect(
        this.x - this._gameMapService.mapConfig.CELL_WIDTH / 2.5,
        this.y + 22,
        (this._gameMapService.mapConfig.CELL_WIDTH * this.health) /
          this.maxHealth,
        3
      );
      //end health draw
    }

    getGoldOnDead() {
      return window.getMonsterGoldOnDead(this.getName());
    }

    getName() {
      return this.monsterType;
    }

    // fly or ground
    getMoveType() {
      return window.gameCoreConfig.monsters[this.getName()].moveType;
    }
  };

  window.loadMonsterThief();
  window.loadMonsterButterfly();
};
