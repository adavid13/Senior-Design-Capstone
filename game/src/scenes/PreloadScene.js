import Phaser from 'phaser';
import AssetManifest from '../utils/AssetManifest';
import { Constants } from '../utils/constants';

const sceneConfig = {
  key: Constants.Scenes.PRELOAD,
};

export default class PreloadScene extends Phaser.Scene {
  graphics;
  newGraphics;
  loadingText;

  constructor() {
    super(sceneConfig);
  }

  preload() {
    this.graphics = this.add.graphics();
    this.newGraphics = this.add.graphics();
    const progressBar = new Phaser.Geom.Rectangle(200, 200, 400, 50);
    const progressBarFill = new Phaser.Geom.Rectangle(205, 205, 290, 40);

    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.fillRectShape(progressBar);

    this.newGraphics.fillStyle(0x3587e2, 1);
    this.newGraphics.fillRectShape(progressBarFill);

    this.loadingText = this.add.text(250, 260, 'Loading: ', {
      fontSize: '32px',
      fill: '#FFF',
    });

    AssetManifest.images.forEach((image) => {
      if (image.loadOnStart) {
        this.load.image(
          image.name.split('.')[0],
          `./assets/images/${image.name}`
        );
      }
    });

    this.load.on('progress', this.updateProgress);
    this.load.on('complete', this.complete);
  }

  updateProgress = (percentage) => {
    this.newGraphics.clear();
    this.newGraphics.fillStyle(0x3587e2, 1);
    this.newGraphics.fillRectShape(
      new Phaser.Geom.Rectangle(205, 205, percentage * 390, 40)
    );
    this.loadingText.setText('Loading: ' + (percentage * 100).toFixed(2) + '%');
  };

  complete() {
    //this.scene.start(GAME);
  }
}
