import Phaser from 'phaser';
import { Constants } from '../utils/constants';

const sceneConfig = {
  key: Constants.Scenes.GAMEUI,
};

export default class GameUIScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  create() {
    this.btnMenu = this.add
      .buttonContainer(100, 30, 'btnBlue', Constants.Color.WHITE)
      .setDownTexture('btnBluePressed')
      .setOverTint(Constants.Color.ORANGE)
      .setText('Main Menu');

    this.btnMenu.onClick().subscribe(() => {
      this.startScene(Constants.Scenes.TITLE);
    });
  }

  startScene(targetScene) {
    this.scene.stop(Constants.Scenes.GAMEUI);
    this.gameScene = this.scene.get(Constants.Scenes.GAME);
    this.gameScene.scene.start(targetScene);
  }
}
