import { Shape } from 'phaser3-rex-plugins/plugins/board-components.js';
import { Constants } from '../utils/constants'; 
import { createPiece } from './PieceFactory';

export default class PlacementMarker extends Shape {
  constructor(board, tileXY, card, onClick) {
    const scene = board.scene;
    super(board, tileXY.x, tileXY.y, 'markerLayer', Constants.Color.DARK_RED);
    scene.add.existing(this);
    this.setScale(0.5);
    this.setDepth(Constants.GameObjectDepth.MARKER);
    this.tileXY = tileXY;
    this.card = card;
    this.board = board;
    this.setInteractive();
    this.on('pointerdown', () => {
      onClick();
      this.onPiecePlacement();
    }, this);
  }

  getTileXY() {
    return this.tileXY;
  }

  onPiecePlacement() {
    const type = this.card.getType();
    const player = this.card.getPlayer();
    const faction = this.card.getFaction();
    createPiece(type, { board: this.board, player, tileXY: this.tileXY, faction });
  }
}