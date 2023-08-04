/** This service contains state that need to be sent to server,
 * or to save game and load saved slot in local only
 */
class GameStateService {
  _scene = null;
  savedData = null;
  waveText = null;
  lifeText = null;
  goldText = null;

  setScene(scene) {
    this._scene = scene;
  }

  /**
   * setState for gold
   * @param {function(prevState): prevState} callback
   */
  setGold(callback) {
    this.savedData.gold = callback(this.savedData.gold);
    this.goldText.setText(`${this.savedData.gold}`);
  }

  /**
   * setState for wave
   * @param {function(prevState): prevState} callback
   */
  setWave(callback) {
    this.savedData.wave = callback(this.savedData.wave);
    this.waveText.setText(`Đợt: ${this.savedData.wave}`);
  }

  /**
   * setState for life
   * @param {function(prevState): prevState} callback
   */
  setLife(callback) {
    this.savedData.life = callback(this.savedData.life);
    this.lifeText.setText(`Máu: ${this.savedData.life}`);
  }

  init(gameData) {
    this.savedData = gameData;

    this.waveText = this._scene.add.text(290, 29, `${this.savedData.wave}`, {
      fontSize: "15px",
      fill: "#fff",
      fontFamily: "roboto",
    });

    this.lifeText = this._scene.add.text(
      360,
      150,
      `Máu ${this.savedData.life}`,
      {
        fontSize: "20px",
        fill: "#fff",
        fontFamily: "roboto",
      }
    );

    this.goldText = this._scene.add.text(615, 230, `${this.savedData.gold}`, {
      fontSize: "13px",
      fill: "#ffd64c",
      fontFamily: "roboto",
    });
  }

  test() {
    console.log("Game State enter");
  }
}
