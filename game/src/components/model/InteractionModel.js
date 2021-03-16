export default class InteractionModel {
  _currentTurn;
  _playerTurn;
  _selectedPiece;
  _moveHistory;
  
  constructor(players) {
    this._currentTurn = 1;
    this._players = players;
    this._playerTurn = 0;
    this._commands = [];
    this._moveHistory = new Array();
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

  static setMoveHistory = function(move){
    this._moveHistory = move;
  }

  static getMoveHistory() {
    return this._moveHistory;
  }

}