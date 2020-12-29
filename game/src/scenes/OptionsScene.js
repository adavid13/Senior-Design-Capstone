import Phaser from 'phaser';
import { Constants } from '../utils/constants';

const sceneConfig = {
  key: Constants.Scenes.OPTIONS,
};

export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  create() {
    this.btnBack = this.add
      .buttonContainer(
        this.scale.width / 2,
        this.scale.height / 2,
        'btnBlue',
        0xffffff
      )
      .setDownTexture('btnBluePressed')
      .setOverTint(0xffad00)
      .setText('Back');

    this.btnBack.onClick().subscribe(() => {
      this.startScene(Constants.Scenes.TITLE);
    });
  }

  startScene(targetScene) {
    this.scene.start(targetScene);
  }
}
