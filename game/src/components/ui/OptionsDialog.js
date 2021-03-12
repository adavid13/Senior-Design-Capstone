import Dialog from './Dialog';
import Label from './Label';
import Slider from './Slider';
import { Constants } from '../../utils/constants';

export default class OptionsDialog extends Dialog {
  constructor(scene, sounds, interfaceModel, onClickApply, onClickCancel) {
    const primaryButton = {
      text: 'Apply',
      callback: onClickApply
    };
    const secondaryButton = {
      text: 'Cancel',
      callback: () => {
        sounds.forEach(music => {
          music.setVolume(interfaceModel.musicLevel * 0.5);
        });
        interfaceModel.cancelChanges();
        onClickCancel();
      }
    };

    super(scene, interfaceModel, 'Options', 400, [primaryButton, secondaryButton]);
    this.scene = scene;
    this.sounds = sounds;
    this.changeTime = this.changeTime.bind(this);
    this.changeSoundLevel = this.changeSoundLevel.bind(this);
    this.changeMusicLevel = this.changeMusicLevel.bind(this);
    this.interfaceModel = interfaceModel;

    this.createSlider('Turn Time - 00:00', this.interfaceModel.playerTimer, this.changeTime);
    this.createSlider('Sound Volume', this.interfaceModel.soundLevel, this.changeSoundLevel);
    this.createSlider('Music Volume', this.interfaceModel.musicLevel, this.changeMusicLevel);

    this.layout();
  }

  createSlider(text, sliderValue, changeValueCallback) {
    const contentContainer = this.getElement('content');
    contentContainer.add(
      new Label(this.scene, 0, 0, text, 22, 'left', 280),
      { padding: { top: 15, right: 0, bottom: 0, left: 0 } }
    );

    contentContainer.add(
      new Slider(this.scene, 0, 0, 280, sliderValue, (value) => { changeValueCallback(value); })
        .setDepth(Constants.GameObjectDepth.UI),
      { padding: { top: 15, right: 0, bottom: 30, left: 0 } }
    );
  }

  changeTime(value) {
    const time = Math.floor(value * this.interfaceModel.maxTime);
    const text = this.getElement('content').getElement('items')[0];
    text.getElement('text').text = `Turn Time    ${this.formatTime(time)}`;
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

  changeSoundLevel(value) {
    this.interfaceModel.tempSoundLevel = value;
    this.hoverSound.setVolume(value);
    this.clickSound.setVolume(value);
  }

  changeMusicLevel(value) {
    this.interfaceModel.tempMusicLevel = value;
    this.sounds.forEach(music => {
      music.setVolume(value * 0.5);
    });
  }
}
