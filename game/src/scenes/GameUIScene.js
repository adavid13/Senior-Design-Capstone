import Phaser from 'phaser';
import { Events } from '../components/EventCenter';
import Card from '../components/ui/Card';
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
    this.onMenuClick = initParams.onMenuClick;
    this.onUndoClick = initParams.onUndoClick;
    this.onEndTurnClick = initParams.onEndTurnClick;
    this.onPieceSelection = initParams.onPieceSelection;
  }

  create() {
    this.input.setTopOnly(true);
    this.pieces = [];
    this.markers = [];
    this.selectedCard = undefined;
    
    this.createMenuButton();
    this.createEndTurnButton();
    this.createUndoButton();
    this.createTextBackground();
    this.createTurnText();

    this.createPlayerOverlay();
    this.populatePlayerHand();

    this.animateEndTurn();

    Events.on('piece-added', () => {
      this.enableButtons(true);
    }, this);

    Events.on('piece-moved', () => {
      this.enableButtons(this.interactionModel.commands.length > 0);
    }, this);
  }

  createMenuButton() {
    this.btnMenu = this.add
      .buttonContainer(100, 30, 'btnBlue', Constants.Color.WHITE)
      .setDownTexture('btnBluePressed')
      .setOverTint(Constants.Color.ORANGE)
      .setText('Main Menu');

    this.btnMenu.onClick().subscribe(this.onMenuClick);
  }

  createEndTurnButton() {
    this.btnEndTurn = this.add
      .buttonContainer(Constants.Window.WIDTH - 110, Constants.Window.HEIGHT - 30, 'btnBlue', Constants.Color.WHITE)
      .setDownTexture('btnBluePressed')
      .setOverTint(Constants.Color.ORANGE)
      .setText('End Turn')
      .setDisabled(true);

    this.btnEndTurn.onClick().subscribe(() => {
      this.onEndTurnClick();
      this.enableButtons(false);
      this.animateEndTurn();
    });
  }

  createUndoButton() {
    this.btnUndo = this.add
      .buttonContainer(100, Constants.Window.HEIGHT - 30, 'btnBlue', Constants.Color.WHITE)
      .setDownTexture('btnBluePressed')
      .setOverTint(Constants.Color.ORANGE)
      .setText('Undo')
      .setDisabled(true);

    this.btnUndo.onClick().subscribe(() => {
      const commandStack = this.onUndoClick();
      if (commandStack.length === 0) {
        this.enableButtons(false);
      }
    });
  }

  createTurnText() {
    this.turnText = this.add
      .text(-500, Constants.Window.HEIGHT / 2, 'Player Turn', { fontSize: 60, color: '#ffffff' , fontStyle: 'bold' })
      .setOrigin(0.5);
  }

  createTextBackground() {
    this.textBackground = this.add.graphics({ fillStyle: { color: Constants.Color.GREY, alpha: 1 }});
    this.textBackground.fillRectShape(
      new Phaser.Geom.Rectangle(0, Constants.Window.HEIGHT / 3,  Constants.Window.WIDTH, Constants.Window.HEIGHT / 3)
    );
    this.textBackground.setAlpha(0);
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

  animateEndTurn() {
    if (this.interactionModel.playerTurn.getNumber() === 1) {
      this.turnText.setText('Your Turn');
    } else {
      this.turnText.setText("Opponent's Turn");
    }
    

    this.turnText.setX(-500);
    const timeline = this.tweens.createTimeline();
    timeline.add({
      targets: this.turnText,
      x: Constants.Window.WIDTH / 2,
      duration: 600,
      ease: 'Quint.easeOut',
      delay: 400
    });
    timeline.add({
      targets: this.turnText,
      x: Constants.Window.WIDTH + 300,
      duration: 600,
      ease: 'Quint.easeOut',
      delay: 400
    });
    timeline.play();

    const backgroundTimeLine = this.tweens.createTimeline();
    backgroundTimeLine.add({
      targets: this.textBackground,
      alpha: 0.9,
      duration: 600,
      ease: 'Quint.easeOut',
      yoyo: true,
      delay: 400
    });
    backgroundTimeLine.play();
  }

  enableButtons(enable) {
    this.btnEndTurn.setDisabled(!enable);
    this.btnUndo.setDisabled(!enable);
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
      return new Card(this, player, x, height - 10, type, false, this.onPieceSelection);
    }
    if (player.getNumber() === 2) {
      return new Card(this, player, x, 10, type, true, this.onPieceSelection);
    }
  }
}
