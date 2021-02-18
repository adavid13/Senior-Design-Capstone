import Phaser from 'phaser';
import Button from '../components/ui/Button';
import { Constants } from '../utils/constants';

const sceneConfig = {
  key: Constants.Scenes.DIFFICULTY,
};

export default class DifficultyScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  init(initParams) {
    this.interfaceModel = initParams.interfaceModel;
  }

  create() {
    
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor('#69696c');
    this.titleText = this.add.text(this.scale.width / 2, this.scale.height / 3, 'Select the difficulty', {
      fontFamily: '"Bungee"',
      fontSize: '55px',
      fill: '#fff',
    });
    this.titleText
      .setOrigin(0.5)
      .setShadow(5, 5, '#000000', 5, false, true);

    this.btnBeginner = this.createButton(this.scale.width / 4, this.scale.height / 2, 'Beginner', () => {
      this.startScene(Constants.Scenes.CONTROLLER, {
        difficulty: Constants.Difficulty.BEGINNER,
        interfaceModel: this.interfaceModel,
      });
    });

    this.btnIntermediate = this.createButton(this.scale.width / 2, this.scale.height / 2, 'Intermediate', () => {
      this.startScene(Constants.Scenes.CONTROLLER, {
        difficulty: Constants.Difficulty.INTERMEDIATE,
        interfaceModel: this.interfaceModel,
      });
    });

    this.btnAdvanced = this.createButton((this.scale.width * 3) / 4, this.scale.height / 2, 'Advanced', () => {
      this.startScene(Constants.Scenes.CONTROLLER, {
        difficulty: Constants.Difficulty.ADVANCED,
        interfaceModel: this.interfaceModel,
      });
    });
  }

  createButton(x, y, text, onClick) {
    return new Button(this, x, y, text, 22, 'center', 180, 10, Constants.Color.GREY_DARK, onClick);
  }

  startScene(targetScene, params) {
    this.scene.start(targetScene, params);
  }
}
