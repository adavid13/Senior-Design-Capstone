import Phaser from 'phaser';
import { Constants } from '../utils/constants';
// import PieceSelectionMenu from '../components/ui/PieceSelectionMenu';
import GameBoard from '../components/GameBoard';
import GameBoardModel from '../components/model/GameBoardModel';
import PlayerModel from '../components/model/PlayerModel';
import MoveableMarker from '../components/MoveableMarker';
import BoardPiece from '../components/BoardPiece';
import KingPiece from '../components/KingPiece';
import KnightPiece from '../components/KnightPiece';
import MagePiece from '../components/MagePiece';
import StealthPiece from '../components/StealthPiece';
import BarbarianPiece from '../components/BarbarianPiece';

const sceneConfig = {
  key: Constants.Scenes.GAME,
};


export default class GameScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
    this.selectedPiece = undefined;
  }

  init(initParams) {
    this.scene.launch(Constants.Scenes.GAMEUI);
    this.difficulty = initParams.difficulty;
  }

  preload() {}

  create() {
    this.createBackground();
    const players = this.createPlayers();
    this.board = this.createBoard(players);
    this.createPieces();
    this.setCamera();
    this.setEvents();
    // this.selectionMenu = undefined;
    this.state = Constants.GameState.READY;
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

  createBackground() {
    this.add.image(0, 0, 'gamebg').setOrigin(0, 0);
    this.add.image(2034, 0, 'gamebg').setOrigin(0, 0);
    this.add.image(0, 1758, 'gamebg').setOrigin(0, 0);
    this.add.image(2034, 1758, 'gamebg').setOrigin(0, 0);
  }

  createPlayers() {
    return [
      new PlayerModel(1, Constants.PlayerType.HUMAN, Constants.Faction.HUMAN),
      new PlayerModel(2, Constants.PlayerType.AI, this.getFaction()),
    ];
  }

  setState(state) {
    this.state = state;
  }

  getFaction() {
    if (this.difficulty === Constants.Difficulty.BEGINNER) return Constants.Faction.ANIMAL;
    else if (this.difficulty === Constants.Difficulty.INTERMEDIATE) return Constants.Faction.HUMAN;
    else if (this.difficulty === Constants.Difficulty.ADVANCED) return Constants.Faction.MONSTER;
    console.error('Invalid difficulty setting');
  }

  createBoard(players) {
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

    const model = new GameBoardModel(boardConfig, this.difficulty, players);
    const board = new GameBoard(this, model);
    board.inititialize();
    return board;
  }

  createPieces() {
    this.chessA = new KingPiece(this.board, { x: 11, y: 15 }, Constants.Faction.HUMAN);
    this.chessB = new BarbarianPiece(this.board, { x: 10, y: 15 }, Constants.Faction.HUMAN);
    this.chessC = new BarbarianPiece(this.board, { x: 10, y: 14 }, Constants.Faction.HUMAN);
    this.chessD = new MagePiece (this.board, { x: 12, y: 15 }, Constants.Faction.HUMAN);
    this.chessE = new MagePiece (this.board, { x: 11, y: 13 }, Constants.Faction.HUMAN);
    this.chessF = new StealthPiece(this.board, { x: 9, y: 14 }, Constants.Faction.HUMAN);
    this.chessG = new StealthPiece(this.board, { x: 9, y: 15 }, Constants.Faction.HUMAN);
    this.chessH = new StealthPiece(this.board, { x: 12, y: 14 }, Constants.Faction.HUMAN);
    this.chessI = new KnightPiece(this.board, { x: 13, y: 14 }, Constants.Faction.HUMAN);
    this.chessJ = new KnightPiece(this.board, { x: 9, y: 13 }, Constants.Faction.HUMAN);
    this.chessK = new KnightPiece(this.board, { x: 11, y: 14 }, Constants.Faction.HUMAN);

    this.chessL = new KingPiece(this.board, { x: 11, y: 11 }, Constants.Faction.MONSTER);
    this.chessM = new BarbarianPiece(this.board, { x: 10, y: 11 }, Constants.Faction.MONSTER);
    this.chessN = new BarbarianPiece(this.board, { x: 10, y: 12 }, Constants.Faction.MONSTER);
    this.chessO = new MagePiece (this.board, { x: 9, y: 11 }, Constants.Faction.MONSTER);
    this.chessP = new MagePiece (this.board, { x: 13, y: 12 }, Constants.Faction.MONSTER);
    this.chessQ = new StealthPiece(this.board, { x: 11, y: 12 }, Constants.Faction.MONSTER);
    this.chessR = new StealthPiece(this.board, { x: 14, y: 12 }, Constants.Faction.MONSTER);
    this.chessS = new StealthPiece(this.board, { x: 13, y: 11 }, Constants.Faction.MONSTER);
    this.chessT = new KnightPiece(this.board, { x: 11, y: 10 }, Constants.Faction.MONSTER);
    this.chessU = new KnightPiece(this.board, { x: 12, y: 11 }, Constants.Faction.MONSTER);
    this.chessV = new KnightPiece(this.board, { x: 12, y: 12 }, Constants.Faction.MONSTER);
  }

  setCamera() {
    this.cameras.main.setBounds(0, 0, Constants.World.WIDTH, Constants.World.HEIGHT);
    this.cameras.main.centerOn(Constants.World.WIDTH / 2, Constants.World.HEIGHT / 2);
  }

  setEvents() {
    this.board.on('tiledown', (pointer, tileXY) => {
      switch (this.state) {
        case Constants.GameState.READY: {
          const gameObjects = this.board.tileXYToChessArray(tileXY.x, tileXY.y);
          if (gameObjects.length === 0) {
            this.clearSelection();
            return;
          }

          let selectedObject = undefined;
          const marker = gameObjects.find(object => object instanceof MoveableMarker);
          const pieces = gameObjects.filter(object => object instanceof BoardPiece);

          if (marker) {
            selectedObject = marker;
          } else {
            //if (pieces.length === 1)
              selectedObject = pieces[pieces.length - 1];
            // else {
            //   if (!this.selectionMenu) {
            //     this.selectionMenu = new PieceSelectionMenu(this, pointer.worldX, pointer.worldY, pieces, (selectedPiece) => {
            //       this.selectionMenu.collapse();
            //       this.selectionMenu = undefined;
            //       this.clearSelection();
            //       this.selectedPiece = selectedPiece;
            //       this.selectedPiece.setTint(0xffff00);
            //       this.selectedPiece.showMoveableArea();
            //       this.state = Constants.GameState.READY;
            //     }, this);
            //   }
            //   this.state = Constants.GameState.PIECE_SELECTION;
            //   return;
            // }
          }
          
          if (selectedObject instanceof BoardPiece) {
            this.clearSelection();
            this.selectedPiece = selectedObject;
            this.selectedPiece.setTint(0xffff00);
            this.selectedPiece.showMoveableArea();
          }
    
          if (selectedObject instanceof MoveableMarker) {
            this.setState(Constants.GameState.PIECE_MOVING);
            const targetTile = selectedObject.getTileXY();
            const parent = selectedObject.getParentPiece();
            if (!parent.moveToTile(targetTile)) return;
            selectedObject.setFillStyle(0xff5c8d);
          }
          break;
        }
        // case Constants.GameState.PIECE_SELECTION: {
        //   if (this.selectionMenu && !this.selectionMenu.isInTouching({ x: pointer.worldX, y: pointer.worldY })) {
        //     this.selectionMenu.collapse();
        //     this.selectionMenu = undefined;
        //     this.state = Constants.GameState.READY;
        //   }
        //   break;
        // }
        default:
          break;
      }
    });

    this.board.on('kickout', function(chessToAdd, occupiedChess, tileXYZ){
      console.error('a piece was removed from the board model: ', occupiedChess, tileXYZ);
      occupiedChess.destroy();
    })
  }


  clearSelection() {
    if (this.selectedPiece) {
      this.selectedPiece.hideMoveableArea();
      this.selectedPiece.clearTint();
    }
  }
}
