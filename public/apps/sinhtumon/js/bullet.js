class Bullet extends Phaser.Physics.Arcade.Sprite {
  //Type : range, melee, sample
  //name: power arrow frozen thunder
  constructor(scene, x, y, name, level) {
    super(scene, x, y, `${name}`);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.Phaserscene = scene;

    this.setDepth(3);
    this.level = level;
    this.target;

    this.speed;
    this.damage;

    this.init();
  }

  init() {
    if (this.getName() == "bullet1") {
      this.setCircle(4, 3, -2);

      // this.type = "";
      this.speed = 200;
      this.damage = 50;

      // this.setTint('0xffffff');
      // this.setDisplaySize(30, 30);
      return;
    } else if (this.getName() == "bullet2") {
      this.setCircle(5, 4, -2);

      this.speed = 240;
      this.damage = 55;

      // this.setTint('0xffffff');
      // this.setDisplaySize(30, 30);
      return;
    } else if (this.getName() == "bullet3") {
      // this.setCircle(5, 4, -2);

      this.speed = 260;
      this.damage = 60;

      // this.setTint('0xffffff');
      // this.setDisplaySize(30, 30);
      return;
    } else if (this.getName() == "bullet4") {
      // this.setCircle(5, 4, -2);

      this.speed = 280;
      this.damage = 70;

      this.setTint("0xffa500");
      this.setDisplaySize(20, 15);
      return;
    } else if (this.getName() == "bullet5") {
      // this.setCircle(5, 4, -2);

      this.speed = 300;
      this.damage = 80;

      this.setTint("0xffa500");
      this.setDisplaySize(20, 15);
      return;
    }
  }

  getName() {
    return this.texture.key;
  }
}
