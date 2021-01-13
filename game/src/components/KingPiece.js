import { Constants } from '../utils/constants';
import BoardPiece from './BoardPiece';

function getTexture(faction) {
  if (faction === Constants.Faction.ANIMAL) {
    return 'animalKing';
  } else if(faction === Constants.Faction.HUMAN) {
    return 'humanKing';
  } else {
    return 'monsterKing';
  }
}

function getDisplayName(faction) {
  if (faction === Constants.Faction.ANIMAL) {
    return 'Pig King';
  } else if(faction === Constants.Faction.HUMAN) {
    return 'King';
  } else {
    return 'Skeleton King';
  } 
}

export default class KingPiece extends BoardPiece {
  constructor(board, player, tileXY, faction) {
    super(board, player, tileXY, getTexture(faction));
    this.movingPoints = 1;
    this.faction = faction;
    this.type = Constants.Pieces.KING;
    this._displayName = getDisplayName(faction);
  }
}