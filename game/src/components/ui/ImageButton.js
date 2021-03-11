import { Buttons as RexButtons} from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { Constants } from '../../utils/constants';
import { convertIntegerColorToString } from '../../utils/color';
import LabelWithIcon from './LabelWithIcon';

export default class ImageButton extends RexButtons {
  constructor(scene, x, y, text, fontSize, align, width, space, backgroundColor, onClick, interfaceModel, { iconObject, orientation }) {
    const config = {
      x,
      y,
      width,
      orientation: 'y',
      align,
      buttons: [new LabelWithIcon(scene, 0, 0, text, fontSize, align, width, space, backgroundColor, { iconObject, orientation })],
    };

    super(scene, config);
    this.scene = scene;
    this.onClick = onClick;
    this.interfaceModel = interfaceModel;
    this.setEvents();
    this.createSounds();
    scene.add.existing(this);
    this.layout();
  }

  createSounds() {
    this.hoverSound = this.scene.sound.add('button-hover');
    this.clickSound = this.scene.sound.add('button-click');
  }

  setEvents() {
    const textColor = convertIntegerColorToString(Constants.Color.WHITE);
    const textHighlightColor = convertIntegerColorToString(Constants.Color.YELLOW);
    const textDisabledColor = convertIntegerColorToString(Constants.Color.GREY_LIGHT);

    this.on('button.click', () => {
      if (this.clickSound && this.interfaceModel) {
        this.clickSound.setVolume(this.interfaceModel.soundLevel);
        this.clickSound.play();
      }
      this.onClick();
    })
    .on('button.over', (button, groupName, index) => {
      const enabled = this.getButtonEnable(0);
      if (enabled) {
        button.getElement('text').setColor(textHighlightColor);
        if (this.hoverSound && this.interfaceModel) {
          this.hoverSound.setVolume(this.interfaceModel.soundLevel);
          this.hoverSound.play();
        }
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
