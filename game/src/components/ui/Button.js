import { Buttons as RexButtons} from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import Label from './Label';
import { Constants } from '../../utils/constants';
import { convertIntegerColorToString } from '../../utils/color';

export default class Button extends RexButtons {
  constructor(scene, x, y, text, fontSize, align, width, space, backgroundColor, onClick) {
    const config = {
      x,
      y,
      width,
      orientation: 'x',
      align,
      buttons: [new Label(scene, 0, 0, text, fontSize, align, width, space, backgroundColor)],
    };

    super(scene, config);
    this.scene = scene;
    this.onClick = onClick; 
    this.setEvents();
    
    scene.add.existing(this);
    this.layout();
  }

  setEvents() {
    const textColor = convertIntegerColorToString(Constants.Color.WHITE);
    const textHighlightColor = convertIntegerColorToString(Constants.Color.YELLOW);
    const textDisabledColor = convertIntegerColorToString(Constants.Color.GREY_LIGHT);

    this.on('button.click', this.onClick)
    .on('button.over', (button, groupName, index) => {
      const enabled = this.getButtonEnable(0);
      if (enabled) {
        button.getElement('text').setColor(textHighlightColor);
      }
    }, this)
    .on('button.out', (button, groupName, index) => {
      const enabled = this.getButtonEnable(0);
      if (enabled) {
        button.getElement('text').setColor(textColor);
      }
    }, this)
    .on('button.disable', (button, index) => {
      button.getElement('text').setColor(textDisabledColor);
    })
    .on('button.enable', (button, index) => {
      button.getElement('text').setColor(textColor);
    });
  }
}
