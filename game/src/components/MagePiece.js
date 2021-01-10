import { Constants } from '../utils/constants';
import BoardPiece from './BoardPiece';

function getTexture(faction) {
  if (faction === Constants.Faction.ANIMAL) {
    return 'animalMage';
  } else if(faction === Constants.Faction.HUMAN) {
    return 'humanMage';
  } else {
    return 'monsterMage';
  }
}

function getDisplayName(faction) {
  if (faction === Constants.Faction.ANIMAL) {
    return 'Snake';
  } else if(faction === Constants.Faction.HUMAN) {
    return 'Mage';
  } else {
    return 'Warlock';
  } 
}

export default class MagePiece  extends BoardPiece {
  constructor(board, tileXY, faction) {
    super(board, tileXY, getTexture(faction));
    this.setDepth(4);
    this.movingPoints = 1;
    this.faction = faction;
    this.type = Constants.Pieces.MAGE;
    this._displayName = getDisplayName(faction);
    this.canOverlap = true;
    this.pathFinder.occupiedTest = false;
  }
}