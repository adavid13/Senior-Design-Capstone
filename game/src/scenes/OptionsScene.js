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
      .buttonContainer(this.scale.width / 2, this.scale.height / 2, 'btnBlue', Constants.Color.WHITE)
      .setDownTexture('btnBluePressed')
      .setOverTint(Constants.Color.ORANGE)
      .setText('Back');

    this.btnBack.onClick().subscribe(() => {
      this.startScene(Constants.Scenes.TITLE);
    });
  }

  startScene(targetScene) {
    this.scene.start(targetScene);
  }
}
