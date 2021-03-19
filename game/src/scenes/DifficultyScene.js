import Phaser from 'phaser';
import ImageButton from '../components/ui/ImageButton';
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

    this.btnBeginner = this.createButton(this.scale.width / 4, this.scale.height * 3 / 5, 'Beginner', 'pig', () => {
      this.startScene(Constants.Scenes.CONTROLLER, {
        difficulty: Constants.Difficulty.BEGINNER,
        interfaceModel: this.interfaceModel,
      });
    });

    this.btnIntermediate = this.createButton(this.scale.width / 2, this.scale.height * 3 / 5, 'Intermediate', 'king', () => {
      this.startScene(Constants.Scenes.CONTROLLER, {
        difficulty: Constants.Difficulty.INTERMEDIATE,
        interfaceModel: this.interfaceModel,
      });
    });

    this.btnAdvanced = this.createButton((this.scale.width * 3) / 4, this.scale.height * 3 / 5, 'Advanced', 'skeleton', () => {
      this.startScene(Constants.Scenes.CONTROLLER, {
        difficulty: Constants.Difficulty.ADVANCED,
        interfaceModel: this.interfaceModel,
      });
    });
  }

  createButton(x, y, text, texture, onClick) {
    return new ImageButton(this, x, y, text, 22, 'right', 180, 10,
      Constants.Color.GREY_DARK, onClick, this.interfaceModel,
      { iconObject: this.add.image(0, 0, texture).setDepth(Constants.GameObjectDepth.UI), orientation: 'y' });
  }

  startScene(targetScene, params) {
    this.scene.start(targetScene, params);
    this.sound.removeByKey('theme');
  }
}
