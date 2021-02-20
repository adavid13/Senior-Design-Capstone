import Phaser from 'phaser';
import { Events } from '../components/EventCenter';
import { Constants } from '../utils/constants';
import { convertIntegerColorToString } from '../utils/color';
// import Overlay from '../components/ui/Overlay';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Label from '../components/ui/Label';
import RoundBackground from '../components/ui/RoundBackground';
import MenuDialog from '../components/ui/MenuDialog';
import EndGameDialog from '../components/ui/EndGameDialog';
import OptionsDialog from '../components/ui/OptionsDialog';

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
    this.onMainMenuClick = initParams.onMainMenuClick;
    // this.onCloseClick = initParams.onCloseClick;
    this.onRestartClick = initParams.onRestartClick;
    this.onUndoClick = initParams.onUndoClick;
    this.onEndTurnClick = initParams.onEndTurnClick;
    this.onPieceSelection = initParams.onPieceSelection;
    this.randomAction = initParams.randomAction;
    this.interfaceModel = initParams.interfaceModel;
    this.difficulty = initParams.difficulty;
  }

  create() {
    this.pieces = [];
    this.markers = [];
    this.selectedCard = undefined;
    this.handleEndTurnClick = this.handleEndTurnClick.bind(this);
    this.openOptionsDialog = this.openOptionsDialog.bind(this);
    this.openMenuDialog = this.openMenuDialog.bind(this);
    this.concede = this.concede.bind(this);
    
    // Buttons
    this.createMenuButton();
    this.createEndTurnButton();
    this.createUndoButton();

    // Turn change text
    this.createTextBackground();
    this.createTurnText();

    // Others
    this.createTimerLabel();
    this.timedEvent = this.time.addEvent({ delay: this.interfaceModel.getPlayerTimerinSec() * 1000, callback: this.timeIsUp, callbackScope: this });
    this.playerTimer = this.getPlayerTimer();
    this.createNotificationSystem();
    this.createPlayerOverlay();
    this.populatePlayerHand();
        // this.overlay = new Overlay(this, 0.3).setVisible(false);

    // Dialogs
    this.createMenuDialog();
    this.createOptionsDialog();
    this.createEndGameDialog();

    // Events    
    Events.on('piece-added', () => {
      this.enableButtons(true);
    }, this);

    Events.on('piece-moved', () => {
      this.enableButtons(this.interactionModel.commands.length > 0);
    }, this);

    Events.on('alert', this.alert, this);
    this.input.setTopOnly(true);

    this.animateEndTurn();
  }

  update() {
    const countdown = this.playerTimer / 1000 - Math.floor(this.timedEvent.getElapsedSeconds());
    this.timer.changeText(this.formatTime(countdown));
    this.timedEvent.getElapsedSeconds();
  }

  formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds.toString().padStart(2,'0');
    return `${minutes}:${seconds}`;
  }

  createMenuButton() {
    this.btnMenu = new Button(this, 100, 30, 'Menu', 22,
      'center', 180, 10, Constants.Color.GREY, this.openMenuDialog);
  }

  createEndTurnButton() {
    this.btnEndTurn = new Button(this, Constants.Window.WIDTH - 110, Constants.Window.HEIGHT - 30,
      'End Turn', 22, 'center', 180, 10, Constants.Color.GREY, this.handleEndTurnClick
    )
      .setButtonEnable(false);
  }

  createUndoButton() {
    const onClick = () => {
      const commandStack = this.onUndoClick();
      if (commandStack.length === 0) {
        this.enableButtons(false);
      }  
    };

    this.btnUndo = new Button(this, 100, Constants.Window.HEIGHT - 30, 'Undo',
      22, 'center', 180, 10, Constants.Color.GREY, onClick)
      .setButtonEnable(false);
  }

  createTurnText() {
    this.turnText = this.add
      .text(-500, Constants.Window.HEIGHT / 2, 'Player Turn', { fontFamily: '"Bungee"', fontSize: 55, color: '#ffffff' })
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

  createTimerLabel() {
    this.timer = new Label(this, Constants.Window.WIDTH - 110, 30, '00:00', 22, 'center', 180, 10, Constants.Color.GREY);
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
      background: new RoundBackground(this, 0, 0, 2, 2, 20),
      text: this.add.text(0, 0, '', { fontFamily: '"Bungee"', fontSize: '18px', fill: toastTextColor })
        .setShadow(2, 2, '#000000', 2, false, true),
      space: { top: 20, right: 20, bottom: 20, left: 20 },
      duration: { in: 200, hold: 2500, out: 200 },
    });
  }

  createMenuDialog() {
    const closeDialog = () => {
      this.menuDialog.hideDialog();
      // this.onCloseClick();
    };
    this.menuDialog = new MenuDialog(this, this.openOptionsDialog, this.concede, closeDialog)
      .setVisible(false);
  }

  createOptionsDialog() {
    this.optionsDialog = new OptionsDialog(this, this.interfaceModel, () => {
      this.interfaceModel.confirmChanges();
      this.optionsDialog.hideDialog();
    });
    this.optionsDialog.hideDialog();
  }

  createEndGameDialog() {
    this.dialog = new EndGameDialog(this, this.onRestartClick, this.onMainMenuClick)
      .setVisible(false);
  }

  openEndGameDialog(condition) {
    // TODO: remove onmenuclick
    this.onMenuClick();
    this.dialog.changeTile(condition);
    this.dialog.changeImage(condition);
    this.dialog.showDialog();
  }

  openMenuDialog() {
    // TODO: remove onmenuclick
    this.onMenuClick();
    this.menuDialog.showDialog();
  }

  openOptionsDialog() {
    this.menuDialog.hideDialog();
    this.optionsDialog.showDialog();
  }

  concede() {
    this.openEndGameDialog('defeat');
    this.enableButtons(false);
    this.btnMenu.setButtonEnable(false);
    this.stopTimer();
    this.onEndTurnClick(true);
  }

  alert(message) {
    if (!this.toast.player.isPlaying)
      this.toast.show(message);
  }

  timeIsUp() {
    if (this.interactionModel.commands.length === 0) {
      this.randomAction(this.getAllCardsNotPlayed());
    }
    this.alert('Time\'s up! Your turn is going to be skipped.');
    this.endTurnWithDelay();   
  }

  getPlayerTimer() {
    const { playerTurn } = this.interactionModel;
    if (playerTurn.getPlayerType() === Constants.PlayerType.AI) {
      return this.interfaceModel.getAiTimer(this.difficulty);
    } else {
      return this.interfaceModel.getPlayerTimerinSec() * 1000;
    }
  }

  getAllCardsNotPlayed() {
    return this.pieces.filter(piece => { return !piece.isOnBoard; });
  }

  resetTimer() {
    this.playerTimer = this.getPlayerTimer();
    this.timedEvent = this.time.addEvent({
      delay: this.getPlayerTimer(),
      callback: this.timeIsUp,
      callbackScope: this
    });
  }

  stopTimer() {
    this.timedEvent.remove(false);
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
    const turnResult = this.onEndTurnClick(false);
    switch (turnResult) {
      case Constants.Turn.NEXT_TURN:
        this.stopTimer();
        this.enableButtons(false);
        this.animateEndTurn();
        this.swapOverlay(this.interactionModel.playerTurn.getNumber());
        this.resetTimer();
        break;
      case Constants.Turn.SKIP_TURN:
        this.stopTimer();
        this.enableButtons(false);
        this.animateEndTurn();
        this.swapOverlay(this.interactionModel.playerTurn.getNumber());
        this.resetTimer();
        this.alert('You can\'t make any moves this turn.\nYou turn was skipped.');
        setTimeout(this.handleEndTurnClick, 3000);
        break;
      case Constants.Turn.NEED_KING:
        this.alert('You must play the king in this turn.\nUndo your previous action.');
        break;
      case Constants.Turn.VICTORY:
        this.stopTimer();
        this.openEndGameDialog('victory');
        this.enableButtons(false);
        this.btnMenu.setButtonEnable(false);
        break;
      case Constants.Turn.DEFEAT:
        this.stopTimer();
        this.openEndGameDialog('defeat');
        this.enableButtons(false);
        this.btnMenu.setButtonEnable(false);
        break;
      default:
        break;
    }
  }

  enableButtons(enable) {
    if (!enable || this.interactionModel.playerTurn.getPlayerType() !== Constants.PlayerType.AI) {
      this.btnEndTurn.setButtonEnable(enable);
      this.btnUndo.setButtonEnable(enable);
    }
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

  endTurnWithDelay() {
    setTimeout(() => { this.handleEndTurnClick(false); }, 2000);
  }
}
