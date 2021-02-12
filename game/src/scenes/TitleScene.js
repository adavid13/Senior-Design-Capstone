import Phaser from 'phaser';
import OptionsDialog from '../components/ui/OptionsDialog';
import Button from '../components/ui/Button';
import InterfaceModel from '../components/model/InterfaceModel';
// import Overlay from '../components/ui/Overlay';
import { Constants } from '../utils/constants';

const sceneConfig = {
  key: Constants.Scenes.TITLE,
};

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  create() {
    this.interfaceModel = new InterfaceModel();
    this.cameras.main.backgroundColor = Phaser.Display.Color.IntegerToColor(Constants.Color.GREY);
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'titlegrey');
    
    this.btnStartGame = this.createButton(50, this.scale.height / 2, 'New game', () => {
      this.startScene(Constants.Scenes.DIFFICULTY, { interfaceModel: this.interfaceModel });
    });

    this.btnOptions = this.createButton(50, this.scale.height / 2 + 100, 'Options', () => {
      this.openOptionsDialog();
    });

    this.btnCredits = this.createButton(50, this.scale.height / 2 + 200, 'Credits', () => {
      this.startScene(Constants.Scenes.CREDITS);
    });

    // this.overlay = new Overlay(this, 0.3);
    this.optionsDialog = new OptionsDialog(this, this.interfaceModel, () => {
      this.interfaceModel.confirmChanges();
      this.closeOptionsDialog();
    });
    this.closeOptionsDialog();
    this.input.setTopOnly(true);
  }

  createButton(x, y, text, onClick) {
    const button = new Button(this, x, y, text, 60, 'left', 400, 10, Constants.Color.GREY, onClick);
    button.setOrigin(0, 0.5);
    button.layout();
    return button;
  }

  startScene(targetScene, params) {
    this.scene.start(targetScene, params);
  }

  openOptionsDialog() {
    // this.overlay.setVisible(true);
    this.optionsDialog.showDialog();
  }

  closeOptionsDialog() {
    // this.overlay.setVisible(false);
    this.optionsDialog.hideDialog();
  }
}
