import { Constants } from '../../utils/constants';

const MAX_TIME = 600; // 10 minutes
const MIN_TIME = 20; // 20 seconds

export default class InteractionModel {
  _playerTimer;
  _soundLevel;
  _musicLevel;
  _mute;
  
  constructor() {
    this._playerTimer = 0.5;
    this._soundLevel = 0.8;
    this._musicLevel = 0.5;
    this._tempPlayerTime = 0.5;
    this._tempSoundLevel = 0.8;
    this._tempMusicLevel = 0.5;
    this._mute = false;
  }

  get playerTimer() {
    return this._playerTimer;
  }

  set playerTimer(time) {
    this._playerTimer = time;
  }

  set tempPlayerTime(level)  {
    this._tempPlayerTime = level;
  }

  getPlayerTimerinSec() {
    return Math.floor(this._playerTimer * (MAX_TIME - MIN_TIME) + MIN_TIME);
  }

  getAiTimer(difficulty) {
    if (difficulty === Constants.Difficulty.BEGINNER)
      return 15000;
    else if (difficulty === Constants.Difficulty.INTERMEDIATE)
      return 30000;
    else 
      return 60000;
  }

  get maxTime() {
    return MAX_TIME;
  }

  get minTime() {
    return MIN_TIME;
  }

  get soundLevel() {
    return this._soundLevel;
  }

  set soundLevel(level)  {
    this._soundLevel = level;
  }

  set tempSoundLevel(level)  {
    this._tempSoundLevel = level;
  }

  get musicLevel() {
    return this._musicLevel;
  }

  set musicLevel(level)  {
    this._musicLevel = level;
  }

  set tempMusicLevel(level)  {
    this._tempMusicLevel = level;
  }
  
  get mute() {
    return this._mute;
  }

  set mute(isMute) {
    this._mute = isMute;
  }

  confirmChanges() {
    this._playerTimer = this._tempPlayerTime;
    this._soundLevel = this._tempSoundLevel;
    this._musicLevel = this._tempMusicLevel;
  }

  cancelChanges() {
    this._tempPlayerTime = this._playerTimer;
    this._tempSoundLevel = this._soundLevel;
    this._tempMusicLevel = this._musicLevel;
  }
}
