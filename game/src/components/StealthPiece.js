import { Constants } from '../utils/constants';
import MoveableMarker from './MoveableMarker';
import BoardPiece from './BoardPiece';

function getTexture(faction) {
  if (faction === Constants.Faction.ANIMAL) {
    return 'animalStealth';
  } else if(faction === Constants.Faction.HUMAN) {
    return 'humanStealth';
  } else {
    return 'monsterStealth';
  }
}

function getDisplayName(faction) {
  if (faction === Constants.Faction.ANIMAL) {
    return 'Mouse';
  } else if(faction === Constants.Faction.HUMAN) {
    return 'Rogue';
  } else {
    return 'Ghost';
  } 
}

export default class StealthPiece  extends BoardPiece {
  constructor(board, tileXY, faction) {
    super(board, tileXY, getTexture(faction));
    this.movingPoints = undefined;
    this.faction = faction;
    this.type = Constants.Pieces.STEALTH;
    this._displayName = getDisplayName(faction);
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
    const board = this.rexChess.board;
    const tileXYArray = [];
    const neighbors = board.tileXYArrayToChessArray(board.getNeighborTileXY(this.rexChess.tileXYZ, null)).filter(piece => piece.rexChess.tileXYZ.z === 'pathfinderLayer');
    for (const neighbor of neighbors) {
      const direction = board.directionBetween(this, neighbor);
      let tileXYZ = neighbor.rexChess.tileXYZ;
      let nextNeighbor = board.getNeighborChess(neighbor, direction);
      while (nextNeighbor) {
        tileXYZ = nextNeighbor.rexChess.tileXYZ;
        nextNeighbor = board.getNeighborChess(nextNeighbor, direction);
      }
      const destinationTile = board.getNeighborTileXY(tileXYZ, direction);
      if (this.isBoardContinuous(this, { x: destinationTile.x, y: destinationTile.y })) {
        if (!tileXYArray.find(tileXY => tileXY.x === destinationTile.x && tileXY.y === destinationTile.y)) {
          tileXYArray.push({ ...destinationTile, cost: 1 });
        }
      }
    }

    for (let i = 0, cnt = tileXYArray.length; i < cnt; i++) {
      this.markers.push(new MoveableMarker(this, tileXYArray[i]));
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

    // On previous tile, send piece back to base layer
    const previousTileXYZ = gameObject.previousTileXYZ;
    const previousTilePieces = board
      .tileXYToChessArray(previousTileXYZ.x, previousTileXYZ.y)
      .filter((piece) => piece instanceof BoardPiece);
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