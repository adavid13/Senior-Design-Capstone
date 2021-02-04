import Phaser from 'phaser';
import { Constants } from '../utils/constants';

const sceneConfig = {
  key: Constants.Scenes.TITLE,
};

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  create() {
    this.cameras.main.backgroundColor = Phaser.Display.Color.IntegerToColor(Constants.Color.GREY);
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'titlegrey');
    
    this.btnStartGame = this.createButton(50, this.scale.height / 2, 'New game');

    this.btnStartGame.onClick().subscribe(() => {
      this.startScene(Constants.Scenes.DIFFICULTY);
    });

    this.btnOptions = this.createButton(50, this.scale.height / 2 + 100, 'Options');

    this.btnOptions.onClick().subscribe(() => {
      this.startScene(Constants.Scenes.OPTIONS);
    });

    this.btnCredits = this.createButton(50, this.scale.height / 2 + 200, 'Credits');

    this.btnCredits.onClick().subscribe(() => {
      this.startScene(Constants.Scenes.CREDITS);
    });
  }

  createButton(x, y, text) {
    return this.add
      .buttonContainer(x, y, 'rectangle',
        { width: 420, height: 90, backgroundColor: 0x69696c },
        { 
          style: { color: 'white', fontFamily: '"Bungee"', fontSize: '60px' },
          highlightColor: Constants.Color.YELLOW,
          addShadow: true 
        })
      .alignLeft()
      .setText(text);
  }

  startScene(targetScene) {
    this.scene.start(targetScene);
  }
}
