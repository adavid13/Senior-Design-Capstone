import Phaser from 'phaser';
import AssetManifest from '../AssetManifest';
import Button from '../components/ui/Button';
import WebFontFile from '../components/WebFontFile';
import InterfaceModel from '../components/model/InterfaceModel';
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
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor('#69696c');
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    const barWidth = 400;
    const barHeight = 50;

    this.graphics = this.add.graphics();
    this.newGraphics = this.add.graphics();
    const progressBar = new Phaser.Geom.Rectangle(centerX - barWidth / 2, centerY - barHeight / 2, barWidth, barHeight);
    const progressBarFill = new Phaser.Geom.Rectangle(
      centerX - barWidth / 2 + 5,
      centerY - barHeight / 2 + 5,
      barWidth - 10,
      barHeight - 10
    );

    this.graphics.fillStyle(Constants.Color.WHITE, 1);
    this.graphics.fillRectShape(progressBar);

    this.newGraphics.fillStyle(Constants.Color.GREEN_DARK, 1);
    this.newGraphics.fillRectShape(progressBarFill);

    this.loadingText = this.add
      .text(centerX, centerY - 60, 'Loading: ', {
        fontSize: '32px',
        fontStyle: 'bold',
        fill: '#ffda82',
      })
      .setOrigin(0.5);

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

    AssetManifest.sounds.forEach((sound) => {
      if (sound.loadOnStart) {
        this.load.audio(sound.name, sound.path);
      }
    });

    this.load.addFile(new WebFontFile(this.load, 'Bungee'));

    this.load.on('progress', this.updateProgress);
    this.load.on('complete', this.complete);
  }

  updateProgress = (percentage) => {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    const barWidth = 400;
    const barHeight = 50;

    this.newGraphics.clear();
    this.newGraphics.fillStyle(Constants.Color.GREEN_DARK, 1);
    this.newGraphics.fillRectShape(
      new Phaser.Geom.Rectangle(
        centerX - barWidth / 2 + 5,
        centerY - barHeight / 2 + 5,
        percentage * (barWidth - 10),
        barHeight - 10
      )
    );
    this.loadingText.setText('Loading: ' + (percentage * 100).toFixed(2) + '%');
  };

  complete = () => {
    this.interfaceModel = new InterfaceModel();
    this.btnStart = new Button(this, this.scale.width / 2, this.scale.height / 2 + 100,
      'Start', 22, 'center', 180, 10, Constants.Color.GREY_DARK, () => {
        this.scene.start(Constants.Scenes.TITLE, { interfaceModel: this.interfaceModel });
      }
    );
  };
}
