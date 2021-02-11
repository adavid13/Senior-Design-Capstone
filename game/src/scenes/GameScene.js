import Phaser from 'phaser';
import { Constants } from '../utils/constants';
import { Events } from '../components/EventCenter';

const sceneConfig = {
  key: Constants.Scenes.GAME,
};


export default class GameScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  init(initParams) {
    this.players = initParams.players;
    this.interactionModel = initParams.interactionModel;
    this.board = initParams.board;
    this.interfaceModel = initParams.interfaceModel;
  }

  create() {
    this.createBackground();
    this.board.inititialize();
    this.setCamera();
   
    this.input.setTopOnly(true);
    this.input.on('pointermove', (pointer) => {
      if (!pointer.isDown) return;
      const cam = this.cameras.main;
      cam.scrollX -= (pointer.x - pointer.prevPosition.x) / cam.zoom;
      cam.scrollY -= (pointer.y - pointer.prevPosition.y) / cam.zoom;
    });

    Events.on('piece-added', (piece) => {
      this.board.handleTileColorChange(piece);
    });

    Events.on('piece-moved', (piece) => {
      piece.clearTint();
      this.board.handleTileColorChange(piece);
    });

    Events.on('piece-removed', (piece) => {
      this.board.clearTileColor(piece);
    });
  }

  createBackground() {
    this.add.image(0, 0, 'gamebg').setOrigin(0, 0);
    this.add.image(2034, 0, 'gamebg').setOrigin(0, 0);
    this.add.image(0, 1758, 'gamebg').setOrigin(0, 0);
    this.add.image(2034, 1758, 'gamebg').setOrigin(0, 0);
  }

  getInteractionModel() {
    return this.interactionModel;
  }

  setCamera() {
    this.cameras.main.setBounds(0, 0, Constants.World.WIDTH, Constants.World.HEIGHT);
    this.cameras.main.centerOn(Constants.World.WIDTH / 2, Constants.World.HEIGHT / 2);
  }
}
