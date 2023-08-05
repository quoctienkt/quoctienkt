class GameMapServiceBase {
  _gameStateService = null;
  scene = null;

  mapConfig = {
    mapKey: null,
    map: null,
    GAME_BOARD_PADDING_TOP: null,
    CELL_WIDTH: null,
    CELL_HEIGHT: null,
    START_POSITION: null, //[row,col]
    END_POSITION: null, //[row,col]
    CELL_AVAILABLE: null,
    CELL_BLOCKED: null,
  };

  currentStartPosition = null;
  currentEndPosition = null;
  groundMonsterMovingPathDefault = null;

  constructor(mapConfig) {
    this.mapConfig = mapConfig;

    this.currentStartPosition = [...this.mapConfig.START_POSITION];
    this.currentEndPosition = [...this.mapConfig.END_POSITION];
    this.groundMonsterMovingPathDefault = this.getGroundMonsterMovingPath();
  }

  init() {
    this._gameStateService = window._gameStateService;

    this.scene.anims.create({
      key: "dead",
      frames: "onDead",
      frameRate: 500,
      repeat: 0,
    });

    this.scene.anims.create({
      key: "rotate",
      frames: "sell",
      frameRate: 10,
      repeat: -1,
    });

    this.scene.add.text(5, 60, "Cửa vào", {
      fontSize: "15px",
      fill: "#ffffff",
      fontFamily: "roboto",
    });
    this.scene.add.text(445, 635, "Cửa ra", {
      fontSize: "20px",
      fill: "#ffffff",
      fontFamily: "roboto",
    });

    let background = this.scene.add.image(-2, 0, "background1").setOrigin(0);
    background.setDepth(-3);
    background.setDisplaySize(
      window.GAME_WIDTH,
      5 + window.GAME_HEIGHT + this.mapConfig.GAME_BOARD_PADDING_TOP
    );

    for (let row = 0; row < this.mapConfig.map.length; row++) {
      for (let col = 0; col < this.mapConfig.map[row].length; col++) {
        if (!this.mapConfig.map[row][col]) {
          let square = new Square(this.scene, col, row);
        }
      }
    }

    let sampleTower1 = new Tower(
      this.scene,
      640,
      340,
      window.getTowerSnowFlakeData().towerType,
      1,
      true,
      true
    );
  }

  getGroundMonsterMovingPath(
    map = null,
    startPosition = null,
    endPosition = null
  ) {
    return findWay(
      map ?? this.mapConfig.map,
      startPosition ?? this.currentStartPosition,
      endPosition ?? this.currentEndPosition
    );
  }

  tryUpdateMap(col, row, cellState) {
    // Workflow: check default ground monster path, and existing monsters' path

    // deep clone current map
    let nextMapState = [...this.mapConfig.map];
    nextMapState[row] = [...nextMapState[row]];
    nextMapState[row][col] = cellState;

    let newGroundMonsterMovingPath =
      this.getGroundMonsterMovingPath(nextMapState);
    if (newGroundMonsterMovingPath == null) {
      return false;
    }

    let newMonstersPathList = [];
    for (let i = 0; i < this._gameStateService.savedData.monsters.length; i++) {
      if (
        this._gameStateService.savedData.monsters[i].getMoveType() ==
        window.getConstants().MONSTER_MOVE_TYPE_GROUND
      ) {
        let monsterPosition = [
          parseInt(
            (this._gameStateService.savedData.monsters[i].y -
              this.mapConfig.GAME_BOARD_PADDING_TOP) /
              this.mapConfig.CELL_HEIGHT
          ),
          parseInt(
            this._gameStateService.savedData.monsters[i].x /
              this.mapConfig.CELL_WIDTH
          ),
        ];

        let newMonsterPath = this.getGroundMonsterMovingPath(
          nextMapState,
          monsterPosition,
          this.mapConfig.END_POSITION
        );
        if (!newMonsterPath) {
          return false;
        }

        // for moving more smoothly
        if (
          (newMonsterPath[0][1] * this.mapConfig.CELL_WIDTH +
            this.mapConfig.CELL_WIDTH / 2 >
            this._gameStateService.savedData.monsters[i].x &&
            this._gameStateService.savedData.monsters[i].x >
              newMonsterPath[1][1] * this.mapConfig.CELL_WIDTH +
                this.mapConfig.CELL_WIDTH / 2) ||
          (newMonsterPath[0][1] * this.CELL_WIDTH +
            this.mapConfig.CELL_WIDTH / 2 <
            this._gameStateService.savedData.monsters[i].x &&
            this._gameStateService.savedData.monsters[i].x <
              newMonsterPath[1][1] * this.mapConfig.CELL_WIDTH +
                this.mapConfig.CELL_WIDTH / 2) ||
          (newMonsterPath[0][0] * this.mapConfig.CELL_HEIGHT +
            this.mapConfig.GAME_BOARD_PADDING_TOP >
            this._gameStateService.savedData.monsters[i].y &&
            this._gameStateService.savedData.monsters[i].y >
              newMonsterPath[1][0] * this.mapConfig.CELL_HEIGHT +
                this.mapConfig.GAME_BOARD_PADDING_TOP) ||
          (newMonsterPath[0][0] * this.CELL_HEIGHT +
            this.mapConfig.GAME_BOARD_PADDING_TOP <
            this._gameStateService.savedData.monsters[i].y &&
            this._gameStateService.savedData.monsters[i].y <
              newMonsterPath[1][0] * this.mapConfig.CELL_HEIGHT +
                this.mapConfig.GAME_BOARD_PADDING_TOP)
        ) {
          newMonsterPath.splice(0, 1);
        }

        newMonstersPathList.push(newMonsterPath);
      } else {
        // fly monster
        newMonstersPathList.push(null);
      }
    }

    this._gameStateService.savedData.monsters.forEach((monster, i) => {
      monster.updateMonsterPath(newMonstersPathList[i]);
    });

    this.map = nextMapState;
    this.groundMonsterMovingPathDefault = newGroundMonsterMovingPath;
    return true;
  }

  setScene(scene) {
    this.scene = scene;
  }
}
