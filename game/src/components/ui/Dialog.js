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
  constructor(scene, title, width, actionsConfig = [], choicesConfig = []) {
    const config = {
      x: Constants.Window.WIDTH / 2,
      y: Constants.Window.HEIGHT / 2,
      width: width,
      background: new RoundBackground(scene, 0, 0, 100, 100, 20),
      title: new Label(scene, 0, 0, title, 32, 'center', 40),
      content: scene.rexUI.add.sizer({ x: 0, y: 0, width: 100, height: 0, orientation: 'y' }),
      actions: [],
      choices: [],
      space: { left: 15, right: 15, top: 15, bottom: 15, title: 15, action: 30, choice: 15 },
      align: { title: 'center', content: 'center' }
    };

    super(scene, config);
    this.scene = scene;
    this.actionsConfig = actionsConfig;
    this.choicesConfig = choicesConfig;
    this.createActions(actionsConfig);
    this.createChoices(choicesConfig);
    this.setEvents();

    scene.add.existing(this);
    this.layout();
  }

  createButton(text) {
    const fontSize = 22;
    const align = 'center';
    const width = 100;
    return new Label(this.scene, 0, 0, text, fontSize, align, width);
  }

  createActions(actionsConfig) {
    actionsConfig.forEach(actionConfig => {
      this.addAction([this.createButton(actionConfig.text)]);
    });
  }

  createChoices(choicesConfig) {
    choicesConfig.forEach(choiceConfig => {
      this.addChoice([this.createButton(choiceConfig.text)]);
    });
  }

  setEvents() {
    const textColor = convertIntegerColorToString(Constants.Color.WHITE);
    const textHighlightColor = convertIntegerColorToString(Constants.Color.YELLOW);

    this.on('button.click', this.handleClick, this)
    .on('button.over', (button, groupName, index) => {
      button.getElement('text').setColor(textHighlightColor);
    })
    .on('button.out', (button, groupName, index) => {
      button.getElement('text').setColor(textColor);
    });
  }

  handleClick(button, groupName, index) {
    const config = this.getConfig(groupName, index);
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
