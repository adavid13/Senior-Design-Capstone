import { Graph } from '@dagrejs/graphlib';
import { getAllPiecesAtTileXY, getAllPiecesAtTileZ } from './piecesUtils';

export function createBoardAsGraph(sourcePiece) {
  const graph = new Graph({ directed: false });
  const board = sourcePiece.rexChess.board;
  const pieces = getAllPiecesAtTileZ(board, 'pathfinderLayer').filter(piece => piece !== sourcePiece);

  // Add nodes and vertices (omit edges to the piece being moved)
  pieces.forEach((piece) => { graph.setNode(piece.rexChess.$uid); });
  pieces.forEach((piece) => { createEdgesForPiece(graph, board, piece, sourcePiece); });

  // Add Nodes and vertices to pieces that might eventually be at the same tile location as the piece being moved
  const tileXYZ = sourcePiece.rexChess.tileXYZ;
  const sameTilePieces = getAllPiecesAtTileXY(board, tileXYZ, 'pathfinderLayer')
    .filter(piece => piece != sourcePiece);
  sameTilePieces.forEach((piece) => { graph.setNode(piece.rexChess.$uid); });
  sameTilePieces.forEach((piece) => { createEdgesForPiece(graph, board, piece, sourcePiece); });

  return graph;
}

function createEdgesForPiece(graph, board, piece, ignoredPiece) {
  const neighbors = board.getNeighborChess(piece, null);
  const pieceUID = piece.rexChess.$uid;
  neighbors.forEach((neighbor) => {
    const neighborUID = neighbor.rexChess.$uid;
    if (neighbor != ignoredPiece && !graph.hasEdge(pieceUID, neighborUID))
      graph.setEdge(pieceUID, neighborUID);
  });
  return graph;
}

export function addPieceToGraph(sourcePiece, graph, destination) {
  const board = sourcePiece.rexChess.board;
  const pieceUID = sourcePiece.rexChess.$uid;
  graph.setNode(pieceUID);
  // Add edges to the piece considering its destination location
  const neighborPieces = board.tileXYArrayToChessArray(board.getNeighborTileXY(destination, null));
  neighborPieces.forEach((neighbor) => {
    if (neighbor != sourcePiece) {
      const neighborUID = neighbor.rexChess.$uid;
      if (!graph.hasEdge(pieceUID, neighborUID)) {
        graph.setEdge(pieceUID, neighborUID);
      }
    }
  });
  return graph;
}
