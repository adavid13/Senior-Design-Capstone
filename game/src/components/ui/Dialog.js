import { Dialog as RexDialog } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import Label from './Label';
import RoundBackground from './RoundBackground';
import { Constants } from '../../utils/constants';
import { convertIntegerColorToString } from '../../utils/color';

export default class Dialog extends RexDialog {
  /**
   * @param scene 
   * @param width 
   * @param actionsConfig [{ text: String, callback: fn() }, {...}, ...]
   */
  constructor(scene, interfaceModel, title, width, actionsConfig = [], choicesConfig = []) {
    const config = {
      x: Constants.Window.WIDTH / 2,
      y: Constants.Window.HEIGHT / 2,
      width: width,
      background: new RoundBackground(scene, 0, 0, 100, 100, 20),
      title: new Label(scene, 0, 0, title, 32, 'center', 40).setDepth(Constants.GameObjectDepth.UI),
      content: scene.rexUI.add.sizer({ x: 0, y: 0, width: 100, height: 0, orientation: 'y' })
        .setDepth(Constants.GameObjectDepth.UI),
      actions: [],
      choices: [],
      space: { left: 15, right: 15, top: 15, bottom: 15, title: 15, action: 30, choice: 15 },
      expand: { choices: false },
      align: { title: 'center', content: 'center' }
    };

    super(scene, config);
    this.scene = scene;
    this.setDepth(Constants.GameObjectDepth.UI);
    this.interfaceModel = interfaceModel;
    this.actionsConfig = actionsConfig;
    this.choicesConfig = choicesConfig;
    this.actionsIndex = 0;
    this.choicesIndex = 0;
    this.createActions(actionsConfig);
    this.createChoices(choicesConfig);
    this.createSounds();

    scene.add.existing(this);
    this.layout();
  }

  createButton(text, groupName, index) {
    const textColor = convertIntegerColorToString(Constants.Color.WHITE);
    const textHighlightColor = convertIntegerColorToString(Constants.Color.YELLOW);

    const button = this.scene.add.text(0, 0, text, {
      fontFamily: '"Bungee"',
      fontSize: '22px',
      fill: '#fff',
      align: 'center'
    })
      .setShadow(2, 2, '#000000', 2, false, true)
      .setDepth(Constants.GameObjectDepth.UI);

    if (groupName === 'choices') {
      button.setFixedSize(125, 0);
    }

    button.on('pointerdown', () => { this.handleClick(button, groupName, index); });
    button.on('pointerover', () => { 
      this.hoverSound.play();
      button.setColor(textHighlightColor);
    });
    button.on('pointerout', () => { button.setColor(textColor); });
    return button;
  }

  createSounds() {
    this.hoverSound = this.scene.sound.add('button-hover');
    this.hoverSound.setVolume(this.interfaceModel.soundLevel);
    this.clickSound = this.scene.sound.add('button-click');
    this.clickSound.setVolume(this.interfaceModel.soundLevel);
  }

  createActions(actionsConfig) {
    actionsConfig.forEach(actionConfig => {
      this.addAction([this.createButton(actionConfig.text, 'actions', this.actionsIndex)]);
      this.actionsIndex++;
    });
  }

  createChoices(choicesConfig) {
    choicesConfig.forEach(choiceConfig => {
      this.addChoice([this.createButton(choiceConfig.text, 'choices', this.choicesIndex)]);
      this.choicesIndex++;
    });
  }

  handleClick(button, groupName, index) {
    const config = this.getConfig(groupName, index);
    this.clickSound.play();
    if (config.callback) {
      config.callback();
    }
  }

  getConfig(groupName, index) {
    const config = {
      'actions': this.actionsConfig,
      'choices': this.choicesConfig
    };
    return config[groupName][index];
  }

  showDialog() {
    if (!this.visible) {
      this.setVisible(true).popUp(1000);
      this.scene.tweens.add({
        targets: this,
        scaleX: 1,
        scaleY: 1,
        ease: 'Bounce',
        duration: 1000,
        repeat: 0,
        yoyo: false
      });
    }
    return this;
  }

  hideDialog() {
    this.setVisible(false);
    return this;
  }
}
