import { Dialog } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import RoundBackground from './RoundBackground';
import { Constants } from '../../utils/constants';
import { convertIntegerColorToString } from '../../utils/color';

export default class Tooltip extends Dialog {
  constructor(scene, x, y, text) {
    const textColor = convertIntegerColorToString(Constants.Color.WHITE);
    const config = {
      x,
      y,
      background: new RoundBackground(scene, 0, 0, 2, 2, 20),
      content: scene.rexUI.add.label({
        width: 40,
        height: 40,
        text: scene.add.text(0, 0, text, { fontFamily: '"Bungee"', fontSize: '16px', fill: textColor })
          .setShadow(2, 2, '#000000', 2, false, true),
        space: { top: 20, right: 20, bottom: 20, left: 20 } 
      })
    };
    super(scene, config);
    scene.add.existing(this);
    this.setOrigin(0);
    this.setDepth(Constants.GameObjectDepth.UI);
  }

  setTooltipText(text) {
    this.getElement('content').getElement('text').text = text;
    this.layout();
  }
}
