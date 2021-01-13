import { Constants } from '../utils/constants';
import BoardPiece from './BoardPiece';

function getTexture(faction) {
  if (faction === Constants.Faction.ANIMAL) {
    return 'animalKnight';
  } else if(faction === Constants.Faction.HUMAN) {
    return 'humanKnight';
  } else {
    return 'monsterKnight';
  }
}

function getDisplayName(faction) {
  if (faction === Constants.Faction.ANIMAL) {
    return 'Horse';
  } else if(faction === Constants.Faction.HUMAN) {
    return 'Knight';
  } else {
    return 'Witch';
  } 
}

export default class KnightPiece extends BoardPiece {
  constructor(board, player, tileXY, faction) {
    super(board, player, tileXY, getTexture(faction));
    this.movingPoints = 22;
    this.faction = faction;
    this.type = Constants.Pieces.KNIGHT;
    this._displayName = getDisplayName(faction);
  }
}