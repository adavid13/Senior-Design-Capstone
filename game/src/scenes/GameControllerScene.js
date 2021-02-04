import Phaser from 'phaser';
import { Constants } from '../utils/constants';
import { isKingOnTheBoard, isPieceSurrounded, getAllPieces, getAllPiecesOfPlayer } from '../utils/piecesUtils';
import { Events } from '../components/EventCenter';
import PlayerModel from '../components/model/PlayerModel';
import InteractionModel from '../components/model/InteractionModel';
import GameBoard from '../components/GameBoard';
import GameBoardModel from '../components/model/GameBoardModel';
import MoveableMarker from '../components/MoveableMarker';
import PlacementMarker from '../components/PlacementMarker';
import BoardPiece from '../components/BoardPiece';
import MoveCommand from '../components/command/MoveCommand';
import PlaceCommand from '../components/command/PlaceCommand';
import Card from '../components/ui/Card';
import KingPiece from '../components/KingPiece';

const sceneConfig = {
  key: Constants.Scenes.CONTROLLER,
};

export default class GameControllerScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  init(initParams) {
    this.difficulty = initParams.difficulty;
  }

  create() {
    this.gameScene = this.scene.get(Constants.Scenes.GAME);
    this.gameUIScene = this.scene.get(Constants.Scenes.GAMEUI);
    this.state = Constants.GameState.READY;

    this.players = this.createPlayers();
    this.interactionModel = new InteractionModel(this.players);
    this.board = this.createBoard(this.players);
    this.placementMarkers = [];

    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleUndoClick = this.handleUndoClick.bind(this);
    this.handleEndTurnClick = this.handleEndTurnClick.bind(this);
    this.handlePieceInHandSelection = this.handlePieceInHandSelection.bind(this);
    this.handlePiecePlacement = this.handlePiecePlacement.bind(this);

    this.scene.launch(Constants.Scenes.GAME, 
      { players: this.players, board: this.board, interactionModel: this.interactionModel }
    );
    this.scene.launch(Constants.Scenes.GAMEUI,
      { players: this.players,
        board: this.board,
        interactionModel: this.interactionModel,
        onMenuClick: this.handleMenuClick,
        onUndoClick: this.handleUndoClick,
        onEndTurnClick: this.handleEndTurnClick,
        onPieceSelection: this.handlePieceInHandSelection
      }
    );
    Events.on('piece-moved', this.handleMoveCompleted, this);
    this.events.on('shutdown', this.clearEvents, this);
  }

  createPlayers() {
    return [
      new PlayerModel(1, Constants.PlayerType.HUMAN, Constants.Faction.HUMAN),
      new PlayerModel(2, Constants.PlayerType.AI, this.getFaction()),
    ];
  }

  createBoard(players) {
    const model = new GameBoardModel(this.difficulty, players);
    const board = new GameBoard(this.gameScene, model);

    board.on('tiledown',this.handleTileClick, this);
    board.on('kickout', function(chessToAdd, occupiedChess, tileXYZ){
      console.error('a piece was removed from the board model: ', occupiedChess, tileXYZ);
      occupiedChess.destroy();
    });

    return board;
  }

  clearEvents() {
    Events.removeAllListeners('piece-moved');
    Events.removeAllListeners('piece-added');
    Events.removeAllListeners('piece-removed');
    Events.removeAllListeners('alert');
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

  handleTileClick(pointer, tileXY) {
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
          selectedObject = pieces[pieces.length - 1];
        }
        
        if (selectedObject instanceof BoardPiece) {
          this.handlePieceSelection(selectedObject);
        }

        if (selectedObject instanceof MoveableMarker) {
          this.handlePieceMovement(selectedObject);
        }
        break;
      }
      default:
        break;
    }
  }

  handlePieceSelection(selectedPiece) {
    this.clearSelection();

    const { playerTurn, commands } = this.interactionModel;
    if (isKingOnTheBoard(playerTurn) || commands.length > 0 || playerTurn !== selectedPiece.getPlayer()) {
      this.interactionModel.selectedPiece = selectedPiece;
      selectedPiece.setTint(Constants.Color.YELLOW_HIGHLIGHT);
      selectedPiece.showMoveableArea();
    } else {
      Events.emit('alert', 'You can only move a piece after the king is placed on the board.');
    }
  }

  handlePieceInHandSelection(pieceInHand) {
    switch (this.state) {
      case Constants.GameState.READY: {
        this.clearSelection();
        // Check if selected card belongs to the player that has the turn.
        if (pieceInHand && this.interactionModel.pieceCanBeAdded(pieceInHand)) {
          pieceInHand.setSelected(true);
          this.interactionModel.selectedPiece = pieceInHand;
          const allowedTiles = this.board.showInitialPlacementPositions(pieceInHand.getPlayer());
          this.showPlacementArea(allowedTiles, pieceInHand);
        }
        break;
      }
      default:
        break;
    }
  }

  handlePieceMovement(selectedMarker) {
    if (this.interactionModel.selectedPieceCanMove()) {
      this.state = Constants.GameState.PIECE_MOVING;
      this.execute(new MoveCommand({
        interactionModel: this.interactionModel,
        selectedMarker,
        blockInput: () => this.state = Constants.GameState.PIECE_MOVING
      }));

      selectedMarker.setFillStyle(Constants.Color.RED);
    }
  }

  handlePiecePlacement(selectedCard, tileXY) {
    this.execute(new PlaceCommand({ board: this.board, selectedCard, tileXY }));
    this.clearSelection();
  }

  handleMoveCompleted() {
    this.state = Constants.GameState.READY;
  }

  handleMenuClick() {
    this.scene.stop(Constants.Scenes.GAMEUI);
    this.scene.stop(Constants.Scenes.GAME);
    this.scene.start(Constants.Scenes.TITLE);
  }

  handleUndoClick() {
    const command = this.interactionModel.commands.pop();
    command.undo();
    this.clearSelection();
    return this.interactionModel.commands;
  }

  handleEndTurnClick() {
    const { currentTurn, playerTurn } = this.interactionModel;
    if (currentTurn === 7 || currentTurn === 8) {
      if (!isKingOnTheBoard(playerTurn)) {
        return Constants.Turn.NEED_KING;
      }
    }

    const endGame = this.isGameWon();
    if (endGame) {
      this.state = Constants.GameState.END_GAME;
      return endGame;
    }

    this.interactionModel.changePlayerTurn();
    this.interactionModel.incrementTurn();
    this.clearSelection();

    if (!this.playerHasValidAction()) {
      return Constants.Turn.SKIP_TURN;
    }

    return Constants.Turn.NEXT_TURN;
  }

  execute(command) {
    command.execute();
    this.interactionModel.commands.push(command);
  }

  showPlacementArea(allowedTiles, selectedCard) {
    this.hidePlacementArea();
    for (let i = 0; i < allowedTiles.length; i++) {
      const fillColor = this.interactionModel.playerTurn === selectedCard.getPlayer() ? Constants.Color.DARK_RED : Constants.Color.GREY;
      this.placementMarkers.push(new PlacementMarker(this.board, allowedTiles[i], selectedCard, this.handlePiecePlacement, fillColor));
    }
    return this;
  }

  hidePlacementArea() {
    for (let i = 0; i < this.placementMarkers.length; i++) {
      this.placementMarkers[i].destroy();
    }
    this.placementMarkers.length = 0;
  }

  clearSelection() {
    const selectedPiece = this.interactionModel.selectedPiece;
    if (selectedPiece instanceof BoardPiece) {
      selectedPiece.hideMoveableArea();
      selectedPiece.clearTint();
    }

    if (selectedPiece instanceof Card) {
      selectedPiece.setSelected(false);
      this.hidePlacementArea();
    }

    this.interactionModel.selectedPiece = undefined;
  }

  isGameWon() {
    const pieces = getAllPieces(this.board).filter(piece => piece instanceof KingPiece);
    for (const piece of pieces) {
      if (isPieceSurrounded(this.board, piece)) {
        if (piece.getPlayer().getNumber() === 1) {
          return Constants.Turn.DEFEAT;
        } else {
          return Constants.Turn.VICTORY;
        }
      }
    }
    return false;
  }

  playerHasValidAction() {
    const { playerTurn } = this.interactionModel;
    let canPlacePiece = false;
    if (!playerTurn.isHandEmpty()) {
      canPlacePiece = this.board.showInitialPlacementPositions(playerTurn).length > 0;
    }

    let canMovePiece = false;
    const playerPieces = getAllPiecesOfPlayer(this.board, playerTurn);
    playerPieces.forEach(piece => {
      if (piece.getDestinationTiles().length > 0) {
        canMovePiece = true;
      }
    });
    
    return canPlacePiece || canMovePiece;
  }
}
