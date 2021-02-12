import Dialog from './Dialog';
import Label from './Label';
import Slider from './Slider';

export default class OptionsDialog extends Dialog {
  constructor(scene, interfaceModel, onClickApply) {
    const primaryButton = {
      text: 'Apply',
      callback: onClickApply
    };
    const secondaryButton = {
      text: 'Cancel',
      callback: () => { this.hideDialog(); }
    };

    super(scene, 'Options', 400, [primaryButton, secondaryButton]);
    this.scene = scene;
    this.changeTime = this.changeTime.bind(this);
    this.interfaceModel = interfaceModel;

    this.createSlider('Turn Time - 00:00', this.interfaceModel.playerTimer, this.changeTime);
    this.createSlider('Sound Volume', this.interfaceModel.soundLevel, () => {});
    this.createSlider('Music Volume', this.interfaceModel.musicLevel, () => {});

    this.layout();
  }

  createSlider(text, sliderValue, changeValueCallback) {
    const contentContainer = this.getElement('content');
    contentContainer.add(
      new Label(this.scene, 0, 0, text, 22, 'left', 280),
      { padding: { top: 15, right: 0, bottom: 0, left: 0 } }
    );

    contentContainer.add(
      new Slider(this.scene, 0, 0, 280, sliderValue, (value) => { changeValueCallback(value); }),
      { padding: { top: 15, right: 0, bottom: 30, left: 0 } }
    );
  }

  changeTime(value) {
    const time = Math.floor(value * this.interfaceModel.maxTime);
    const text = this.getElement('content').getElement('items')[0];
    text.getElement('text').text = `Turn Time - ${this.formatTime(time)}`;
    this.interfaceModel.tempPlayerTime = value;
  }

  formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds.toString().padStart(2,'0');
    return `${minutes}:${seconds}`;
  }

  resetSliders() {
    const timeSlider = this.getElement('content').getElement('items')[1];
    timeSlider.setValue(this.interfaceModel.playerTimer);
    const soundSlider = this.getElement('content').getElement('items')[3];
    soundSlider.setValue(this.interfaceModel.soundLevel);
    const musicSlider = this.getElement('content').getElement('items')[5];
    musicSlider.setValue(this.interfaceModel.musicLevel);
  }

  showDialog() {
    this.resetSliders();
    super.showDialog();
    return this;
  }

  hideDialog() {
    super.hideDialog();
    return this;
  }
}
