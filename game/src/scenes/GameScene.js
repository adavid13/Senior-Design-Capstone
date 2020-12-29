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

  print() {
    console.log('VTNC');
  }

  create() {
    console.log('Game Scene');
    const print = this.add.text(0, 0, 'Click any tile');
    const staggeraxis = 'y';
    const staggerindex = 'odd';
    const board = this.rexBoard.add
      .board({
        grid: {
          gridType: 'hexagonGrid',
          x: 60,
          y: 60,
          size: 30,
          staggeraxis,
          staggerindex,
        },
      })
      .setInteractive()
      .on('tiledown', (pointer, tileXY) => {
        print.text = `${tileXY.x},${tileXY.y}`;
      });

    const tileXYArray = board.fit(this.rexBoard.hexagonMap.hexagon(board, 4));
    const graphics = this.add.graphics({
      lineStyle: {
        width: 1,
        color: 0xffffff,
        alpha: 1,
      },
    });
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
        .text(worldXY.x, worldXY.y, `${tileXY.x},${tileXY.y}`)
        .setOrigin(0.5);
    }
  }
}
