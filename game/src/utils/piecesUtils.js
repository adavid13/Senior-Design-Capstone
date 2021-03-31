import BoardPiece from '../components/BoardPiece';
import { Constants } from './constants';

/**
 * Returns all board pieces. All markers are excluded
 */
export function getAllPieces(board) {
  return board.getAllChess().filter(piece => {
    return piece instanceof BoardPiece;
  });
}

/**
 * Returns all board pieces of the given player
 */
export function getAllPiecesOfPlayer(board, player) {
  return board.getAllChess().filter(piece => {
    return piece instanceof BoardPiece && piece.getPlayer() === player;
  });
}

/**
 * Returns all board pieces at a specific tileZ. All markers are excluded
 */
export function getAllPiecesAtTileZ(board, tileZ) {
  return board.getAllChess().filter(piece => {
    return piece instanceof BoardPiece && piece.rexChess.tileXYZ.z === tileZ;
  });
}

/**
 * Returns all board pieces at a specific tile. Excludes markers, or pieces at a specific
 * tileZ if passed in the argument (excludedTileZ is optional)
 */
export function getAllPiecesAtTileXY(board, tileXY, excludedTileZ) {
  return board
    .tileXYToChessArray(tileXY.x, tileXY.y)
    .filter(piece => piece instanceof BoardPiece && piece.rexChess.tileXYZ.z !== excludedTileZ);
}

/**
 * Returns all board pieces that are neighbors of a specific tile.
 * Pieces in all layers will be returned. the regular function from the lib
 * board.getNeighborChess(tile, null) will only return pieces that are at
 * the same tileZ layer as tile in the arguments.
 */
export function getAllNeighborsOfTileXY(board, tileXY) {
  return board.tileXYArrayToChessArray(board.getNeighborTileXY(tileXY, null))
    .filter(piece => piece instanceof BoardPiece);
}

/**
 * Return true if a specific tile on the board has an opponents piece as neighbor
 */
export function tileTouchesOpponentPiece(board, player, tile) {
  const neighbors = getAllNeighborsOfTileXY(board, tile);
  return neighbors.some(neighbor => neighbor.getPlayer() !== player);
}

/**
 * Return true if player already placed the king in the board
 */
export function isKingOnTheBoard(player) {
  return player.getPiecesInHand()[Constants.Pieces.KING] === 0;
}

/**
 * Return true if the piece is surrounded. No distinction between friendlies or enemies
 */
export function isPieceSurrounded(board, piece) {
  const tileXYZ = piece.rexChess.tileXYZ;
  const neighbors = board.getNeighborChess(tileXYZ, null);
  return neighbors.length >= 6;
}

/**
 * Returns the texture string referenced in the assetManifest for the piece
 * given the type and the faction
 */
export function getPieceTexture(type, faction) {
  const mapping = {
    [Constants.Faction.ANIMAL]: {
      [Constants.Pieces.KING]: 'animalKing',
      [Constants.Pieces.STEALTH]: 'animalStealth',
      [Constants.Pieces.KNIGHT]: 'animalKnight',
      [Constants.Pieces.MAGE]: 'animalMage',
      [Constants.Pieces.BARBARIAN]: 'animalBarbarian',
    },
    [Constants.Faction.HUMAN]: {
      [Constants.Pieces.KING]: 'humanKing',
      [Constants.Pieces.STEALTH]: 'humanStealth',
      [Constants.Pieces.KNIGHT]: 'humanKnight',
      [Constants.Pieces.MAGE]: 'humanMage',
      [Constants.Pieces.BARBARIAN]: 'humanBarbarian',
    },
    [Constants.Faction.MONSTER]: {
      [Constants.Pieces.KING]: 'monsterKing',
      [Constants.Pieces.STEALTH]: 'monsterStealth',
      [Constants.Pieces.KNIGHT]: 'monsterKnight',
      [Constants.Pieces.MAGE]: 'monsterMage',
      [Constants.Pieces.BARBARIAN]: 'monsterBarbarian',
    }
  };
  return mapping[faction][type];
}

/**
 * Returns the display name for the piece given the type and the faction
 */
export function getDisplayName(type, faction) {
  const mapping = {
    [Constants.Faction.ANIMAL]: {
      [Constants.Pieces.KING]: 'Pig King',
      [Constants.Pieces.STEALTH]: 'Mouse',
      [Constants.Pieces.KNIGHT]: 'Horse',
      [Constants.Pieces.MAGE]: 'Snake',
      [Constants.Pieces.BARBARIAN]: 'Boar',
    },
    [Constants.Faction.HUMAN]: {
      [Constants.Pieces.KING]: 'King',
      [Constants.Pieces.STEALTH]: 'Rogue',
      [Constants.Pieces.KNIGHT]: 'Knight',
      [Constants.Pieces.MAGE]: 'Mage',
      [Constants.Pieces.BARBARIAN]: 'Barbarian',
    },
    [Constants.Faction.MONSTER]: {
      [Constants.Pieces.KING]: 'Skeleton King',
      [Constants.Pieces.STEALTH]: 'Ghost',
      [Constants.Pieces.KNIGHT]: 'Witch',
      [Constants.Pieces.MAGE]: 'Warlock',
      [Constants.Pieces.BARBARIAN]: 'Orc',
    }
  };
  return mapping[faction][type];
}

export function createPieceId(player, type, id) {
  const mapping = {
    [Constants.Pieces.KING]: 'Q',
    [Constants.Pieces.STEALTH]: 'G',
    [Constants.Pieces.KNIGHT]: 'A',
    [Constants.Pieces.MAGE]: 'B',
    [Constants.Pieces.BARBARIAN]: 'S',
  };

  const playerMapping = {
    1: 'w',
    2: 'b'
  };

  return playerMapping[player.getNumber()] + mapping[type] + id;
}
