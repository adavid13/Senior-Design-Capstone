import { Constants } from '../utils/constants';
import { getPieceTexture, getDisplayName } from '../utils/piecesUtils';
import BoardPiece from './BoardPiece';

export default class MagePiece  extends BoardPiece {
  constructor({ board, player, tileXY, faction }) {
    const type = Constants.Pieces.MAGE;
    super({ board, player, tileXY, texture: getPieceTexture(type, faction) });
    this.setDepth(Constants.GameObjectDepth.PIECE_BACK);
    this.movingPoints = 1;
    this.faction = faction;
    this.type = type;
    this._displayName = getDisplayName(type, faction);
    this.canOverlap = true;
    this.pathFinder.occupiedTest = false;
  }
}