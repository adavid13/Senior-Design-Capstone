import Phaser from 'phaser';
import Button from '../components/ui/Button';
import { Constants } from '../utils/constants';

const sceneConfig = {
  key: Constants.Scenes.CREDITS,
};

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  create() {
    this.btnBack = new Button(this, this.scale.width / 2, this.scale.height / 2,
      'Back', 22, 'center', 180, 10, Constants.Color.GREY_DARK, () => {
        this.startScene(Constants.Scenes.TITLE);
      }
    );
  }

  startScene(targetScene) {
    this.scene.start(targetScene);
  }
}
