import Phaser from 'phaser';
import GrayScalePipelinePlugin from 'phaser3-rex-plugins/plugins/grayscalepipeline-plugin.js';
import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin.js';
import { Constants } from './utils/constants';
import PreloadScene from './scenes/PreloadScene';
import TitleScene from './scenes/TitleScene';
import DifficultyScene from './scenes/DifficultyScene';
import GameScene from './scenes/GameScene';
import GameUIScene from './scenes/GameUIScene';
import GameControllerScene from './scenes/GameControllerScene';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser',
  width: Constants.Window.WIDTH,
  height: Constants.Window.HEIGHT,
  plugins: {
    global: [{
      key: 'rexGrayScalePipeline',
      plugin: GrayScalePipelinePlugin,
      start: true
    }],
    scene: [
      {
        key: 'rexBoard',
        plugin: BoardPlugin,
        mapping: 'rexBoard',
      }, {
        key: 'rexUI',
        plugin: RexUIPlugin,
        mapping: 'rexUI'
      }, {
        key: 'rexGestures',
        plugin: GesturesPlugin,
        mapping: 'rexGestures'
    }],
  },
  scene: [PreloadScene, TitleScene, DifficultyScene, GameControllerScene, GameScene, GameUIScene],
};

/*eslint no-unused-vars: "off"*/
const game = new Phaser.Game(config);
