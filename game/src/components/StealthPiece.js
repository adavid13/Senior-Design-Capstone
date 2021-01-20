import { Constants } from '../utils/constants';
import { verifyBoardContinuityOnMove, findFreeTileAtDirection } from '../utils/boardUtils';
import { getAllNeighborsOfTileXY, getAllPiecesAtTileXY, getPieceTexture, getDisplayName } from '../utils/piecesUtils';
import MoveableMarker from './MoveableMarker';
import BoardPiece from './BoardPiece';

export default class StealthPiece  extends BoardPiece {
  constructor({ board, player, tileXY, faction }) {
    const type = Constants.Pieces.STEALTH;
    super({ board, player, tileXY, texture: getPieceTexture(type, faction) });
    this.movingPoints = undefined;
    this.faction = faction;
    this.type = type;
    this._displayName = getDisplayName(type, faction);
    this.canOverlap = true;
    this.pathFinder.occupiedTest = false;
  }

  /**
   * This override changes the pathfinder from A* to straight line
   */ 
  createPathfinder(scene) {
    this.pathFinder = scene.rexBoard.add.pathFinder(this, {
      occupiedTest: false,
      cacheCost: false,
      cost: 1,
      pathMode: 2
    });
  }

  /**
   * This override manually calculates (without the use of pathfinder.findArea) the
   * allowable move tiles.
   */ 
  showMoveableArea() {
    this.hideMoveableArea();
    const { board, tileXYZ } = this.rexChess;
    const tileXYArray = [];
    const neighbors = getAllNeighborsOfTileXY(board, tileXYZ)
      .filter(piece => piece.rexChess.tileXYZ.z === 'pathfinderLayer');

    for (const neighbor of neighbors) {
      const direction = board.directionBetween(this, neighbor);
      const destinationTile = findFreeTileAtDirection(board, tileXYZ, direction);
      if (verifyBoardContinuityOnMove(this, destinationTile)) {
        // Keep duplicates out of the array
        if (!tileXYArray.find(tileXY => tileXY.x === destinationTile.x && tileXY.y === destinationTile.y)) {
          tileXYArray.push({ ...destinationTile, cost: 1 });
        }
      }
    }

    for (let i = 0, cnt = tileXYArray.length; i < cnt; i++) {
      this.markers.push(new MoveableMarker(this, tileXYArray[i], !this.scene.getInteractionModel().pieceCanMove(this)));
    }
    return this;
  }

  /**
   * This override is to control the tileZ of the piece before
   * moving through the other pieces
   */ 
  moveToTile(destinationTile) {
    if (this.moveTo.isRunning) return false;
    this.previousTileXYZ = this.rexChess.tileXYZ;
    this.rexChess.setTileZ(`pathfinderLayer-${this.rexChess.$uid}`);
    const tileXYArray = this.pathFinder.findPath(destinationTile);
    this.moveAlongPath(tileXYArray);
    return true;
  }

  /**
   * This override removes the repositioning of the pieces within a single tile.
   * Since the stealth piece is just passing through, there is no need to change
   * the position.
   */ 
  reorderTiles(gameObject) {
    const board = gameObject.rexChess.board;

    // On previous tile, send pieces back to base layer
    const previousTilePieces = getAllPiecesAtTileXY(board, gameObject.previousTileXYZ, null);
    const pieceAtBaseLayer = previousTilePieces.find(piece => piece.rexChess.tileXYZ.z === 'pathfinderLayer');
    if (previousTilePieces.length > 0 && !pieceAtBaseLayer){
      previousTilePieces[0].rexChess.setTileZ('pathfinderLayer');
    }

    // On destination tile, send piece back to base layer if it was not occupied
    const destinationTile = gameObject.rexChess.tileXYZ;
    if (!board.contains(destinationTile.x, destinationTile.y, 'pathfinderLayer'))
      gameObject.rexChess.setTileZ('pathfinderLayer');
  }
}