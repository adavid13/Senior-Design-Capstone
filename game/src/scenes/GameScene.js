import Phaser from 'phaser';
import { Constants } from '../utils/constants';

const sceneConfig = {
  key: Constants.Scenes.GAME,
};

export default class GameScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  init() {
    this.scene.launch(Constants.Scenes.GAMEUI);
  }

  preload() {}

  create() {
    const print = this.add.text(0, 0, 'Click any tile');
    const staggeraxis = 'x';
    const staggerindex = 'odd';
    const RADIUS = 8;
    const board = this.rexBoard.add
      .board({
        grid: {
          gridType: 'hexagonGrid',
          x: 0,
          y: 0,
          size: 60,
          staggeraxis,
          staggerindex,
        },
      })
      .setInteractive()
      .on('tiledown', (pointer, tileXY) => {
        print.text = `${tileXY.x},${tileXY.y}`;
      });
    const tileXYArray = board.fit(
      this.rexBoard.hexagonMap.hexagon(board, RADIUS)
    );

    this.centerCamera(board, tileXYArray, RADIUS);

    const graphics = this.add.graphics({
      lineStyle: {
        width: 1,
        color: 0xffffff,
        alpha: 1,
      },
    });

    const grasslandKeys = [
      'grassland0',
      'grassland2',
      'grassland2',
      'grassland3',
    ];

    let tileXY = {};
    let worldXY = {};
    for (const i in tileXYArray) {
      tileXY = tileXYArray[i];
      graphics.strokePoints(
        board.getGridPoints(tileXY.x, tileXY.y, true),
        true
      );
      worldXY = board.tileXYToWorldXY(tileXY.x, tileXY.y);
      this.add
        .image(
          worldXY.x,
          worldXY.y,
          grasslandKeys[Math.floor(Math.random() * 4)],
          Math.floor(Math.random() * 10)
        )
        .setScale(0.625);
      this.add
        .text(worldXY.x, worldXY.y, `${tileXY.x},${tileXY.y}`)
        .setOrigin(0.5);
    }
  }

  update() {
    if (this.game.input.activePointer.isDown) {
      if (this.game.origDragPoint) {
        // move the camera by the amount the mouse has moved since last update
        this.cameras.main.scrollX +=
          this.game.origDragPoint.x - this.game.input.activePointer.position.x;
        this.cameras.main.scrollY +=
          this.game.origDragPoint.y - this.game.input.activePointer.position.y;
      } // set new drag origin to current position
      this.game.origDragPoint = this.game.input.activePointer.position.clone();
    } else {
      this.game.origDragPoint = null;
    }
  }

  centerCamera(board, tileXYArray, radius) {
    for (const i in tileXYArray) {
      const tileXY = tileXYArray[i];
      if (tileXY.x === radius && tileXY.y === radius) {
        const worldXY = board.tileXYToWorldXY(tileXY.x, tileXY.y);
        this.cameras.main.centerOn(worldXY.x, worldXY.y);
      }
    }
  }
}
