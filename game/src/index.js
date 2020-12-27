import Phaser from 'phaser';
import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin';
import PreloadScene from './scenes/PreloadScene';
import ExampleScene from './scenes/ExampleScene';

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {}

  create() {
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

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  plugins: {
    scene: [
      {
        key: 'rexBoard',
        plugin: BoardPlugin,
        mapping: 'rexBoard',
      },
    ],
  },
  scene: [ExampleScene, PreloadScene, MyGame],
};

new Phaser.Game(config);
