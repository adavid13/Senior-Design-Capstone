import Phaser from 'phaser';
import AssetManifest from '../AssetManifest';
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
        this.load.image(image.name, image.path);
      }
    });

    AssetManifest.spritesheets.forEach((spritesheet) => {
      if (spritesheet.loadOnStart) {
        this.load.spritesheet(spritesheet.name, spritesheet.path, {
          frameWidth: spritesheet.frameWidth,
          frameHeight: spritesheet.frameHeight,
        });
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

  complete = () => {
    this.scene.start(Constants.Scenes.TITLE);
  };
}
