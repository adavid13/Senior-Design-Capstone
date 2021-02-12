import { Shape } from 'phaser3-rex-plugins/plugins/board-components.js';
import { Constants } from '../utils/constants'; 

export default class MoveableMarker extends Shape {
  constructor(chess, tileXY, disabled) {
    const board = chess.rexChess.board;
    const scene = board.scene;
    const fillColor = disabled ? Constants.Color.GREY : Constants.Color.DARK_RED;
    super(board, tileXY.x, tileXY.y, 'markerLayer', fillColor);
    scene.add.existing(this);
    this.setScale(0.5);
    this.setDepth(Constants.GameObjectDepth.MARKER);
    this.chess = chess;
    this._tileXY = tileXY;
  }

  get parentPiece() {
    return this.chess;
  }

  get tileXY() {
    return this._tileXY;
  }
}