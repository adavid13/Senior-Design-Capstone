import { Label as RexLabel } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { Constants } from '../../utils/constants';
import { convertIntegerColorToString } from '../../utils/color';

export default class LabelWithIcon extends RexLabel {
  constructor(scene, x, y, text, fontSize, align, width, space = 20, backgroundColor, { iconObject, orientation }) {
    let config = {
      x, y,
      width: 225,
      height: 225,
      icon: iconObject,
      orientation,
      align,
    };

    if (backgroundColor) {
      config.background = scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, backgroundColor);
      config.space = { top: space, right: space, bottom: space, left: space, icon: 10 };
    }

    const textColor = convertIntegerColorToString(Constants.Color.WHITE);
    const textObject = scene.add.text(0, 0, text, { fontFamily: '"Bungee"', fontSize: `${fontSize}px`, fill: textColor });
    if (fontSize > 50) {
      textObject.setShadow(5, 5, '#000000', 5, false, true);
    } else {
      textObject.setShadow(2, 2, '#000000', 2, false, true);
    }
    config.text = textObject;
    super(scene, config);
    this.layout();
  }

  changeText(text) {
    this.getElement('text').setText(text);
    this.layout();
  }
}