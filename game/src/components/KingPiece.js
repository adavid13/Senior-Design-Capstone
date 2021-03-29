import { Constants } from '../utils/constants';
import { getPieceTexture, getDisplayName } from '../utils/piecesUtils';
import BoardPiece from './BoardPiece';

export default class KingPiece extends BoardPiece {
  constructor({ board, player, id, tileXY, faction }) {
    const type = Constants.Pieces.KING;
    super({ board, player, id, tileXY, texture: getPieceTexture(type, faction) });
    this.movingPoints = 1;
    this.faction = faction;
    this.type = type;
    this._displayName = getDisplayName(type, faction);
  }
}