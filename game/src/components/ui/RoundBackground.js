import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';
import { Constants } from '../../utils/constants';

export default class RoundBackground extends RoundRectangle {
  constructor(scene, x, y, width, height, radius = 10) {
      super(scene, x, y, width, height, radius, Constants.Color.GREY_DARK);
      scene.add.existing(this);
  }
}