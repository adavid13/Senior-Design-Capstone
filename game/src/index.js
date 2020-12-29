import Phaser from 'phaser';
import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin';
import PreloadScene from './scenes/PreloadScene';
import TitleScene from './scenes/TitleScene';
import OptionsScene from './scenes/OptionsScene';
import CreditsScene from './scenes/CreditsScene';
import DifficultyScene from './scenes/DifficultyScene';
import GameScene from './scenes/GameScene';
import GameUIScene from './scenes/GameUIScene';
import ExampleScene from './scenes/ExampleScene';

import ButtonContainer from './components/ui/ButtonContainer';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser',
  width: 1024,
  height: 768,
  plugins: {
    scene: [
      {
        key: 'rexBoard',
        plugin: BoardPlugin,
        mapping: 'rexBoard',
      },
    ],
  },
  scene: [
    PreloadScene,
    TitleScene,
    OptionsScene,
    CreditsScene,
    DifficultyScene,
    GameScene,
    GameUIScene,
    ExampleScene,
  ],
};

const game = new Phaser.Game(config);
