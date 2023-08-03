window.setupTower = () => {
  window.Tower = class extends Phaser.Physics.Arcade.Sprite {
    constructor(
      scene,
      x,
      y,
      towerType,
      level,
      bindEvents = true,
      isSampleTower = false
    ) {
      super(scene, x, y, window.getTowerAssetName(towerType, level));

      this.towerType = towerType;
      this.level = level;
      this.isSampleTower = isSampleTower;

      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.Phaserscene = scene;

      this.setDepth(3);
      this.setInteractive();
      const [towerWidth, towerHeight] = window.getTowerDisplaySize(
        this.getName(),
        this.level
      );
      this.setDisplaySize(towerWidth, towerHeight);

      this.isReady = true;
      this.upgradeCost = window.getTowerUpgradeCost(
        this.getName(),
        this.isSampleTower ? 1 : this.level + 1
      );
      this.posX = (this.x - CELL_SIZE / 2) / CELL_SIZE;
      this.posY = (this.y - OFFSET_Y) / CELL_SIZE;
      this.range =
        window.getTowerAttackRange(this.getName(), this.level) + CELL_SIZE;

      if (bindEvents) {
        this.bindEvents();
      }
    }

    bindEvents() {
      //buy sample tower
      if (this.isSampleTower) {
        this.on("pointerdown", (pointer) => {
          // console.log('sampleTower clicked');
          //tạo tháp từ con trỏ chuột
          if (savedData.gold >= this.getUpgradeCost()) {
            if (isBuying) {
              tempTower.destroy();
            }

            isBuying = false;
            this.Phaserscene.time.addEvent({
              delay: 100,
              callback: () => {
                isBuying = true;
              },
              callbackScope: this,
              loop: false,
            });

            tempTower = new Tower(
              this.Phaserscene,
              pointer.x,
              pointer.y,
              this.getName(),
              1,
              false,
              true
            );

            tempTower.setDepth(-1);
            tempTower.setAlpha(0.5);
          }
        });
      }

      //upgrade or sell
      else {
        //upgrade clicked
        this.on("pointerdown", (pointer) => {
          this.handleTowerFocus();
        });

        //show info
        // this.on('pointerover', pointer => {
        //     this.pointerover(pointer);
        // });

        this.on("pointermove", (pointer) => {
          this.pointermove(pointer);
        });

        //destroy info
        this.on("pointerout", (pointer) => {
          this.pointerout(pointer);
        });
      }
    }

    handleTowerFocus() {
      console.log("tower clicked");

      if (!isBuying) {
        if (upgradeImage) upgradeImage.destroy();
        if (sellImage) sellImage.destroy();
        if (rangeImage) rangeImage.destroy();

        isTowerClicked = false;
        this.Phaserscene.time.addEvent({
          delay: 0,
          callback: () => {
            isTowerClicked = true;
          },
          callbackScope: this,
          loop: false,
        });

        this.showDesc(); // seamlessly only
        this.showAttackRange();
        this.showUpgradeAction();
        this.showSellAction();
      }
    }

    showDesc() {
      //show detailed tower
      if (detailText) {
        detailText.destroy();
      }
      detailText = this.Phaserscene.add.text(
        150,
        630,
        `Level: ${this.level}\nRange: ${window.getTowerAttackRange(
          this.getName(),
          this.level
        )}\nReload:${
          window.getTowerAttackReload(this.getName(), this.level) / 1000
        }/s`,
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

    showAttackRange() {
      if (rangeImage) {
        rangeImage.destroy();
      }
      rangeImage = this.Phaserscene.physics.add.image(
        this.x,
        this.y,
        "tower_range"
      );
      rangeImage.setDisplaySize(
        window.getTowerAttackRange(this.getName(), this.level) * 2,
        window.getTowerAttackRange(this.getName(), this.level) * 2
      );
      rangeImage.setAlpha(0.4);
      rangeImage.setDepth(3);
      rangeImage.setTint("0xfff000");
    }

    showUpgradeAction() {
      if (upgradeImage) {
        upgradeImage.destroy();
      }

      upgradeImage = this.Phaserscene.physics.add.image(
        this.x + CELL_SIZE / 2,
        this.y - CELL_SIZE / 2,
        "upgrade"
      );
      if (this.level == 5) {
        upgradeImage.setAlpha(0.5);
      }

      upgradeImage.setInteractive();

      upgradeImage.on("pointerdown", (pointer) => {
        console.log('tower upgrade clicked');

        if (savedData.gold < this.getUpgradeCost()) {
          return;
        }

        if (this.level == 5) {
          return;
        }

        savedData.gold -= this.getUpgradeCost();
        goldText.setText(`${savedData.gold}`);

        savedData.towers.splice(savedData.towers.indexOf(this), 1);

        let tower = new Tower(
          this.Phaserscene,
          this.x,
          this.y,
          this.getName(),
          this.level + 1
        );

        if (detailText) {
          detailText.destroy();
        }
        rangeImage.destroy();
        isTowerClicked = false;
        // rangeImage.setDisplaySize(tower.getRange() * 2, tower.getRange() * 2);
        savedData.towers.push(tower);
        upgradeImage.destroy();
        sellImage.destroy();
        this.destroy();
      });

      upgradeImage.on("pointerover", (pointer) => {
        if (detailText) {
          detailText.destroy();
        }
        detailText = this.Phaserscene.add.text(
          150,
          640,
          `Nâng cấp: ${this.getUpgradeCost()}$`,
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
      });

      upgradeImage.on("pointerout", (pointer) => {
        detailText.destroy();
      });

      upgradeImage.setDisplaySize(25, 25);
      upgradeImage.setDepth(3);
    }

    showSellAction() {
      sellImage = this.Phaserscene.physics.add.sprite(
        this.x + CELL_SIZE / 2,
        this.y + CELL_SIZE / 2,
        "sell"
      );
      sellImage.setDepth(3);
      sellImage.play("rotate");
      sellImage.setInteractive();

      sellImage.on("pointerdown", (pointer) => {
        detailText.destroy();
        // console.log('sell clicked');
        savedData.gold += window.getTowerSellPrice(this.getName(), this.level);
        goldText.setText(`${savedData.gold}`);
        savedData.towers.splice(savedData.towers.indexOf(this), 1);

        let square = new Square(this.Phaserscene, this.posX, this.posY);

        COLLISION[this.posY][this.posX] = 0;
        mazePuzzle = findWay(COLLISION, START_POS, END_POS);

        savedData.monsters.forEach((m) => {
          if (m.getMoveType() == window.getConstants().MONSTER_MOVE_TYPE_GROUND) {
            let pre = [
              parseInt((m.y - OFFSET_Y) / CELL_SIZE),
              parseInt(m.x / CELL_SIZE),
            ];

            let prePath = findWay(COLLISION, pre, END_POS);

            if (
              (prePath[0][1] * CELL_SIZE + CELL_SIZE / 2 > m.x &&
                m.x > prePath[1][1] * CELL_SIZE + CELL_SIZE / 2) ||
              (prePath[0][1] * CELL_SIZE + CELL_SIZE / 2 < m.x &&
                m.x < prePath[1][1] * CELL_SIZE + CELL_SIZE / 2) ||
              (prePath[0][0] * CELL_SIZE + OFFSET_Y > m.y &&
                m.y > prePath[1][0] * CELL_SIZE + OFFSET_Y) ||
              (prePath[0][0] * CELL_SIZE + OFFSET_Y < m.y &&
                m.y < prePath[1][0] * CELL_SIZE + OFFSET_Y)
            ) {
              prePath.splice(0, 1);
            }

            m.createPath(prePath);
          }
        });

        isTowerClicked = false;
        rangeImage.destroy();

        sellImage.destroy();
        upgradeImage.destroy();
        this.destroy();
      });

      sellImage.on("pointerover", (pointer) => {
        if (detailText) {
          detailText.destroy();
        }
        detailText = this.Phaserscene.add.text(
          150,
          640,
          `Bán giá: ${window.getTowerSellPrice(this.getName(), this.level)}$`,
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
      });

      sellImage.on("pointerout", (pointer) => {
        detailText.destroy();
      });

      sellImage.setDisplaySize(25, 25);
    }

    pointerover(pointer) {
      if (!isBuying && isTowerClicked) {
        this.showDesc();
      }
    }

    pointerout(pointer) {
      if (detailText) {
        detailText.destroy();
      }
      detailTextClicked = false;
    }

    pointermove(pointer) {
      if (!isBuying && isTowerClicked) {
        this.showDesc();
      }
    }

    getUpgradeCost() {
      return this.upgradeCost;
    }

    getName() {
      return this.towerType;
    }

    shoot() {
      if (this.getName().slice(0, -1) == "power") {
        return;
      }

      let minDistance = this.range;

      savedData.monsters.forEach((monster) => {
        let dist = getDistance(this, monster);
        if (
          this.isReady && //sẵn sàng bắn // chờ nạp đạn
          minDistance > dist
        ) {
          minDistance = dist;
          this.target = monster;
        }
      });

      if (minDistance < this.range) {
        //nạp đạn
        // this.setTint('0xff00');
        // tower.setAlpha(0.5)
        this.rotation += 0.1;
        this.isReady = false;
        this.Phaserscene.time.addEvent({
          delay: window.getTowerAttackReload(this.getName(), this.level),
          callback: () => {
            // this.clearTint();
            this.isReady = true;
          },
          callbackScope: this.Phaserscene,
          loop: false,
        });

        //Tạo đạn và bắn

        let bullet = new Bullet(
          this.Phaserscene,
          this.x,
          this.y,
          this,
          this.level
        );
        bullet.target = this.target;
        this.target.aimed.push(bullet);

        this.Phaserscene.physics.add.overlap(
          bullet,
          bullet.target,
          dealDamage,
          null,
          this.Phaserscene
        );

        savedData.bullets.push(bullet);
      }
    }
  };
};
