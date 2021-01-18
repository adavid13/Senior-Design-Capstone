import Phaser from 'phaser';
import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { Constants } from './utils/constants';
import PreloadScene from './scenes/PreloadScene';
import TitleScene from './scenes/TitleScene';
import OptionsScene from './scenes/OptionsScene';
import CreditsScene from './scenes/CreditsScene';
import DifficultyScene from './scenes/DifficultyScene';
import GameScene from './scenes/GameScene';
import GameUIScene from './scenes/GameUIScene';
import ExampleScene from './scenes/ExampleScene';

/*eslint no-unused-vars: "off"*/
import ButtonContainer from './components/ui/ButtonContainer';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser',
  width: Constants.Window.WIDTH,
  height: Constants.Window.HEIGHT,
  plugins: {
    scene: [
      {
        key: 'rexBoard',
        plugin: BoardPlugin,
        mapping: 'rexBoard',
      }, {
        key: 'rexUI',
        plugin: RexUIPlugin,
        mapping: 'rexUI'
      },
    ],
  },
  scene: [PreloadScene, TitleScene, OptionsScene, CreditsScene, DifficultyScene, GameScene, GameUIScene, ExampleScene],
};

const game = new Phaser.Game(config);
