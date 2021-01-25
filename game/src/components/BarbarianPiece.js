import { Constants } from '../utils/constants';
import { getAllNeighborsOfTileXY, getPieceTexture, getDisplayName } from '../utils/piecesUtils';
import { getAdjacentDirections, canPieceSlideToTile } from '../utils/boardUtils';
import MoveableMarker from './MoveableMarker';
import BoardPiece from './BoardPiece';

export default class BarbarianPiece extends BoardPiece {
  constructor({ board, player, tileXY, faction }) {
    const type = Constants.Pieces.BARBARIAN;
    super({ board, player, tileXY, texture: getPieceTexture(type, faction) });
    this.movingPoints = 3;
    this.faction = faction;
    this.type = type;
    this._displayName = getDisplayName(type, faction);
  }

  /**
   * This override manually calculates (without the use of pathfinder.findArea) the
   * allowable move tiles.
   */ 
  showMoveableArea() {
    this.hideMoveableArea();
    const destinationArray = this.findPath().map(path => path[path.length - 1]);
    for (let i = 0, cnt = destinationArray.length; i < cnt; i++) {
      if (!this.markers.find(marker => {
        const tileXY = marker.getTileXY();
        return tileXY.x === destinationArray[i].x && tileXY.y === destinationArray[i].y;
      })) {
        this.markers.push(new MoveableMarker(this, destinationArray[i], !this.scene.getInteractionModel().pieceCanMove(this)));
      }
    }
    return this;
  }

  findPath() {
    const board = this.rexChess.board;
    const paths = [];
    let costOneTiles = this.pathFinder.findArea(this.movingPoints).filter(tile => tile.cost === 1);
    costOneTiles = costOneTiles.map(costOneTile => ({ ...costOneTile, z:'pathfinderLayer' }));
    for (const costOneTile of costOneTiles) {
      const costTwoTiles = [];
      const costOneTileNeighbors = getAllNeighborsOfTileXY(board, costOneTile)
        .filter(neighbor => neighbor !== this);
      for (const costOneTileNeighbor of costOneTileNeighbors) {
        const moveDirection = board.directionBetween(costOneTile, costOneTileNeighbor);
        const adjacentDirections = getAdjacentDirections(moveDirection);
        adjacentDirections.forEach(dir => {
          let neighborAtDir = board.getNeighborChess(costOneTile, dir);
          const nextTile = board.getNeighborTileXY(costOneTile, dir);
          if (canPieceSlideToTile(board, this, costOneTile, nextTile)) {
            // Check if tile is empty and is not the current costOneTile
            const isNextTileEmpty = !neighborAtDir || !(neighborAtDir instanceof BoardPiece);
            const isCurrentTile = nextTile.x === this.rexChess.tileXYZ.x && nextTile.y === this.rexChess.tileXYZ.y;
            const isDuplicate = costTwoTiles.find(tile => tile.x === nextTile.x && tile.y === nextTile.y);
            if (isNextTileEmpty && !isCurrentTile && !isDuplicate) {
              costTwoTiles.push({ ...nextTile, z: 'pathfinderLayer' });
            }
          }
        });
      }
      for (const costTwoTile of costTwoTiles) {
        const costThreeTiles = [];
        const costTwoTileNeighbors = getAllNeighborsOfTileXY(board, costTwoTile)
          .filter(neighbor => neighbor !== this);
        for (const costTwoTileNeighbor of costTwoTileNeighbors) {
          const moveDirection = board.directionBetween(costTwoTile, costTwoTileNeighbor);
          const adjacentDirections = getAdjacentDirections(moveDirection);
          adjacentDirections.forEach(dir => {
            let neighborAtDir = board.getNeighborChess(costTwoTile, dir);
            const nextTile = board.getNeighborTileXY(costTwoTile, dir);
            if (canPieceSlideToTile(board, this, costTwoTile, nextTile)) {
              // Check if tile is empty and is not the current costTwoTile
              const isNextTileEmpty = !neighborAtDir || !(neighborAtDir instanceof BoardPiece);
              const isCurrentTile = nextTile.x === costOneTile.x && nextTile.y === costOneTile.y;
              const isDuplicate = costThreeTiles.find(tile => tile.x === nextTile.x && tile.y === nextTile.y);
              if (isNextTileEmpty && !isCurrentTile && !isDuplicate) {
                costThreeTiles.push(nextTile);
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
    return paths;
  }

  /**
   * This override is to control the tileZ of the piece before
   * moving through the other pieces
   */ 
  moveToTile(destinationTile) {
    if (this.moveTo.isRunning) return false;
    this.previousTileXYZ = this.rexChess.tileXYZ;
    const paths = this.findPath();
    this.rexChess.setTileZ(`pathfinderLayer-${this.rexChess.$uid}`);
    for (let i = 0; i < paths.length; i++) {
      if (paths[i][2].x === destinationTile.x && paths[i][2].y === destinationTile.y) {
        this.moveAlongPath(paths[i]);
        return true;
      }
    }
  }
}
