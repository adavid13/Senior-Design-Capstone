import Phaser from 'phaser';
import { Constants } from '../utils/constants';

const sceneConfig = {
  key: Constants.Scenes.TITLE,
};

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  create() {
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor('#69696c');

    this.add.image(this.scale.width / 2, this.scale.height / 4, 'logo').setScale(0.3);

    // this.titleText = this.add.text(
    //   this.scale.width / 2,
    //   this.scale.height / 3,
    //   'Chexy',
    //   { fontSize: '64px', fill: '#fff' }
    // );
    // this.titleText.setOrigin(0.5);

    this.btnStartGame = this.createButton(this.scale.width / 2, this.scale.height / 2, 'New game');

    this.btnStartGame.onClick().subscribe(() => {
      this.startScene(Constants.Scenes.DIFFICULTY);
    });

    this.btnOptions = this.createButton(this.scale.width / 2, this.scale.height / 2 + 60, 'Options');

    this.btnOptions.onClick().subscribe(() => {
      this.startScene(Constants.Scenes.OPTIONS);
    });

    this.btnCredits = this.createButton(this.scale.width / 2, this.scale.height / 2 + 120, 'Credits');

    this.btnCredits.onClick().subscribe(() => {
      this.startScene(Constants.Scenes.CREDITS);
    });
  }

  createButton(x, y, text) {
    return this.add
      .buttonContainer(x, y, 'btnBlue', 0xffffff)
      .setDownTexture('btnBluePressed')
      .setOverTint(0xffad00)
      .setText(text);
  }

  startScene(targetScene) {
    this.scene.start(targetScene);
  }
}
