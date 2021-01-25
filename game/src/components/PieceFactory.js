import { Constants } from '../utils/constants';
import KingPiece from './KingPiece';
import BarbarianPiece from './BarbarianPiece';
import MagePiece from './MagePiece';
import StealthPiece from './StealthPiece';
import KnightPiece from './KnightPiece';

const pieces = { 
  [Constants.Pieces.KING]: KingPiece,
  [Constants.Pieces.BARBARIAN]: BarbarianPiece,
  [Constants.Pieces.MAGE]: MagePiece,
  [Constants.Pieces.STEALTH]: StealthPiece,
  [Constants.Pieces.KNIGHT]: KnightPiece
};

export function createPiece(type, attributes) {
  const Piece = pieces[type];
  return new Piece(attributes);
}