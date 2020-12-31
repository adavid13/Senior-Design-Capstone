import { Shape } from 'phaser3-rex-plugins/plugins/board-components.js';

const COLOR2_LIGHT = 0xff5c8d;
const COLOR2_DARK = 0xa00037;

export default class MoveableMarker extends Shape {
  constructor(chess, tileXY) {
      var board = chess.rexChess.board;
      var scene = board.scene;
      // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
      super(board, tileXY.x, tileXY.y, -1, COLOR2_DARK);
      scene.add.existing(this);
      this.setScale(0.5);

      // on pointer down, move to this tile
      this.on('board.pointerdown', function () {
          if (!chess.moveToTile(this)) {
              return;
          }
          this.setFillStyle(COLOR2_LIGHT);
      }, this);
  }
}