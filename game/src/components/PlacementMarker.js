import { Shape } from 'phaser3-rex-plugins/plugins/board-components.js';
import { Constants } from '../utils/constants'; 

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
      onClick(this.card, this.tileXY);
    }, this);
  }

  getTileXY() {
    return this.tileXY;
  }
}