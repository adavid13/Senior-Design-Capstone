import { Shape } from 'phaser3-rex-plugins/plugins/board-components.js';
import { Constants } from '../utils/constants'; 

export default class MoveableMarker extends Shape {
  constructor(chess, tileXY) {
    const board = chess.rexChess.board;
    const scene = board.scene;
    super(board, tileXY.x, tileXY.y, 'markerLayer', Constants.Color.DARK_RED);
    scene.add.existing(this);
    this.setScale(0.5);
    this.setDepth(Constants.GameObjectDepth.MARKER);
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