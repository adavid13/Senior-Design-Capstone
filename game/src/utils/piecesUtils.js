import BoardPiece from '../components/BoardPiece';

/**
 * Returns all board pieces. All markers are excluded
 */
export function getAllPieces(board) {
  return board.getAllChess().filter(piece => {
    return piece instanceof BoardPiece;
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