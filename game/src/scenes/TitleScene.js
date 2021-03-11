import Phaser from 'phaser';
import OptionsDialog from '../components/ui/OptionsDialog';
import CreditsDialog from '../components/ui/CreditsDialog';
import Button from '../components/ui/Button';
import Overlay from '../components/ui/Overlay';
import { Constants } from '../utils/constants';

const sceneConfig = {
  key: Constants.Scenes.TITLE,
};

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  init(initParams) {
    this.interfaceModel = initParams.interfaceModel;
  }

  create() {
    this.cameras.main.backgroundColor = Phaser.Display.Color.IntegerToColor(Constants.Color.GREY);
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'titlegrey');

    this.createBackgroundMusic();
    this.createButtonSound();
    
    this.btnStartGame = this.createButton(50, this.scale.height / 2, 'New game', () => {
      this.startScene(Constants.Scenes.DIFFICULTY, { interfaceModel: this.interfaceModel });
    });

    this.btnOptions = this.createButton(50, this.scale.height / 2 + 80, 'Options', () => {
      this.openDialog(this.optionsDialog);
    });

    this.btnCredits = this.createButton(50, this.scale.height / 2 + 160, 'Credits', () => {
      this.openDialog(this.creditsDialog);
    });

    this.overlay = new Overlay(this, 0.3);
    this.optionsDialog = new OptionsDialog(this, [this.music], this.interfaceModel, () => {
      this.interfaceModel.confirmChanges();
      this.closeDialog(this.optionsDialog);
    }, () => {
      this.closeDialog(this.optionsDialog);
    });
    this.closeDialog(this.optionsDialog);

    this.creditsDialog = new CreditsDialog(this, [this.music], this.interfaceModel, () => {
      this.closeDialog(this.creditsDialog);
    });
    this.closeDialog(this.creditsDialog);

    this.input.setTopOnly(true);
  }

  createButton(x, y, text, onClick) {
    const button = new Button(this, x, y, text, 55, 'left', 400, 10, Constants.Color.GREY, onClick, this.interfaceModel);
    button.setOrigin(0, 0.5);
    button.layout();
    return button;
  }

  createBackgroundMusic() {
    this.music = this.sound.add('theme');
    this.music.setVolume(this.interfaceModel.musicLevel);
    this.music.play();
  }

  createButtonSound() {
    this.btnHoverSound = this.sound.add('button-hover');
    this.btnClickSound = this.sound.add('button-click');
  }

  startScene(targetScene, params) {
    this.scene.start(targetScene, params);
  }

  openDialog(dialog) {
    this.overlay.setVisible(true);
    dialog.showDialog();
  }

  closeDialog(dialog) {
    this.overlay.setVisible(false);
    dialog.hideDialog();
  }
}
