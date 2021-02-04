import Phaser from 'phaser';
import { Constants } from '../utils/constants';

const sceneConfig = {
  key: Constants.Scenes.DIFFICULTY,
};

export default class DifficultyScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  create() {
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor('#69696c');
    this.titleText = this.add.text(this.scale.width / 2, this.scale.height / 3, 'Select the difficulty', {
      fontFamily: '"Bungee"',
      fontSize: '64px',
      fill: '#fff',
    });
    this.titleText
      .setOrigin(0.5)
      .setShadow(5, 5, '#000000', 5, false, true);

    this.btnBeginner = this.createButton(this.scale.width / 4, this.scale.height / 2, 'Beginner');

    this.btnBeginner.onClick().subscribe(() => {
      this.startScene(Constants.Scenes.CONTROLLER, {
        difficulty: Constants.Difficulty.BEGINNER,
      });
    });

    this.btnIntermediate = this.createButton(this.scale.width / 2, this.scale.height / 2, 'Intermediate');

    this.btnIntermediate.onClick().subscribe(() => {
      this.startScene(Constants.Scenes.CONTROLLER, {
        difficulty: Constants.Difficulty.INTERMEDIATE,
      });
    });

    this.btnAdvanced = this.createButton((this.scale.width * 3) / 4, this.scale.height / 2, 'Advanced');

    this.btnAdvanced.onClick().subscribe(() => {
      this.startScene(Constants.Scenes.CONTROLLER, {
        difficulty: Constants.Difficulty.ADVANCED,
      });
    });
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

  startScene(targetScene, params) {
    this.scene.start(targetScene, params);
  }
}
