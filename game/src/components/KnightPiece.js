import { Constants } from '../utils/constants';
import { getPieceTexture, getDisplayName } from '../utils/piecesUtils';
import BoardPiece from './BoardPiece';

export default class KnightPiece extends BoardPiece {
  constructor({ board, player, id, tileXY, faction }) {
    const type = Constants.Pieces.KNIGHT;
    super({ board, player, id, tileXY, texture: getPieceTexture(type, faction) });
    this.movingPoints = 30;
    this.faction = faction;
    this.type = type;
    this._displayName = getDisplayName(type, faction);
    this.moveTo.setSpeed(550);
  }

  animationFrame(texture) {
    return [0, 1, 2, 3, 0].map(frame => ({ key: texture, frame }));
  }
}