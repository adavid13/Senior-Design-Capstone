import Phaser from 'phaser';
import { Constants } from '../utils/constants';
import { Events } from '../components/EventCenter';
// import PieceSelectionMenu from '../components/ui/PieceSelectionMenu';
import GameBoard from '../components/GameBoard';
import GameBoardModel from '../components/model/GameBoardModel';
import PlayerModel from '../components/model/PlayerModel';
import MoveableMarker from '../components/MoveableMarker';
import BoardPiece from '../components/BoardPiece';
import InteractionModel from '../components/model/InteractionModel';

const sceneConfig = {
  key: Constants.Scenes.GAME,
};


export default class GameScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  init(initParams) {
    this.difficulty = initParams.difficulty;
  }

  preload() {}

  create() {
    this.createBackground();
    this.players = this.createPlayers();
    this.board = this.createBoard(this.players);
    this.interactionModel = new InteractionModel(this.players);
    this.scene.launch(
      Constants.Scenes.GAMEUI,
      { players: this.players, board: this.board, interactionModel: this.interactionModel }
    );
    this.setCamera();
    this.setEvents();
    this.state = Constants.GameState.READY;
    this.input.setTopOnly(true);
  }

  update() {
    let { origDragPoint } = this.game;
    const { activePointer } = this.game.input;
    if (activePointer.isDown) {
      if (origDragPoint) {
        // move the camera by the amount the mouse has moved since last update
        this.cameras.main.scrollX += origDragPoint.x - activePointer.position.x;
        this.cameras.main.scrollY += origDragPoint.y - activePointer.position.y;
      } // set new drag origin to current position
      this.game.origDragPoint = activePointer.position.clone();
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

  getInteractionModel() {
    return this.interactionModel;
  }

  getFaction() {
    if (this.difficulty === Constants.Difficulty.BEGINNER)
      return Constants.Faction.ANIMAL;
    else if (this.difficulty === Constants.Difficulty.INTERMEDIATE)
      return Constants.Faction.HUMAN;
    else if (this.difficulty === Constants.Difficulty.ADVANCED)
      return Constants.Faction.MONSTER;
    console.error('Invalid difficulty setting');
  }

  createBoard(players) {
    const model = new GameBoardModel(this.difficulty, players);
    const board = new GameBoard(this, model);
    board.inititialize();
    return board;
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
            Events.emit('piece-selected');
            this.clearSelection();
            return;
          }

          let selectedObject = undefined;
          const marker = gameObjects.find(object => object instanceof MoveableMarker);
          const pieces = gameObjects.filter(object => object instanceof BoardPiece);

          if (marker) {
            selectedObject = marker;
          } else {
            selectedObject = pieces[pieces.length - 1];
          }
          
          if (selectedObject instanceof BoardPiece) {
            this.onPieceSelected(selectedObject);
          }
    
          if (selectedObject instanceof MoveableMarker) {
            this.onMarkerSelected(selectedObject);
          }
          break;
        }
        default:
          break;
      }
    });

    this.board.on('kickout', function(chessToAdd, occupiedChess, tileXYZ){
      console.error('a piece was removed from the board model: ', occupiedChess, tileXYZ);
      occupiedChess.destroy();
    });

    Events.on('card-selected', this.clearSelection, this);
  }

  onPieceSelected(selectedPiece) {
    this.clearSelection();
    this.interactionModel.selectedPiece = selectedPiece;
    Events.emit('piece-selected');
    selectedPiece.setTint(Constants.Color.YELLOW_HIGHLIGHT);
    selectedPiece.showMoveableArea();
  }

  onMarkerSelected(selectedMarker) {
    if (this.interactionModel.selectedPieceCanMove()) {
      this.setState(Constants.GameState.PIECE_MOVING);
      const targetTile = selectedMarker.getTileXY();
      const piece = selectedMarker.getParentPiece();
      if (!piece.moveToTile(targetTile)) return;
      selectedMarker.setFillStyle(Constants.Color.RED);
      this.interactionModel.incrementTurn();
      this.interactionModel.changePlayerTurn();
    }
  }

  clearSelection() {
    const selectedPiece = this.interactionModel.selectedPiece;
    if (selectedPiece) {
      selectedPiece.hideMoveableArea();
      selectedPiece.clearTint();
    }
  }
}
