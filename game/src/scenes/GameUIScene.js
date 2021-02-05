import Phaser from 'phaser';
import { Events } from '../components/EventCenter';
import Card from '../components/ui/Card';
import { Constants } from '../utils/constants';
import { convertIntegerColorToString } from '../utils/color';

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
    this.handleEndTurnClick = this.handleEndTurnClick.bind(this);
        
    this.createMenuButton();
    this.createEndTurnButton();
    this.createUndoButton();
    this.createTextBackground();
    this.createTurnText();
    this.createNotificationSystem();
    this.createDialog();
    this.createPlayerOverlay();
    
    this.populatePlayerHand();

    this.animateEndTurn();

    Events.on('piece-added', () => {
      this.enableButtons(true);
    }, this);

    Events.on('piece-moved', () => {
      this.enableButtons(this.interactionModel.commands.length > 0);
    }, this);

    Events.on('alert', this.alert, this);
  }

  createButton(x, y, text) {
    return this.add
      .buttonContainer(x, y, 'image',
        { texture: 'btnBlue', tint: Constants.Color.WHITE },
        { style: { color: 'white', fontFamily: '"Bungee"', fontSize: '20px' } })
      .setDownTexture('btnBluePressed')
      .setOverTint(Constants.Color.ORANGE)
      .setText(text);
  }

  createMenuButton() {
    this.btnMenu = this.createButton(100, 30, 'Main Menu');
    this.btnMenu.onClick().subscribe(this.onMenuClick);
  }

  createEndTurnButton() {
    this.btnEndTurn = this.createButton(Constants.Window.WIDTH - 110, Constants.Window.HEIGHT - 30, 'End Turn');
    this.btnEndTurn.setDisabled(true)
      .onClick().subscribe(this.handleEndTurnClick);
  }

  createUndoButton() {
    this.btnUndo = this.createButton(100, Constants.Window.HEIGHT - 30, 'Undo');
    this.btnUndo.setDisabled(true)
      .onClick().subscribe(() => {
        const commandStack = this.onUndoClick();
        if (commandStack.length === 0) {
          this.enableButtons(false);
        }
      });
  }

  createTurnText() {
    this.turnText = this.add
      .text(-500, Constants.Window.HEIGHT / 2, 'Player Turn', { fontFamily: '"Bungee"', fontSize: 60, color: '#ffffff' })
      .setShadow(5, 5, '#000000', 5, false, true)
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
      .image(width / 2, height, 'borderp1')
      .setOrigin(0.5, 1)
      .setScale(0.3);

    this.player2Border = this.add
      .image(width / 2, 0, 'border')
      .setRotation(Math.PI)
      .setOrigin(0.5, 1)
      .setScale(0.3);

    this.p1Pipeline = this.plugins.get('rexGrayScalePipeline').add(this.player1Border);
    this.p1Pipeline.intensity = 0;
    this.p2Pipeline = this.plugins.get('rexGrayScalePipeline').add(this.player2Border);
  }

  createNotificationSystem() {
    const toastTextColor = convertIntegerColorToString(Constants.Color.WHITE);
    this.toast = this.rexUI.add.toast({
      x: Constants.Window.WIDTH / 2,
      y: Constants.Window.HEIGHT * 4 / 5,
      background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, Constants.Color.GREY),
      text: this.add.text(0, 0, '', { fontFamily: '"Bungee"', fontSize: '22px', fill: toastTextColor })
        .setShadow(2, 2, '#000000', 2, false, true),
      space: { top: 20, right: 20, bottom: 20, left: 20 },
      duration: { in: 200, hold: 2500, out: 200 },
    });
  }

  createDialog() {
    const textColor = convertIntegerColorToString(Constants.Color.WHITE);
    this.dialog = this.rexUI.add.dialog({
      x: Constants.Window.WIDTH / 2,
      y: Constants.Window.HEIGHT / 2,
      width: 400,
      background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, Constants.Color.GREY),
      content: this.rexUI.add.label({
        width: 40,
        height: 40,
        text: this.add.text(0, 0, '', { fontFamily: '"Bungee"', fontSize: '22px', fill: textColor }),
        space: { top: 20, right: 20, bottom: 20, left: 20 } 
      })
    })
      .layout()
      .setVisible(false);
  }

  openDialog(condition) {
    this.dialog.getElement('content').setText(condition);
    this.dialog.setVisible(true).popUp(1000);
    this.tweens.add({
      targets: this.dialog,
      scaleX: 1,
      scaleY: 1,
      ease: 'Bounce',
      duration: 1000,
      repeat: 0,
      yoyo: false
    });
  }

  alert(message) {
    this.toast.show(message);
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

  handleEndTurnClick() {
    const turnResult = this.onEndTurnClick();
    switch (turnResult) {
      case Constants.Turn.NEXT_TURN:
        this.enableButtons(false);
        this.animateEndTurn();
        this.swapOverlay(this.interactionModel.playerTurn.getNumber());
        break;
      case Constants.Turn.SKIP_TURN:
        this.enableButtons(false);
        this.animateEndTurn();
        this.swapOverlay(this.interactionModel.playerTurn.getNumber());
        this.alert('You can\'t make any moves this turn.\nYou turn will be skipped.');
        setTimeout(this.handleEndTurnClick, 3000);
        break;
      case Constants.Turn.NEED_KING:
        this.alert('You must play the king in this turn.\nUndo your previous action.');
        break;
      case Constants.Turn.VICTORY:
        this.openDialog('VICTORY!');
        this.enableButtons(false);
        break;
      case Constants.Turn.DEFEAT:
        this.openDialog('DEFEAT!');
        this.enableButtons(false);
        break;
      default:
        break;
    }
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
      return new Card(this, player, x, height - 10, type, false, this.onPieceSelection).setEnabled();
    }
    if (player.getNumber() === 2) {
      return new Card(this, player, x, 10, type, true, this.onPieceSelection).setDisabled();
    }
  }

  swapOverlay(player) {
    if (player === 1) {
      this.tweens.add({
        targets: this.p1Pipeline,
        intensity: 0,
        yoyo: false,
        repeat: 0
      });
      this.tweens.add({
        targets: this.p2Pipeline,
        intensity: 1,
        yoyo: false,
        repeat: 0
      });
      this.pieces.forEach(piece => {
        if (piece.getPlayer().getNumber() === 1) {
          piece.setEnabled();
        } else {
          piece.setDisabled();
        }
      });
    } else {
      this.tweens.add({
        targets: this.p1Pipeline,
        intensity: 1,
        yoyo: false,
        repeat: 0
      });
      this.tweens.add({
        targets: this.p2Pipeline,
        intensity: 0,
        yoyo: false,
        repeat: 0
      });
      this.pieces.forEach(piece => {
        if (piece.getPlayer().getNumber() === 2) {
          piece.setEnabled();
        } else {
          piece.setDisabled();
        }
      });
    }
  }
}
