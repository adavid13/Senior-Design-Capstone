import Phaser from 'phaser';
import { Constants } from '../../utils/constants';

export default class Overlay extends Phaser.GameObjects.Rectangle {
  constructor(scene, transparency) {
    super(
      scene,
      Constants.Window.WIDTH / 2,
      Constants.Window.HEIGHT / 2,
      Constants.Window.WIDTH,
      Constants.Window.HEIGHT,
      Constants.Color.BLACK,
      transparency
    );
    scene.add.existing(this);
    this.setDepth(Constants.GameObjectDepth.UI);
    this.setInteractive();
  }
}