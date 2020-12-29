import Phaser from 'phaser';
import Button from './Button';

export default class ButtonContainer extends Phaser.GameObjects.Container {
  button;
  text;

  constructor(scene, x, y, texture, tint = oxffffff) {
    super(scene, x, y);
    this.scene = scene;

    this.button = new Button(scene, 0, 0, texture, tint);
    this.text = this.scene.add
      .text(0, 0, 'Button', { color: 'black' })
      .setOrigin(0.5, 0.5);

    this.add(this.button);
    this.add(this.text);
  }

  onClick() {
    return this.button.onClick();
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

Phaser.GameObjects.GameObjectFactory.register(
  'buttonContainer',
  function (x, y, key, tint = 0xffffff) {
    return this.displayList.add(
      new ButtonContainer(this.scene, x, y, key, tint)
    );
  }
);
