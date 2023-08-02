window.setupMonster = () => {
  window.Monster = class extends Phaser.Physics.Arcade.Sprite {
    //Type : range, melee, sample
    //name: power arrow frozen thunder
    constructor(scene, x, y, monsterType) {
      super(
        scene,
        x * CELL_SIZE + CELL_SIZE / 2,
        y * CELL_SIZE + OFFSET_Y,
        monsterType
      );
      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.Phaserscene = scene;
      this.setDepth(2);

      this.monsterType = monsterType;

      this.getMoveType();
      this.speed;
      this.maxHealth;
      this.health;
      this.aimed = [];
      this.init();

      this.lastPosX;
      this.lastPosY;
      this.tween;
      this.follower;
      this.duration;
      this.path;

      this.direction;
    }

    init() {
      this.direction = window.getConstants().MONSTER_MOVE_DIRECTION_TO_BOTTOM;
      this.setInteractive();
      this.on("pointerdown", (pointer) => this.pointerdown());

      if (this.getName() == window.getConstants().MONSTER_THIEF) {
        // register animation for sprite
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

        this.anims.play(
          window.getMonsterAnimationAssetName(this.getName(), this.direction),
          true
        );

        this.setCircle(10, 3, 15);
        this.maxHealth = 30 + wave * 100;
        this.health = 30 + wave * 100;
        this.speed = 75;
      } else if (this.getName() == window.getConstants().MONSTER_BUTTERFLY) {
        this.Phaserscene.anims.create({
          key: window.getMonsterAnimationAssetName(
            window.getConstants().MONSTER_BUTTERFLY,
            window.getConstants().MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT
          ),
          frames: this.Phaserscene.anims.generateFrameNumbers(
            window.getConstants().MONSTER_BUTTERFLY,
            {
              start: 0,
              end: 19,
            }
          ),
          frameRate: 20,
          repeat: -1,
        });

        this.setDisplaySize(40, 40);
        this.anims.play(
          window.getMonsterAnimationAssetName(
            window.getConstants().MONSTER_BUTTERFLY,
            window.getConstants().MONSTER_MOVE_DIRECTION_TO_BOTTOM_RIGHT
          )
        );
        this.setCircle(15, 30, 28);
        this.maxHealth = 30 + wave * 100;
        this.health = 30 + wave * 100;
        this.speed = 75;
      }

      if (this.getMoveType() === window.getConstants().MONSTER_MOVE_TYPE_FLY) {
        this.createPath(null);
      } else if (
        this.getMoveType() === window.getConstants().MONSTER_MOVE_TYPE_GROUND
      ) {
        this.createPath(mazePuzzle);
      }
    }

    pointerdown(pointer) {
      // console.log("monster clicked")
      if (detailText) {
        detailText.destroy();
      }
      detailText = this.Phaserscene.add.text(
        150,
        630,
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

    createPath(solved) {
      //solved is mazePuzzle
      if (
        this.getMoveType() == window.getConstants().MONSTER_MOVE_TYPE_GROUND
      ) {
        if (this.tween) {
          this.tween.stop();
        }

        this.path = new Phaser.Curves.Path(this.x, this.y);
        solved.forEach((i) => {
          this.path.lineTo(
            CELL_SIZE * i[1] + CELL_SIZE / 2,
            i[0] * CELL_SIZE + OFFSET_Y
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

        [START_POS, END_POS].forEach((i) => {
          this.path.lineTo(
            CELL_SIZE * i[1] + CELL_SIZE / 2,
            i[0] * CELL_SIZE + OFFSET_Y
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
      gold += this.getGoldOnDead();
      goldText.setText(`${gold}`);
      this.tween.stop();
      let index = monsters.indexOf(this);

      let i = bullets.length - 1;
      while (i >= 0) {
        if (bullets[i].target === this) {
          bullets[i].destroy();
          bullets.splice(i, 1);
        }
        i--;
      }

      monsters.splice(index, 1);

      this.anims.play("dead");
      this.setAlpha(0.5);
      this.setDisplaySize(30, 40);
      // this.destroy();
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
        this.x - CELL_SIZE / 2.5,
        this.y + 22,
        CELL_SIZE,
        3,
        0
      );
      graphics.fillStyle(0x00ff00, 1, 0.5);
      graphics.fillRect(
        this.x - CELL_SIZE / 2.5,
        this.y + 22,
        (CELL_SIZE * this.health) / this.maxHealth,
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
};
