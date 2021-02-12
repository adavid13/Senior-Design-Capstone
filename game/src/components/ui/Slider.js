import { Slider as RexSlider} from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { Constants } from '../../utils/constants';

export default class Slider extends RexSlider {
  constructor(scene, x, y, width, value, onValueChange) {
    const config = {
      x, y, width,
      height: 20,
      orientation: 'x',
      value,
      track: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 6, Constants.Color.RED),
      indicator: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, Constants.Color.GREY_LIGHT),
      thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, Constants.Color.WHITE),

      valuechangeCallback: onValueChange,
      space: { top: 4, bottom: 4 },
      input: 'click',
    };

    super(scene, config);
    scene.add.existing(this);
    this.layout();
  }
}