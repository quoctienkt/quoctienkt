class HoTuThanMap {
  mapKey = "MAP_HOTUTHAN";

  GAME_BOARD_PADDING_TOP = 80;
  CELL_SIZE = 40.0;
  CELL_HEIGHT = 39.0;
  START_POSITION = [0, 0];
  END_POSITION = [13, 12];
  CELL_AVAILABLE = 0;
  CELL_BLOCKED = 1;

  scene = null;
  groundMonsterMovingPathDefault = null;
  map = null;
  startPosition = null;
  endPosition = null;
  _gameStateService = null;

  constructor() {
    // 0 is available slot, 1 is blocked slot
    this.map = [
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    ];

    this.startPosition = [...this.START_POSITION];
    this.endPosition = [...this.END_POSITION];

    this.groundMonsterMovingPathDefault = this.getGroundMonsterMovingPath();
  }

  preload() {
    this._gameStateService = window._gameStateService;
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
      5 + window.GAME_HEIGHT + this.GAME_BOARD_PADDING_TOP
    );

    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++) {
        if (!this.map[row][col]) {
          let square = new Square(this.scene, col, row);
        }
      }
    }
  }

  getGroundMonsterMovingPath(
    map = null,
    startPosition = null,
    endPosition = null
  ) {
    return findWay(
      map ?? this.map,
      startPosition ?? this.startPosition,
      endPosition ?? this.endPosition
    );
  }

  tryUpdateMap(col, row, cellState) {
    // Workflow: check default ground monster path, and existing monsters' path

    // deep clone current map
    let nextMapState = [...this.map];
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
            (this._gameStateService.savedData.monsters[i].y - this.GAME_BOARD_PADDING_TOP) /
              this.CELL_SIZE
          ),
          parseInt(
            this._gameStateService.savedData.monsters[i].x / this.CELL_SIZE
          ),
        ];

        let newMonsterPath = this.getGroundMonsterMovingPath(
          nextMapState,
          monsterPosition,
          this.END_POSITION
        );
        if (!newMonsterPath) {
          return false;
        }

        // for moving more smoothly
        if (
          (newMonsterPath[0][1] * this.CELL_SIZE + this.CELL_SIZE / 2 >
            this._gameStateService.savedData.monsters[i].x &&
            this._gameStateService.savedData.monsters[i].x >
              newMonsterPath[1][1] * this.CELL_SIZE + this.CELL_SIZE / 2) ||
          (newMonsterPath[0][1] * this.CELL_SIZE + this.CELL_SIZE / 2 <
            this._gameStateService.savedData.monsters[i].x &&
            this._gameStateService.savedData.monsters[i].x <
              newMonsterPath[1][1] * this.CELL_SIZE + this.CELL_SIZE / 2) ||
          (newMonsterPath[0][0] * this.CELL_SIZE + this.GAME_BOARD_PADDING_TOP >
            this._gameStateService.savedData.monsters[i].y &&
            this._gameStateService.savedData.monsters[i].y >
              newMonsterPath[1][0] * this.CELL_SIZE + this.GAME_BOARD_PADDING_TOP) ||
          (newMonsterPath[0][0] * this.CELL_SIZE + this.GAME_BOARD_PADDING_TOP <
            this._gameStateService.savedData.monsters[i].y &&
            this._gameStateService.savedData.monsters[i].y <
              newMonsterPath[1][0] * this.CELL_SIZE + this.GAME_BOARD_PADDING_TOP)
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
