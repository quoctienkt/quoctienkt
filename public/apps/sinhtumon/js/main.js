window.setupGame = (appPrefix) => {
  window._gameStateService = new GameStateService();
  window._gameMapService = new HoTuThanMap();

  window.setupBullet(_gameStateService);
  window.setupTower(_gameStateService);
  window.setupSquare(_gameStateService, _gameMapService);
  window.setupMonster(_gameStateService, _gameMapService);

  window.graphics = undefined;
  window.tempTower = null;

  window.sampleTower1 = null;
  window.sampleTower2 = null;
  window.sampleTower3 = null;
  window.sampleTower4 = null;

  window.nextWave = undefined;
  window.waveDelay = 15000;
  window.sellImage = null;
  window.upgradeImage = null;
  window.rangeImage = null;
  window.upgradeText = null;
  window.sellText = null;
  window.detailText = null;

  window.OFFSET_Y = 110;
  window.OFFSET_RIGHT_X = 150;
  window.OFFSET_DOWN_Y = 60;
  window.GAME_WIDTH = 520;
  window.GAME_HEIGHT = 520;

  window.isBuying = false;
  window.isTowerClicked = false;
  window.detailTextClicked = false;

  window.monsterRespawnEvent = null;

  window.config = {
    type: Phaser.CANVAS,
    canvas: document.getElementById("myCustomCanvas"),
    width: GAME_WIDTH + OFFSET_RIGHT_X,
    height: GAME_HEIGHT + OFFSET_Y + OFFSET_DOWN_Y,
    physics: {
      default: "arcade",
      arcade: {
        debug: true,
      },
    },
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  };

  window.phaserGame = new Phaser.Game(config);
};

function preload() {
  window._gameStateService.setScene(this);
  window._gameMapService.setScene(this);

  const snowflakeTower = window.getTowerSnowFlakeData();

  this.load.image(
    "background",
    window.getAssetPathWithAppPrefix(window.appPrefix, "/img/background.png")
  );
  this.load.image(
    "background1",
    window.getAssetPathWithAppPrefix(window.appPrefix, "/img/background1.png")
  );
  this.load.image(
    "square",
    window.getAssetPathWithAppPrefix(window.appPrefix, "/img/square2.png")
  );
  this.load.image(
    "arrow",
    window.getAssetPathWithAppPrefix(window.appPrefix, "/img/arrow.png")
  );

  this.load.image(
    "tower_range",
    window.getAssetPathWithAppPrefix(window.appPrefix, "/img/circle_2.png")
  );

  this.load.image(
    window.getTowerAmmoAssetName(snowflakeTower.towerType, 1),
    window.getAssetPathWithAppPrefix(
      window.appPrefix,
      "/img/tower/frozen_bullet/1.png"
    )
  );
  this.load.image(
    window.getTowerAmmoAssetName(snowflakeTower.towerType, 2),
    window.getAssetPathWithAppPrefix(
      window.appPrefix,
      "/img/tower/frozen_bullet/2.png"
    )
  );
  this.load.image(
    window.getTowerAmmoAssetName(snowflakeTower.towerType, 3),
    window.getAssetPathWithAppPrefix(
      window.appPrefix,
      "/img/tower/frozen_bullet/3.png"
    )
  );
  this.load.image(
    window.getTowerAmmoAssetName(snowflakeTower.towerType, 4),
    window.getAssetPathWithAppPrefix(
      window.appPrefix,
      "/img/tower/frozen_bullet/4.png"
    )
  );
  this.load.image(
    window.getTowerAmmoAssetName(snowflakeTower.towerType, 5),
    window.getAssetPathWithAppPrefix(
      window.appPrefix,
      "/img/tower/frozen_bullet/5.png"
    )
  );

  this.load.image(
    "upgrade",
    window.getAssetPathWithAppPrefix(window.appPrefix, "/img/loop.png")
  );
  this.load.spritesheet(
    "sell",
    window.getAssetPathWithAppPrefix(window.appPrefix, "/img/coin.png"),
    {
      frameWidth: 32,
      frameHeight: 32,
    }
  );

  this.load.spritesheet(
    "onDead",
    window.getAssetPathWithAppPrefix(window.appPrefix, "/img/explosion.png"),
    {
      frameWidth: 64,
      frameHeight: 64,
    }
  );

  this.load.spritesheet(
    window.getConstants().MONSTER_THIEF,
    window.getAssetPathWithAppPrefix(window.appPrefix, "/img/ani_beast.png"),
    {
      frameWidth: 32,
      frameHeight: 53,
    }
  );
  this.load.spritesheet(
    window.getConstants().MONSTER_BUTTERFLY,
    window.getAssetPathWithAppPrefix(
      window.appPrefix,
      "/img/monster/flying/butterfly.png"
    ),
    {
      frameWidth: 70,
      frameHeight: 65,
    }
  );

  this.load.image(
    window.getTowerAssetName(snowflakeTower.towerType, 1),
    window.getAssetPathWithAppPrefix(
      window.appPrefix,
      "/img/tower/frozen/1.png"
    )
  );
  this.load.image(
    window.getTowerAssetName(snowflakeTower.towerType, 2),
    window.getAssetPathWithAppPrefix(
      window.appPrefix,
      "/img/tower/frozen/2.png"
    )
  );
  this.load.image(
    window.getTowerAssetName(snowflakeTower.towerType, 3),
    window.getAssetPathWithAppPrefix(
      window.appPrefix,
      "/img/tower/frozen/3.png"
    )
  );
  this.load.image(
    window.getTowerAssetName(snowflakeTower.towerType, 4),
    window.getAssetPathWithAppPrefix(
      window.appPrefix,
      "/img/tower/frozen/4.png"
    )
  );
  this.load.image(
    window.getTowerAssetName(snowflakeTower.towerType, 5),
    window.getAssetPathWithAppPrefix(
      window.appPrefix,
      "/img/tower/frozen/5.png"
    )
  );

  graphics = this.add.graphics();
}

function create() {
  this.anims.create({
    key: "dead",
    frames: "onDead",
    frameRate: 500,
    repeat: 0,
  });

  this.anims.create({
    key: "rotate",
    frames: "sell",
    frameRate: 10,
    repeat: -1,
  });

  window._gameMapService.preload();

  savedData = {
    towers: [],
    monsters: [],
    bullets: [],
    wave: 1,
    life: 10,
    gold: 1000,
  };

  window._gameStateService.preload(savedData);

  // tháp mẫu
  // this.add.text(560, 200, 'Tháp', { fontSize: '20px', fill: '#aaa' });
  // this.add.text(560, 420, 'Skill', { fontSize: '20px', fill: '#aaa' });

  sampleTower1 = new Tower(
    this,
    640,
    350,
    window.getTowerSnowFlakeData().towerType,
    1,
    true,
    true
  );
  // sampleTower2 = new Tower(this, 640, 340, 'power0')

  // this.add.image(580, 300, `0.png`).setDisplaySize(40, 40)
  // this.add.image(580, 350, "arrow").setDisplaySize(40, 40);
  // this.add.image(640, 250, "frozen").setDisplaySize(40, 40);
  // this.add.image(640, 300, "frozen").setDisplaySize(40, 40);
  // this.add.image(640, 350, "frozen").setDisplaySize(40, 40);

  //Wave
  monsterRespawn.call(this, 15);
  monsterRespawnEvent = this.time.addEvent({
    delay: waveDelay,
    callback: () => monsterRespawn.call(this, 15),
    callbackScope: this,
    loop: true,
  });

  nextWave = this.add.text(
    10,
    20,
    `Đợt kế: ${monsterRespawnEvent.getProgress().toString()}`,
    {
      fontSize: "15px",
      fill: "#fff",
      fontFamily: "roboto",
    }
  );

  //is buying
  this.input.on("pointermove", (pointer) => {
    if (isBuying) {
      tempTower.x = pointer.x;
      tempTower.y = pointer.y;
    }
  });

  // Huỷ chọn mua tháp khi click ra ngoài
  this.input.on("pointerdown", (pointer) => {
    if (detailTextClicked) {
      detailText.destroy();
    }
    if (isBuying || isTowerClicked) {
      // console.log("clicked everywhere")
      isBuying = false;
      if (tempTower) {
        tempTower.destroy();
      }
      if (upgradeImage) {
        upgradeImage.destroy();
      }
      if (sellImage) {
        sellImage.destroy();
      }
      if (rangeImage) {
        rangeImage.destroy();
      }
      isTowerClicked = false;
    }
  });
}

function monsterReachEndpoint(tween, targets, monster) {
  _gameStateService.setLife((prev) => prev - 1);
  let i = _gameStateService.savedData.bullets.length - 1;
  while (i >= 0) {
    if (_gameStateService.savedData.bullets[i].target === monster) {
      _gameStateService.savedData.bullets[i].destroy();
      _gameStateService.savedData.bullets.splice(i, 1);
    }
    i--;
  }

  _gameStateService.savedData.monsters.splice(_gameStateService.savedData.monsters.indexOf(monster), 1);
  monster.destroy();
}

function monsterRespawn(number) {
  let name =
    parseInt(Math.random() * 10) % 2
      ? window.getConstants().MONSTER_BUTTERFLY
      : window.getConstants().MONSTER_THIEF;
  window._gameStateService.setWave((wave) => wave + 1);
  for (let i = 0; i < 15; i++) {
    this.time.addEvent({
      delay: i * 650,
      callback: () => {
        let monster = new Monster(this, 0, 0, name);
        _gameStateService.savedData.monsters.push(monster);
      },
      callbackScope: this,
      loop: false,
    });
  }
}

function dealDamage(bullet, monster) {
  // console.log("touch monster")
  monster.health -= bullet.damage;

  _gameStateService.savedData.bullets.splice(_gameStateService.savedData.bullets.indexOf(bullet), 1);
  bullet.destroy();

  if (monster.health <= 0) {
    monster.dead();
  }
}

function getDistance(objectA, objectB) {
  return Math.sqrt(
    (objectA.x - objectB.x) * (objectA.x - objectB.x) +
      (objectA.y - objectB.y) * (objectA.y - objectB.y)
  );
}

function moveTo(source, target, speed) {
  //rad
  let angle = Math.atan2(target.x - source.x, target.y - source.y);

  source.setAngle(
    Phaser.Math.RAD_TO_DEG *
      Phaser.Math.Angle.Between(source.x, source.y, target.x, target.y)
  );
  source.setVelocity(Math.sin(angle) * speed, Math.cos(angle) * speed);
}

function update(time, delta) {
  graphics.clear();

  //end game
  if (_gameStateService.savedData.life < 1) {
    this.physics.pause();
    monsterRespawnEvent.destroy();
    _gameStateService.savedData.monsters.forEach((m) => m.destroy());
    return;
  }

  nextWave.setText(
    "Đợt kế: " +
      (waveDelay -
        waveDelay *
          parseFloat(
            monsterRespawnEvent.getProgress().toString().substr(0, 4)
          )) /
        1000
  );

  //landing monster move
  _gameStateService.savedData.monsters.forEach((monster) => {
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.lineStyle(1, 0xffffff, 1);
    // monster.path.draw(graphics)
    monster.path.getPoint(monster.follower.t, monster.follower.vec);
    monster.setPosWithHealth(monster.follower.vec.x, monster.follower.vec.y);
  });

  //Cập nhật đường đạn
  _gameStateService.savedData.bullets.forEach((bullet) =>
    moveTo.call(this, bullet, bullet.target, bullet.speed)
  );

  //fire
  _gameStateService.savedData.towers.forEach((tower) => tower.shoot());
}
