import { Shape } from 'phaser3-rex-plugins/plugins/board-components.js';

const COLOR2_DARK = 0xa00037;

export default class MoveableMarker extends Shape {
  constructor(chess, tileXY) {
    const board = chess.rexChess.board;
    const scene = board.scene;
    super(board, tileXY.x, tileXY.y, 'markerLayer', COLOR2_DARK);
    scene.add.existing(this);
    this.setScale(0.5);
    this.setDepth(6);
    this.chess = chess;
    this.tileXY = tileXY;
  }

  getParentPiece() {
    return this.chess;
  }

  getTileXY() {
    return this.tileXY;
  }
}