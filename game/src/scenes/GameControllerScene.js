import Phaser from 'phaser';
import { Constants } from '../utils/constants';
import { isKingOnTheBoard, isPieceSurrounded, getAllPieces, getAllPiecesOfPlayer, getAllPiecesAtTileXY } from '../utils/piecesUtils';
import { getMove } from '../components/api/moveApi';
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
import Tooltip from '../components/ui/Tooltip';
import KingPiece from '../components/KingPiece';
import { BoardStateAdapter } from '../components/BoardStateAdapter';

const sceneConfig = {
  key: Constants.Scenes.CONTROLLER,
};

export default class GameControllerScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  init(initParams) {
    this.difficulty = initParams.difficulty;
    this.interfaceModel = initParams.interfaceModel;
  }

  create() {
    this.gameScene = this.scene.get(Constants.Scenes.GAME);
    this.gameUIScene = this.scene.get(Constants.Scenes.GAMEUI);
    this.state = Constants.GameState.READY;

    this.players = this.createPlayers();
    this.interactionModel = new InteractionModel(this.players, this.difficulty);
    this.board = this.createBoard(this.players);
    this.placementMarkers = [];

    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMainMenuClick = this.handleMainMenuClick.bind(this);
    this.handleRestartClick = this.handleRestartClick.bind(this);
    this.handleUndoClick = this.handleUndoClick.bind(this);
    // this.handleUiCloseClick = this.handleUiCloseClick.bind(this);
    this.handleEndTurnClick = this.handleEndTurnClick.bind(this);
    this.handlePieceInHandSelection = this.handlePieceInHandSelection.bind(this);
    this.handlePiecePlacement = this.handlePiecePlacement.bind(this);
    this.randomAction = this.randomAction.bind(this);

    this.toolTip = new Tooltip(this.gameUIScene, 0, 0, '').layout();
    this.toolTip.setVisible(false);
    this.timeout = undefined;

    this.scene.launch(Constants.Scenes.GAME, 
      { players: this.players, board: this.board, interactionModel: this.interactionModel, interfaceModel: this.interfaceModel }
    );
    this.scene.launch(Constants.Scenes.GAMEUI,
      { players: this.players,
        board: this.board,
        interactionModel: this.interactionModel,
        onRestartClick: this.handleRestartClick,
        onMainMenuClick: this.handleMainMenuClick,
        onMenuClick: this.handleMenuClick,
        onUndoClick: this.handleUndoClick,
        // onCloseClick: this.handleUiCloseClick,
        onEndTurnClick: this.handleEndTurnClick,
        onPieceSelection: this.handlePieceInHandSelection,
        randomAction: this.randomAction,
        interfaceModel: this.interfaceModel,
        difficulty: this.difficulty,
      }
    );

    this.createSounds();
    Events.on('piece-moved', this.handleMoveCompleted, this);
    this.events.on('shutdown', this.clearEvents, this);
  }

  createSounds() {
    this.thudSound = this.sound.add('thud');
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

    board.on('tiledown', this.handleTileClick, this);
    board.on('tileover', this.handleTileOver, this);
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

  handleTileOver(pointer, tileXY) {
    if (this.timeout) {
      this.toolTip.setVisible(false);
      clearTimeout(this.timeout);
    }
    
    const pieces = getAllPiecesAtTileXY(this.board, tileXY);
    if (pieces.length > 0 && this.state !== Constants.GameState.END_GAME) {
      const piece = pieces[pieces.length - 1];
      this.timeout = setTimeout(() => {
        const text = piece.displayName + '\nType: ' + piece.type;
        this.toolTip.x = pointer.x;
        this.toolTip.y = pointer.y;
        this.toolTip.setTooltipText(text);
        this.toolTip.setVisible(true);
      }, 2000);
    }
  }

  handlePieceSelection(selectedPiece) {
    this.clearSelection();

    const { playerTurn, commands } = this.interactionModel;
    if (playerTurn === this.players[0]) {
      if (isKingOnTheBoard(playerTurn) || commands.length > 0 || playerTurn !== selectedPiece.getPlayer()) {
        this.interactionModel.selectedPiece = selectedPiece;
        selectedPiece.setTint(Constants.Color.YELLOW_HIGHLIGHT);
        selectedPiece.showMoveableArea();
      } else {
        Events.emit('alert', 'You can only move a piece after the king is placed on the board.');
      }
    }
  }

  handlePieceInHandSelection(pieceInHand) {
    switch (this.state) {
      case Constants.GameState.READY: {
        this.clearSelection();
        // Check if selected card belongs to the player that has the turn.
        const { playerTurn } = this.interactionModel;
        if (playerTurn === this.players[0] && pieceInHand && this.interactionModel.pieceCanBeAdded(pieceInHand)) {
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
      this.thudSound.setVolume(this.interfaceModel.soundLevel);
      this.execute(new MoveCommand({
        interactionModel: this.interactionModel,
        board: this.board,
        selectedMarker,
        blockInput: () => this.state = Constants.GameState.PIECE_MOVING,
        moveSound: this.thudSound
      }));

      selectedMarker.setFillStyle(Constants.Color.RED);
    }
  }

  handlePiecePlacement(selectedCard, tileXY) {
    this.thudSound.setVolume(this.interfaceModel.soundLevel);
    this.execute(new PlaceCommand({ board: this.board, selectedCard, tileXY, placeSound: this.thudSound, interactionModel: this. interactionModel }));
    this.clearSelection();
  }

  handleMoveCompleted() {
    this.state = Constants.GameState.READY;
  }

  handleRestartClick() {
    this.scene.stop(Constants.Scenes.GAMEUI);
    this.scene.stop(Constants.Scenes.GAME);
    this.scene.restart();
  }

  handleMenuClick() {
    // this.state = Constants.GameState.UI;
  }

  handleMainMenuClick() {
    this.scene.stop(Constants.Scenes.GAMEUI);
    this.scene.stop(Constants.Scenes.GAME);
    this.scene.start(Constants.Scenes.TITLE);
  }

  // handleUiCloseClick() {
  //   this.state = Constants.GameState.READY;
  // }

  handleUndoClick() {
    const command = this.interactionModel.commands.pop();
    command.undo();
    this.clearSelection();
    return this.interactionModel.commands;
  }

  handleEndTurnClick(concede) {
    const { currentTurn, playerTurn } = this.interactionModel;
    if (currentTurn === 7 || currentTurn === 8) {
      if (!isKingOnTheBoard(playerTurn)) {
        return Constants.Turn.NEED_KING;
      }
    }

    const endGame = this.isGameWon();
    if (endGame || concede) {
      this.clearSelection();
      this.state = Constants.GameState.END_GAME;
      return endGame;
    }

    this.interactionModel.changePlayerTurn();
    this.interactionModel.incrementTurn();
    this.clearSelection();

    if (!this.playerHasValidAction()) {
      this.interactionModel.addToHistory('pass');
      return Constants.Turn.SKIP_TURN;
    }

    if (playerTurn.getPlayerType() === Constants.PlayerType.HUMAN) {
      setTimeout(() => { this.getAIAction(currentTurn + 1); }, 2000 );
    }
    
    const state = this.interactionModel.getMoveHistory().join(';');
    console.log("History: ", state);

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
    const kings = getAllPieces(this.board).filter(piece => piece instanceof KingPiece);
    const surroundedKings = [];
    for (const king of kings) {
      if (isPieceSurrounded(this.board, king)) {
        surroundedKings.push(king);
      }
    }

    if (surroundedKings.length > 1) {
      return Constants.Turn.DRAW;
    }

    if (surroundedKings.length === 1) {
      if (surroundedKings[0].getPlayer().getNumber() === 1) {
        return Constants.Turn.DEFEAT;
      } else {
        return Constants.Turn.VICTORY;
      }
    }
    
    return false;
  }

  playerHasValidAction() {
    const canPlacePiece = this.playerHasValidPlacement();
    const canMovePiece = this.playerHasValidMove();
    return canPlacePiece || canMovePiece;
  }

  playerHasValidMove() {
    const { playerTurn } = this.interactionModel;
    let canMovePiece = false;
    const playerPieces = getAllPiecesOfPlayer(this.board, playerTurn);
    playerPieces.forEach(piece => {
      if (piece.getDestinationTiles().length > 0) {
        canMovePiece = true;
      }
    });
    return canMovePiece;
  }

  playerHasValidPlacement() {
    const { playerTurn } = this.interactionModel;
    let canPlacePiece = false;
    if (!playerTurn.isHandEmpty()) {
      canPlacePiece = this.board.showInitialPlacementPositions(playerTurn).length > 0;
    }
    return canPlacePiece;
  }

  randomAction(piecesInHand) {
    const { playerTurn } = this.interactionModel;
    if (!isKingOnTheBoard(playerTurn)) {
      this.randomPlacement(piecesInHand);
    } else if (!playerTurn.isHandEmpty()) {
      if (!this.playerHasValidMove()) {
        this.randomPlacement(piecesInHand);
      } else if (!this.playerHasValidPlacement()) {
        this.randomMove();
      } else {
        let random = Math.floor(Math.random() * 2);
        if (random === 0) {
          this.randomMove();
        } else {
          this.randomPlacement(piecesInHand);
        }
      }
    } else {
      this.randomMove();
    }
  }

  randomPlacement(piecesInHand) {
    const { playerTurn } = this.interactionModel;
    const positions = this.board.showInitialPlacementPositions(playerTurn);
    let random = Math.floor(Math.random() * positions.length);
    const tileXY = positions[random];

    const playerPieces = piecesInHand.filter(pieceInHand => pieceInHand.getPlayer() === playerTurn);
    let selectedCard;
    if (!isKingOnTheBoard(playerTurn) && this.interactionModel.currentTurn === 7 || this.interactionModel.currentTurn === 8) {
      selectedCard = playerPieces.find(piece => piece.getType() === Constants.Pieces.KING);
    } else {
      random = Math.floor(Math.random() * playerPieces.length);
      selectedCard = playerPieces[random];
    }
    this.thudSound.setVolume(this.interfaceModel.soundLevel);
    this.execute(new PlaceCommand({ board: this.board, tileXY, selectedCard, placeSound: this.thudSound, interactionModel: this. interactionModel }));
  }

  randomMove() {
    const { playerTurn } = this.interactionModel;
    const playerPieces = getAllPiecesOfPlayer(this.board, playerTurn);
    const validPieces = playerPieces.filter(piece => piece.getDestinationTiles().length > 0);
    
    let random = Math.floor(Math.random() * validPieces.length);
    const selectedPiece = validPieces[random];

    const tiles = selectedPiece.getDestinationTiles();
    random = Math.floor(Math.random() * tiles.length);
    const selectedTile = tiles[random];

    this.thudSound.setVolume(this.interfaceModel.soundLevel);
    this.execute(new MoveCommand({
      interactionModel: this.interactionModel,
      board: this.board,
      selectedMarker: { tileXY: selectedTile, parentPiece: selectedPiece },
      blockInput: () => this.state = Constants.GameState.PIECE_MOVING,
      moveSound: this.thudSound
    }));
  }

  getAIAction(turn) {
    const history = this.interactionModel.getMoveHistory().join(';');

    getMove(history)
      .then(response => {
        const { currentTurn } = this.interactionModel;
        const allCardsNotPlayed = this.gameUIScene.getAllCardsNotPlayed();
        const aiCards = allCardsNotPlayed.filter(card => card.getPlayer() === this.players[1]);
        const action = BoardStateAdapter.convertAction(response, this.board, this.players, aiCards, this.interactionModel);
        this.thudSound.setVolume(this.interfaceModel.soundLevel);
        // check if the response from the server returned in the correct turn. Ignore otherwise.
        if (turn === currentTurn) {
          if (action?.type === 'error') {
            const { currentTurn } = this.interactionModel;
            if (turn === currentTurn) {
              this.randomAction(this.gameUIScene.getAllCardsNotPlayed());
              this.endTurnWithDelay();
            }
          } else if (action?.type === 'move') {
            this.execute(new MoveCommand({
              interactionModel: this.interactionModel,
              board: this.board,
              selectedMarker: { tileXY: action.tileXY, parentPiece: action.piece },
              blockInput: () => this.state = Constants.GameState.PIECE_MOVING,
              moveSound: this.thudSound
            }));
          } else if (action?.type === 'placement') {
            this.execute(new PlaceCommand({
              board: this.board,
              tileXY: action.tileXY,
              selectedCard: action.piece,
              placeSound: this.thudSound,
              interactionModel: this. interactionModel
            }));
          } else {
            this.randomAction(this.gameUIScene.getAllCardsNotPlayed());
          }
          this.endTurnWithDelay();
        }
      })
      .catch(error => {
        const { currentTurn } = this.interactionModel;
        if (turn === currentTurn) {
          this.randomAction(this.gameUIScene.getAllCardsNotPlayed());
          this.endTurnWithDelay();
        }
      });
  }

  

  endTurnWithDelay() {
    setTimeout(() => { this.gameUIScene.handleEndTurnClick(false); }, 2000);
  }
}
