export default class InteractionModel {
  _currentTurn;
  _playerTurn;
  _selectedPiece;
  
  constructor(players) {
    this._currentTurn = 0;
    this._players = players;
    this._playerTurn = 0;
  }

  get playerTurn() {
    return this._players[this._playerTurn];
  }

  changePlayerTurn() {
    this._playerTurn = (this._playerTurn + 1) % 2;
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
  
  selectedPieceCanMove() {
    return this.selectedPiece.getPlayer() === this.playerTurn;
  }
}
