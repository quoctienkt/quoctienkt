window.setupTower = () => {
  window.Tower = class extends Phaser.Physics.Arcade.Sprite {
    //Type : range, melee, sample
    //name: power arrow frozen thunder
    constructor(scene, x, y, name, level, isInit = true) {
      super(scene, x, y, `${name}`);
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.Phaserscene = scene;

      this.level = level;
      this.isReady = true;
      this.range;
      this.price;

      this.setDepth(3);
      this.setInteractive();

      this.posX = (this.x - CELL_SIZE / 2) / CELL_SIZE;
      this.posY = (this.y - OFFSET_Y) / CELL_SIZE;
      if (isInit) {
        this.init();
      }
    }

    init() {
      this.price = this.getPrice();
      this.range = this.getRange();

      this.getDisplaySize();

      //buy sample tower
      if (this.getName().substr(-1) == "0") {
        this.on("pointerdown", (pointer) => {
          // console.log('sampleTower clicked');
          //tạo tháp từ con trỏ chuột
          if (gold >= this.getPrice()) {
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
              0,
              false
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
          this.pointerdown(pointer);
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

    showinfo() {
      //show detailed tower
      if (detailText) {
        detailText.destroy();
      }
      detailText = this.Phaserscene.add.text(
        150,
        630,
        `Level: ${this.level}\nRange: ${this.getRange()}\nReload:${
          this.getCharge() / 1000
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

    pointerdown(pointer) {
      if (!isBuying) {
        this.showinfo();

        // console.log('tower clicked');
        if (rangeImage) {
          rangeImage.destroy();
        }

        if (isTowerClicked) {
          upgradeImage.destroy();
          sellImage.destroy();
        }

        rangeImage = this.Phaserscene.physics.add.image(
          this.x,
          this.y,
          "tower_range"
        );
        rangeImage.setDisplaySize(this.getRange() * 2, this.getRange() * 2);
        rangeImage.setAlpha(0.4);
        rangeImage.setDepth(3);
        rangeImage.setTint("0xfff000");

        isTowerClicked = false;
        this.Phaserscene.time.addEvent({
          delay: 100,
          callback: () => {
            isTowerClicked = true;
          },
          callbackScope: this,
          loop: false,
        });

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
          if (detailText) {
            detailText.destroy();
          }

          if (gold < this.getUpgradeCost()) {
            return;
          }
          // console.log('upgrade clicked');

          if (this.level == 5) {
            return;
          }

          gold -= this.getUpgradeCost();
          goldText.setText(`${gold}`);

          towers.splice(towers.indexOf(this), 1);

          let tower = new Tower(
            this.Phaserscene,
            this.x,
            this.y,
            this.getNextLevelName(),
            this.level + 1
          );

          rangeImage.destroy();
          isTowerClicked = false;
          // rangeImage.setDisplaySize(tower.getRange() * 2, tower.getRange() * 2);
          towers.push(tower);
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
          gold += this.getPrice();
          goldText.setText(`${gold}`);
          towers.splice(towers.indexOf(this), 1);

          let square = new Square(this.Phaserscene, this.posX, this.posY);

          COLLISION[this.posY][this.posX] = 0;
          mazePuzzle = findWay(COLLISION, START_POS, END_POS);

          monsters.forEach((m) => {
            if (m.type == "landing") {
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
            `Bán giá: ${this.getPrice()}$`,
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
    }

    pointerover(pointer) {
      if (!isBuying && isTowerClicked) {
        this.showinfo();
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
        this.showinfo();
      }
    }

    getUpgradeCost() {
      if (this.getName() == "power1") {
        return 150;
      } else if (this.getName() == "power2") {
        return 240;
      } else if (this.getName() == "power3") {
        return 320;
      } else if (this.getName() == "power4") {
        return 400;
      }

      if (this.getName() == "frozen1") {
        return 120;
      } else if (this.getName() == "frozen2") {
        return 180;
      } else if (this.getName() == "frozen3") {
        return 240;
      } else if (this.getName() == "frozen4") {
        return 320;
      }
    }

    getPrice() {
      //Sell price
      if (this.getName() == "power0") {
        this.price = 110;
      } else if (this.getName() == "power1") {
        this.price = 70;
      } else if (this.getName() == "power2") {
        this.price = 110;
      } else if (this.getName() == "power3") {
        this.price = 180;
      } else if (this.getName() == "power4") {
        this.price = 240;
      } else if (this.getName() == "power5") {
        this.price = 320;
      }

      //Sell price
      if (this.getName() == "frozen0") {
        this.price = 80;
      } else if (this.getName() == "frozen1") {
        this.price = 40;
      } else if (this.getName() == "frozen2") {
        this.price = 110;
      } else if (this.getName() == "frozen3") {
        this.price = 150;
      } else if (this.getName() == "frozen4") {
        this.price = 170;
      } else if (this.getName() == "frozen5") {
        this.price = 220;
      }

      return this.price;
    }

    getDisplaySize() {
      this.setDisplaySize(35, 35);
      if (this.getName() == "frozen2") {
        this.setDisplaySize(40, 40);
      } else if (this.getName() == "frozen3") {
        this.setDisplaySize(35, 35);
      } else if (this.getName() == "frozen4") {
        this.setDisplaySize(40, 40);
        // this.setTint()
      } else if (this.getName() == "frozen5") {
        this.setDisplaySize(40, 40);
      }
    }

    getNextLevelName() {
      if (this.level == 5) return this.getName();
      return this.getName().slice(0, -1) + (this.level + 1);
    }

    getName() {
      return this.texture.key;
    }

    getRange() {
      if (this.getName() == "power1") {
        this.range = 80;
      } else if (this.getName() == "power2") {
        this.range = 80;
      } else if (this.getName() == "power3") {
        this.range = 80;
      } else if (this.getName() == "power4") {
        this.range = 80;
      } else if (this.getName() == "power5") {
        this.range = 80;
      }

      if (this.getName() == "frozen1") {
        this.range = 30;
      } else if (this.getName() == "frozen2") {
        this.range = 35;
      } else if (this.getName() == "frozen3") {
        this.range = 40;
      } else if (this.getName() == "frozen4") {
        this.range = 45;
      } else if (this.getName() == "frozen5") {
        this.range = 55;
      }
      this.range += CELL_SIZE;
      return this.range;
    }

    getCharge() {
      if (this.getName() == "frozen1") {
        return 300;
      } else if (this.getName() == "frozen2") {
        return 280;
      } else if (this.getName() == "frozen3") {
        return 250;
      } else if (this.getName() == "frozen4") {
        return 200;
      } else if (this.getName() == "frozen5") {
        return 180;
      }
    }

    getBulletName() {
      if (this.getName() == "frozen1") {
        return "bullet1";
      } else if (this.getName() == "frozen2") {
        return "bullet2";
      } else if (this.getName() == "frozen3") {
        return "bullet3";
      } else if (this.getName() == "frozen4") {
        return "bullet4";
      } else if (this.getName() == "frozen5") {
        return "bullet5";
      }
    }

    shoot() {
      if (this.getName().slice(0, -1) == "power") {
        return;
      }

      let minDistance = this.range;

      monsters.forEach((monster) => {
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
          delay: this.getCharge(),
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
          this.getBulletName(),
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

        bullets.push(bullet);
      }
    }
  };
};
