import Phaser from 'phaser';

const sceneConfig = {
  key: 'example',
};

export default class ExampleScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  preload() {
    this.load.image('logo1', './assets/images/logo.png');
  }

  create() {
    const logo = this.add.image(400, 150, 'logo1');

    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 2000,
      ease: 'Power2',
      yoyo: true,
      loop: -1,
    });
  }
}
