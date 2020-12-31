import { Board } from 'phaser3-rex-plugins/plugins/board-components.js';

export default class GameBoard extends Board {
  constructor(scene, boardModel) {
    super(scene, boardModel.getGridConfig());
    this.scene = scene;
    this.model = boardModel;
  }

  initHexBoard() {
    this.scene.add.existing(this);
    this.tileXYArray = this.fit(this.scene.rexBoard.hexagonMap.hexagon(this, this.model.getRadius()));

    this.tileOutline = this.scene.add.graphics({
      lineStyle: { width: 1, color: 0xffffff, alpha: 1 },
    });

    let tileXY = {};
    let worldXY = {};
    const tileKeys = this.model.getKeys();
    for (const i in this.tileXYArray) {
      tileXY = this.tileXYArray[i];
      this.tileOutline.strokePoints(this.getGridPoints(tileXY.x, tileXY.y, true), true);
      worldXY = this.tileXYToWorldXY(tileXY.x, tileXY.y);
      this.scene.add
        .image(
          worldXY.x,
          worldXY.y,
          tileKeys[Math.floor(Math.random() * tileKeys.length)],
          Math.floor(Math.random() * 10)
        )
        .setScale(0.625);
      this.scene.add.text(worldXY.x, worldXY.y, `${tileXY.x},${tileXY.y}`).setOrigin(0.5);
    }

    this.setInteractive().on('tiledown', (pointer, tileXY) => {
      // console.log(`${tileXY.x},${tileXY.y}`);
    });

    return this;
  }

  getTileXYArray() {
    return this.tileXYArray;
  }

  displayTileOutline(display) {
    this.tileOutline.setVisible(display);
  }
}
