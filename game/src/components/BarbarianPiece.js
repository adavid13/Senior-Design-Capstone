import { Constants } from '../utils/constants';
import MoveableMarker from './MoveableMarker';
import BoardPiece from './BoardPiece';

function getTexture(faction) {
  if (faction === Constants.Faction.ANIMAL) {
    return 'animalBarbarian';
  } else if(faction === Constants.Faction.HUMAN) {
    return 'humanBarbarian';
  } else {
    return 'monsterBarbarian';
  }
}

function getDisplayName(faction) {
  if (faction === Constants.Faction.ANIMAL) {
    return 'Boar';
  } else if(faction === Constants.Faction.HUMAN) {
    return 'Barbarian';
  } else {
    return 'Orc';
  } 
}

export default class BarbarianPiece extends BoardPiece {
  constructor(board, tileXY, faction) {
    super(board, tileXY, getTexture(faction));
    this.movingPoints = 3;
    this.faction = faction;
    this.type = Constants.Pieces.BARBARIAN;
    this._displayName = getDisplayName(faction);
  }

  /**
   * This override manually calculates (without the use of pathfinder.findArea) the
   * allowable move tiles.
   */ 
  showMoveableArea() {
    this.hideMoveableArea();
    const destinationArray = this.findPath().destinationArray;
    for (let i = 0, cnt = destinationArray.length; i < cnt; i++) {
      this.markers.push(new MoveableMarker(this, destinationArray[i]));
    }
    return this;
  }

  findPath() {
    const board = this.rexChess.board;
    const destinationArray = [];
    const paths = [];
    let costOneTiles = this.pathFinder.findArea(this.movingPoints).filter(tile => tile.cost === 1);
    costOneTiles = costOneTiles.map(costOneTile => ({ ...costOneTile, z:'pathfinderLayer' }));
    for (const costOneTile of costOneTiles) {
      const costTwoTiles = [];
      const costOneTileNeighbors = board
        .tileXYArrayToChessArray(board.getNeighborTileXY(costOneTile, null))
        .filter(neighbor => neighbor instanceof BoardPiece && neighbor !== this);
      for (const costOneTileNeighbor of costOneTileNeighbors) {
        const moveDirection = board.directionBetween(costOneTile, costOneTileNeighbor);
        const adjacentDirections = [((moveDirection - 1) % 6 + 6) % 6, (moveDirection + 1) % 6];
        adjacentDirections.forEach(dir => {
          let neighborAtDir = board.getNeighborChess(costOneTile, dir);
          const nextTile = board.getNeighborTileXY(costOneTile, dir);

          const dirc = board.directionBetween(costOneTile, nextTile);
          const adj = [((dirc - 1) % 6 + 6) % 6, (dirc + 1) % 6];
          const neighborAtDir0 = board.getNeighborChess(costOneTile, adj[0]);
          const neighborAtDir1 = board.getNeighborChess(costOneTile, adj[1]);
          if (!(neighborAtDir0 && neighborAtDir0 !== this && neighborAtDir1 && neighborAtDir1 !== this)) {
            // Check if tile is empty and is not the current costOneTile
            if ((!neighborAtDir || !(neighborAtDir instanceof BoardPiece)) && (nextTile.x !== this.rexChess.tileXYZ.x || nextTile.y !== this.rexChess.tileXYZ.y) && !costTwoTiles.find(tile => tile.x === nextTile.x && tile.y === nextTile.y)) 
              costTwoTiles.push({ ...nextTile, z: 'pathfinderLayer' });
          }
        });
      }
      for (const costTwoTile of costTwoTiles) {
        const costThreeTiles = [];
        const costTwoTileNeighbors = board
          .tileXYArrayToChessArray(board.getNeighborTileXY(costTwoTile, null))
          .filter(neighbor => neighbor instanceof BoardPiece && neighbor !== this);
        for (const costTwoTileNeighbor of costTwoTileNeighbors) {
          const moveDirection = board.directionBetween(costTwoTile, costTwoTileNeighbor);
          const adjacentDirections = [((moveDirection - 1) % 6 + 6) % 6, (moveDirection + 1) % 6];
          adjacentDirections.forEach(dir => {
            let neighborAtDir = board.getNeighborChess(costTwoTile, dir)
            const nextTile = board.getNeighborTileXY(costTwoTile, dir);

            const dirc = board.directionBetween(costTwoTile, nextTile);
            const adj = [((dirc - 1) % 6 + 6) % 6, (dirc + 1) % 6];
            const neighborAtDir0 = board.getNeighborChess(costTwoTile, adj[0]);
            const neighborAtDir1 = board.getNeighborChess(costTwoTile, adj[1]);
            if (!(neighborAtDir0 && neighborAtDir0 !== this && neighborAtDir1 && neighborAtDir1 !== this)) {
              // Check if tile is empty and is not the current costOneTile
              if ((!neighborAtDir || !(neighborAtDir instanceof BoardPiece)) && (nextTile.x !== costOneTile.x || nextTile.y !== costOneTile.y) && !costThreeTiles.find(tile => tile.x === nextTile.x && tile.y === nextTile.y)) {
                costThreeTiles.push(nextTile);
                destinationArray.push(nextTile);
                paths.push([ 
                  { x: costOneTile.x, y: costOneTile.y, cost: 1 },
                  { x: costTwoTile.x, y: costTwoTile.y, cost: 1 },
                  { x: nextTile.x, y: nextTile.y, cost: 1 }
                ]);
              }               
            }
          });
        }
      }
    }
    return { destinationArray, paths };
  }

  /**
   * This override is to control the tileZ of the piece before
   * moving through the other pieces
   */ 
  moveToTile(destinationTile) {
    if (this.moveTo.isRunning) return false;
    this.previousTileXYZ = this.rexChess.tileXYZ;
    const result = this.findPath(destinationTile);
    this.rexChess.setTileZ(`pathfinderLayer-${this.rexChess.$uid}`);
    for (let i = 0; i < result.paths.length; i++) {
      if (result.paths[i][2].x === destinationTile.x && result.paths[i][2].y === destinationTile.y) {
        this.moveAlongPath(result.paths[i]);
        return true;
      }
    }
  }
}
