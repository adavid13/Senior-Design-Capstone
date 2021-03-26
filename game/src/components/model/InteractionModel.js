import { Constants } from '../../utils/constants';

export default class InteractionModel {
  _currentTurn;
  _playerTurn;
  _selectedPiece;
  _moveHistory;
  
  constructor(players, difficulty) {
    this._currentTurn = 1;
    this._players = players;
    this._playerTurn = 0;
    this._commands = [];

    let aiDifficulty;
    if (difficulty === Constants.Difficulty.INTERMEDIATE) {
      aiDifficulty = 2;
    } else if (difficulty === Constants.Difficulty.ADVANCED) {
      aiDifficulty = 3;
    } else {
      aiDifficulty = 1;
    }

    this._moveHistory = ['Base', aiDifficulty.toString(), 'InProgress', 'White[1]'];
  }

  get playerTurn() {
    return this._players[this._playerTurn];
  }

  changePlayerTurn() {
    this._playerTurn = (this._playerTurn + 1) % 2;
    this.clearCommands();
  }

  get selectedPiece() {
    return this._selectedPiece;
  }

  set selectedPiece(piece)  {
    this._selectedPiece = piece;
  }

  get currentTurn() {
    return this._currentTurn;
  }

  incrementTurn() {
    this._currentTurn += 1;
    this._moveHistory[3] = this._playerTurn === 0 ? 'White[' + this._currentTurn + ']' : 'Black[' + this._currentTurn + ']';
  }

  get commands() {
    return this._commands;
  }

  clearCommands() {
    while(this.commands.length > 0) {
      this.commands.pop();
    }
  }

  pieceCanBeAdded(card) {
    return this.pieceCanMove(card);
  }

  pieceCanMove(piece) {
    return piece.getPlayer() === this.playerTurn && this.commands.length === 0;
  }

  selectedPieceCanMove() {
    return this.selectedPiece.getPlayer() === this.playerTurn && this.commands.length === 0;
  }

  addToHistory(move) {
    this._moveHistory.push(move);
  }

  removeFromHistory() {
    this._moveHistory.pop();
  }

  getMoveHistory() {
    return this._moveHistory;
  }
}