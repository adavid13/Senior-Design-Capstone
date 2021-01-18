import Phaser from 'phaser';
import { Events } from '../components/EventCenter';
import Card from '../components/ui/Card';
import PlacementMarker from '../components/PlacementMarker';
import { Constants } from '../utils/constants';

const sceneConfig = {
  key: Constants.Scenes.GAMEUI,
};

export default class GameUIScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  init(initParams) {
    this.players = initParams.players;
    this.board = initParams.board;
    this.interactionModel = initParams.interactionModel;
  }

  create() {
    this.input.setTopOnly(true);
    this.pieces = [];
    this.markers = [];
    this.selectedCard = undefined;
    this.handleCardSelection = this.handleCardSelection.bind(this);
    this.handlePiecePlacement = this.handlePiecePlacement.bind(this);
    
    this.createMenuButton();
    this.createPlayerOverlay();
    this.populatePlayerHand();

    Events.on('piece-selected', this.clearSelection, this);
  }

  createMenuButton() {
    this.btnMenu = this.add
      .buttonContainer(100, 30, 'btnBlue', Constants.Color.WHITE)
      .setDownTexture('btnBluePressed')
      .setOverTint(Constants.Color.ORANGE)
      .setText('Main Menu');

    this.btnMenu.onClick().subscribe(() => {
      this.startScene(Constants.Scenes.TITLE);
    });
  }

  createPlayerOverlay() {
    const { width, height } = this.sys.game.canvas;
    this.player1Border = this.add
      .image(width / 2, height, 'border')
      .setOrigin(0.5, 1)
      .setScale(0.3);


    this.player2Border = this.add
      .image(width / 2, 0, 'border')
      .setRotation(Math.PI)
      .setOrigin(0.5, 1)
      .setScale(0.3);
  }

  populatePlayerHand() {
    const XOffset = 287;

    for (const player of this.players) {
      let x = XOffset;
      const playerPieces = player.getPiecesInHand();
      Object.entries(playerPieces).forEach(([type, value]) => {
        for (let i = 0; i < value; i++) {
          this.pieces.push(this.createPiece(player, x, type));
          x += 45;
        }
      });
    }
  }

  createPiece(player, x, type) {
    const { height } = this.sys.game.canvas;
    
    if (player.getNumber() === 1) {
      return new Card(this, player, x, height - 10, type, false, this.handleCardSelection);
    }

    if (player.getNumber() === 2) {
      return new Card(this, player, x, 10, type, true, this.handleCardSelection);
    }
  }

  handleCardSelection(selectedCard) {
    this.clearSelection();

    // Check if selected cart belongs to the player that has the turn.
    if (selectedCard && this.interactionModel.playerTurn === selectedCard.getPlayer()) {
      this.selectedCard = selectedCard;
      this.selectedCard.setSelected(true);
      Events.emit('card-selected');
      const allowedTiles = this.board.showInitialPlacementPositions(selectedCard.getPlayer());
      this.showMoveableArea(allowedTiles, selectedCard);
    }
  }

  handlePiecePlacement() {
    this.handleCardSelection(undefined);
    this.interactionModel.changePlayerTurn();
  }

  showMoveableArea(allowedTiles, selectedCard) {
    this.hideMoveableArea();
    for (let i = 0, cnt = allowedTiles.length; i < cnt; i++) {
      const fillColor = this.interactionModel.playerTurn === selectedCard.getPlayer() ? Constants.Color.DARK_RED : Constants.Color.GREY;
      this.markers.push(new PlacementMarker(this.board, allowedTiles[i], selectedCard, this.handlePiecePlacement, fillColor));
    }
    return this;
  }

  hideMoveableArea() {
    for (let i = 0, cnt = this.markers.length; i < cnt; i++) {
      this.markers[i].destroy();
    }
    this.markers.length = 0;
    return this;
  }

  clearSelection() {
    for (const piece of this.pieces) {
      piece.setSelected(false);
    }
    this.hideMoveableArea();
  }

  startScene(targetScene) {
    this.scene.stop(Constants.Scenes.GAMEUI);
    this.gameScene = this.scene.get(Constants.Scenes.GAME);
    this.gameScene.scene.start(targetScene);
  }
}
