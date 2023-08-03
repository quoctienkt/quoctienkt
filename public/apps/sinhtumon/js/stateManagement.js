class GameStateService {
  _scene = null;

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
    window.savedData.gold = callback(window.savedData.gold);
    this.goldText.setText(`${window.savedData.gold}`);
  }

  /**
   * setState for wave
   * @param {function(prevState): prevState} callback
   */
  setWave(callback) {
    window.savedData.wave = callback(window.savedData.wave);
    this.waveText.setText(`Đợt: ${window.savedData.wave}`);
  }

  /**
   * setState for life
   * @param {function(prevState): prevState} callback
   */
  setLife(callback) {
    window.savedData.life = callback(window.savedData.life);
    this.lifeText.setText(`Máu: ${window.savedData.life}`);
  }

  preload(gameData) {
    window.savedData = gameData;

    this.waveText = this._scene.add.text(300, 34, `${savedData.wave}`, {
      fontSize: "15px",
      fill: "#fff",
      fontFamily: "roboto",
    });

    this.lifeText = this._scene.add.text(360, 150, `Máu ${savedData.life}`, {
      fontSize: "20px",
      fill: "#fff",
      fontFamily: "roboto",
    });

    this.goldText = this._scene.add.text(615, 241, `${savedData.gold}`, {
      fontSize: "13px",
      fill: "#ffd64c",
      fontFamily: "roboto",
    });
  }

  test() {
    console.log("Game State enter");
  }
}
