import Phaser from 'phaser';
import { Constants } from '../../utils/constants';
import { getPieceTexture } from '../../utils/piecesUtils';

export default class Card extends Phaser.GameObjects.Container {
  background;
  pieceTexture;

  constructor(scene, player, x, y, type, rotated, onPieceSelected) {
    super(scene, x, y);
    this.scene = scene;
    this.rotated = rotated;
    this.originalX = x;
    this.originalY = y;
    this.player = player;
    this.type = type;
    this.pieceTexture = getPieceTexture(type, player.getFaction());

    this.onPieceSelected = (piece) => {
      onPieceSelected(piece);
    };

    this.background = this.scene.add
      .sprite(0, 0, 'card', 0)
      .setOrigin(0.5, 1)
      .setScale(0.2);

    this.pieceTexture = this.scene.add
      .image(0, -54, this.pieceTexture)
      .setOrigin(0.5)
      .setScale(0.275);

    if (rotated) {
      this.background.setRotation(Math.PI);
      this.pieceTexture.setOrigin(0.5).setY(53);
    }

    this.add(this.background);
    this.add(this.pieceTexture);
    scene.add.existing(this);

    this.background.setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleUp, this)
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.handleOut, this)
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, this.handleOver, this);
  }

  getPlayer() {
    return this.player;
  }

  getType() {
    return this.type;
  }

  getFaction() {
    return this.player.getFaction();
  }

  setSelected(isSelected) {
    this.selected = isSelected;
    if (isSelected) {
      this.background.setTint(Constants.Color.YELLOW_HIGHLIGHT);
      this.pieceTexture.setTint(Constants.Color.YELLOW_HIGHLIGHT);
      if (this.rotated) {
        this.setY(this.y + 10);
      } else {
        this.setY(this.y - 10);
      }
    } else {
      this.background.setTint(Constants.Color.WHITE);
      this.pieceTexture.setTint(Constants.Color.WHITE);
      this.setY(this.originalY);
    }
  }

  handleOver(pointer) {
    if (!this.selected) {
      if (this.rotated) {
        this.setY(this.y + 10);
      } else {
        this.setY(this.y - 10);
      }
    }
  }

  handleOut(pointer) {
    if (!this.selected) {
      this.setY(this.originalY);
    }
  }

  handleUp(pointer) {
    if (this.selected) {
      this.onPieceSelected(null);
    } else {
      this.onPieceSelected(this);
    }
  }
}