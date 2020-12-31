import Phaser from 'phaser';
import GameBoard from '../components/GameBoard';
import GameBoardModel from '../components/model/GameBoardModel';
import KingPiece from '../components/KingPiece';
import { Constants } from '../utils/constants';
import MoveableMarker from '../components/MoveableMarker';

const sceneConfig = {
  key: Constants.Scenes.GAME,
};

export default class GameScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  init(initParams) {
    this.scene.launch(Constants.Scenes.GAMEUI);
    this.difficulty = initParams.difficulty;
  }

  preload() {}

  create() {
    this.add.image(0, 0, 'gamebg').setOrigin(0, 0);
    this.add.image(2034, 0, 'gamebg').setOrigin(0, 0);
    this.add.image(0, 1758, 'gamebg').setOrigin(0, 0);
    this.add.image(2034, 1758, 'gamebg').setOrigin(0, 0);
    this.selectedPiece = undefined;

    const boardConfig = {
      grid: {
        gridType: 'hexagonGrid',
        x: 300,
        y: 300,
        size: 60,
        staggeraxis: 'x',
        staggerindex: 'odd',
      },
      radius: 12,
    };

    const boardModel = new GameBoardModel(boardConfig, this.difficulty);
    const board = new GameBoard(this, boardModel);
    board.initHexBoard();
    // const print = this.add.text(0, 0, 'Click any tile');

    this.chessA = new KingPiece(board, { x: 10, y: 12 }, 'humanKing');
    this.chessB = new KingPiece(
      board,
      { x: 13, y: 12 },
      this.difficulty === Constants.Difficulty.BEGINNER
        ? 'animalKing'
        : this.difficulty === Constants.Difficulty.INTERMEDIATE
        ? 'humanKing'
        : 'monsterKing'
    );

    board.on('gameobjectdown', function (pointer, gameObject) {
      console.log(gameObject);
      console.log(this.selectedPiece);
      if (!(gameObject instanceof MoveableMarker)) {
        if (this.selectedPiece) {
          this.selectedPiece.hideMoveableArea();
          this.selectedPiece.clearTint();
        }

        this.selectedPiece = gameObject;
        this.selectedPiece.setTint(0xffff00);
        this.selectedPiece.showMoveableArea();
      }
    });

    this.cameras.main.setBounds(0, 0, Constants.World.WIDTH, Constants.World.HEIGHT);
    // this.physics.world.setBounds(0, 0, 4000, 4000);
    this.centerCamera(board, boardModel);
  }

  update() {
    if (this.game.input.activePointer.isDown) {
      if (this.game.origDragPoint) {
        // move the camera by the amount the mouse has moved since last update
        this.cameras.main.scrollX += this.game.origDragPoint.x - this.game.input.activePointer.position.x;
        this.cameras.main.scrollY += this.game.origDragPoint.y - this.game.input.activePointer.position.y;
      } // set new drag origin to current position
      this.game.origDragPoint = this.game.input.activePointer.position.clone();
    } else {
      this.game.origDragPoint = null;
    }
  }

  centerCamera(board, boardModel) {
    this.cameras.main.centerOn(Constants.World.WIDTH / 2, Constants.World.HEIGHT / 2);
  }
}
