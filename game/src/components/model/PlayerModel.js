import { Constants } from '../../utils/constants';
export default class PlayerModel {
  constructor(number, playerType, faction) {
    this.number = number;
    this.playerType = playerType;
    this.faction = faction;
    this.pieces = {
      [Constants.Pieces.KING]: 1,
      [Constants.Pieces.BARBARIAN]: 2,
      [Constants.Pieces.MAGE]: 2,
      [Constants.Pieces.STEALTH]: 3,
      [Constants.Pieces.KNIGHT]: 3,
    };

    this.piecesInHand = {
      ...this.pieces
    };
  }

  getNumber() {
    return this.number;
  }

  getPlayerType() {
    return this.playerType;
  }

  getFaction() {
    return this.faction;
  }

  getPieces() {
    return this.pieces;
  }

  getPiecesInHand() {
    return this.piecesInHand;
  }

  removePieceFromHand(pieceType) {
    const piecesRemaining = this.getPiecesInHand[pieceType];
    if (piecesRemaining > 0) {
      this.getPiecesInHand[pieceType] = piecesRemaining - 1;
      return true;
    }
    return false;
  }

  addPieceToHand(pieceType) {
    this.getPiecesInHand[pieceType] = this.getPiecesInHand[pieceType] + 1;
  }
}
