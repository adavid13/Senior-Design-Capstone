import { Constants } from '../utils/constants';
import { getPieceTexture, getDisplayName } from '../utils/piecesUtils';
import BoardPiece from './BoardPiece';

export default class KnightPiece extends BoardPiece {
  constructor({ board, player, tileXY, faction }) {
    const type = Constants.Pieces.KNIGHT;
    super({ board, player, tileXY, texture: getPieceTexture(type, faction) });
    this.movingPoints = 22;
    this.faction = faction;
    this.type = type;
    this._displayName = getDisplayName(type, faction);
  }
}