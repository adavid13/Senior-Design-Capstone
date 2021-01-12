import graphlib from '@dagrejs/graphlib';
import { createBoardAsGraph, addPieceToGraph } from './graph';

/**
 * This function verifies if moving 'this' piece to location tileXY does not
 * break the continuity of the board. All piece must be connected as a single
 * graph component.
 */
export function verifyBoardContinuityOnMove(piece, tileXY) {
  let graph = createBoardAsGraph(piece);
  if (graphlib.alg.components(graph).length > 1) return false;

  graph = addPieceToGraph(piece, graph, tileXY);
  return graphlib.alg.components(graph).length == 1;
}

/**
 * This function return the adjacent direction of a given direction in a hex pattern
 * ie: direction 2, adjacent [1, 3];  direction 0, adjacent [5, 1]
 */
export function getAdjacentDirections(direction) {
 return [((direction - 1) % 6 + 6) % 6, (direction + 1) % 6];
}

/**
 * This function return the first free tile in the given direction from a source tile
 */
export function findFreeTileAtDirection(board, sourceTile, direction) {
  let nextNeighbor = board.getNeighborChess(sourceTile, direction);
  let nextTile = board.getTileXYAtDirection(sourceTile, direction, 1);
  while (nextNeighbor) {
    nextTile = nextNeighbor.rexChess.tileXYZ;
    nextNeighbor = board.getNeighborChess(nextNeighbor, direction);
  }
  return board.getNeighborTileXY(nextTile, direction);
}

/**
 * This function checks if the piece can physically slide from a given pieceTile to the nextTile
 */
export function canPieceSlideToTile(board, piece, pieceTile, nextTile) {
  const moveDirection = board.directionBetween(pieceTile, nextTile);
  const adjacentDirections = getAdjacentDirections(moveDirection);
  const tileXYZ = { x: pieceTile.x, y: pieceTile.y, z: 'pathfinderLayer' };
  const neighborAtDir0 = board.getNeighborChess(tileXYZ, adjacentDirections[0]);
  const neighborAtDir1 = board.getNeighborChess(tileXYZ, adjacentDirections[1]);
  return !(neighborAtDir0 && neighborAtDir0 !== piece && neighborAtDir1 && neighborAtDir1 !== piece);
}