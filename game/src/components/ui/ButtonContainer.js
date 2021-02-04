import Phaser from 'phaser';
import ImageButton from './ImageButton';
import RectangleButton from './RectangleButton';
import { convertIntegerColorToString } from '../../utils/color';

export default class ButtonContainer extends Phaser.GameObjects.Container {
  button;
  text;

  constructor(scene, x, y, type, buttonConfig, textConfig) {
    super(scene, x, y);
    this.scene = scene;
    this.textConfig = textConfig;
    this.onOver = this.onOver.bind(this);
    this.onOut = this.onOut.bind(this);
    this.onDown = this.onDown.bind(this);
    this.onUp = this.onUp.bind(this);

    if (type === 'image') {
      this.button = new ImageButton(scene, 0, 0, buttonConfig);
    } else {
      this.button = new RectangleButton(scene, 0, 0, buttonConfig, {
        onOver: this.onOver,
        onOut: this.onOut,
        onDown: this.onDown,
        onUp: this.onUp
      });
    }
    
    this.text = this.scene.add
      .text(0, 0, 'Button', textConfig.style)
      .setOrigin(0.5);
    this.textShadow();

    this.add(this.button);
    this.add(this.text);
  }

  textShadow() {
    if (this.textConfig.addShadow)
      this.text.setShadow(5, 5, '#000000', 5, false, true);
  }

  clearTextShadow() {
    this.text.setShadow(0, 0, '#000000', 0, false, true);
  }

  onClick() {
    return this.button.onClick();
  }

  onOver() {
    this.text.setColor(convertIntegerColorToString(this.textConfig.highlightColor));
  }

  onOut() {
    this.text.setColor('#ffffff');
    this.textShadow();
  }

  onDown() {
    this.clearTextShadow();
  }

  onUp() {
    this.textShadow();
  }

  alignCenter() {
    this.button.setOrigin(0.5);
    this.text.setOrigin(0.5);
    return this;
  }

  alignLeft() {
    this.button.setOrigin(0, 0.5);
    this.text.setOrigin(0, 0.5);
    return this;
  }

  setText(text) {
    this.text.text = text;
    return this;
  }

  setTextStyle(style) {
    this.text.setStyle(style);
    return this;
  }

  setUpTexture(texture) {
    this.button.setUpTexture(texture);
    return this;
  }

  setUpTint(tint) {
    this.button.setUpTint(tint);
    return this;
  }

  setUpTexture(texture) {
    this.button.setUpTexture(texture);
    return this;
  }

  setUpTint(tint) {
    this.button.setUpTint(tint);
    return this;
  }

  setDownTexture(texture) {
    this.button.setDownTexture(texture);
    return this;
  }

  setDownTint(tint) {
    this.button.setDownTint(tint);
    return this;
  }

  setOverTexture(texture) {
    this.button.setOverTexture(texture);
    return this;
  }

  setOverTint(tint) {
    this.button.setOverTint(tint);
    return this;
  }

  setDisabledTexture(texture) {
    this.button.setDisabledTexture(texture);
    return this;
  }

  setDisabledTint(tint) {
    this.button.setDisabledTint(tint);
    return this;
  }

  setDisabled(disable) {
    this.button.setDisabled(disable);
    return this;
  }
}

Phaser.GameObjects.GameObjectFactory.register('buttonContainer',
  function (x, y, type, buttonConfig, textConfig) {
    return this.displayList.add(new ButtonContainer(this.scene, x, y, type, buttonConfig, textConfig));
  }
);
