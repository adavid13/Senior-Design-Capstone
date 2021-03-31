import Phaser from 'phaser';
import MoveableMarker from './MoveableMarker';
import { Events } from './EventCenter';
import { Constants } from '../utils/constants';
import { verifyBoardContinuityOnMove, canPieceSlideToTile } from '../utils/boardUtils';
import { getAllPiecesAtTileXY, getAllNeighborsOfTileXY } from '../utils/piecesUtils';

export default class BoardPiece extends Phaser.GameObjects.Sprite {
  constructor({ board, player, tileXY, id, texture, onMoveComplete }) {
    const scene = board.scene;
    const worldXY = board.tileXYToWorldXY(tileXY.x, tileXY.y);
    super(scene, worldXY.x, worldXY.y, texture);

    this.reposition = this.reposition.bind(this);
    this.setOrigin(0.5);
    this.setScale(0.45);
    this.setDepth(Constants.GameObjectDepth.PIECE);
    scene.add.existing(this);
    board.addChess(this, tileXY.x, tileXY.y, 'pathfinderLayer');

    // add behaviors
    this.createPathfinder(scene);
    this.moveTo = scene.rexBoard.add.moveTo(this, { speed: 350 });
    this.moveTo.on('complete', (gameObject) => {
      this.reorderTiles(gameObject);
    }, this);

    this.idleAnimation = this.anims.create({
      key: 'idle',
      frames: this.animationFrame(texture),
      frameRate: 6
    });

    // private members
    this.scene = scene;
    this.id = id;
    this.player = player;
    this.onMoveComplete = onMoveComplete;
    this.movingPoints = 1;
    this.markers = [];
    this._displayName = 'BoardPiece';
    this.canOverlap = false;

    this.play({ key: 'idle', repeat: -1 });
  }

  animationFrame(texture) {
    return [0, 1, 2, 1, 0].map(frame => ({ key: texture, frame }));
  }

  set displayName(name) {
    this._displayName = name;
  }

  get displayName() {
    return this._displayName;
  }

  getPreviousTileXYZ() {
    return this.previousTileXYZ;
  }

  getPlayer() {
    return this.player;
  }

  getId() {
    return this.id;
  }

  getType() {
    return this.type;
  }

  createPathfinder(scene) {
    this.pathFinder = scene.rexBoard.add.pathFinder(this, {
      occupiedTest: true,
      cacheCost: false,
      costCallback: function (curTile, preTile, pathFinder) {
        if (!this.canSlide(this, curTile, preTile, pathFinder)) {
          return pathFinder.BLOCKER;
        }
        return 1;
      },
      costCallbackScope: this,
    });
  }

  showMoveableArea() {
    this.hideMoveableArea();
    let tileXYArray = this.getDestinationTiles();
    for (let i = 0, cnt = tileXYArray.length; i < cnt; i++) {
      this.markers.push(new MoveableMarker(this, tileXYArray[i], !this.scene.getInteractionModel().pieceCanMove(this)));
    }
    return this;
  }

  getDestinationTiles() {
    return this.pathFinder.findArea(this.movingPoints);
  }
  
  hideMoveableArea() {
    for (let i = 0, cnt = this.markers.length; i < cnt; i++) {
      this.markers[i].destroy();
    }
    this.markers.length = 0;
    return this;
  }

  /**
   * This function verifies if the moving the piece from preTile to curTile
   * does not break any of the game rules.
   */ 
  canSlide(piece, curTile, preTile, pathFinder) {
    const board = pathFinder.board;
  
    const preNeighbors = getAllNeighborsOfTileXY(board, preTile)
      .filter(neighbor => neighbor !== piece);
    const curNeighbors = getAllNeighborsOfTileXY(board, curTile)
      .filter(neighbor => neighbor !== piece);
  
    // Piece is currently in overlaping position and is at the top of the stack, any movement is allowed
    const allPiecesInCurrentTitle = getAllPiecesAtTileXY(board, preTile);
    const isTopOfStack = allPiecesInCurrentTitle[allPiecesInCurrentTitle.length - 1] === piece;
    if (piece.canOverlap && isTopOfStack && piece.rexChess.tileXYZ.z !== 'pathfinderLayer') {
      return true;
    }
  
    // Allow movement when destination tile is occupied, and piece can overlap
    if (piece.canOverlap && board.tileXYToChessArray(curTile.x, curTile.y).length > 0) {
      return verifyBoardContinuityOnMove(piece, { x: curTile.x, y: curTile.y });
    }
  
    // Verify if piece can physically slide to next tile
    if (!canPieceSlideToTile(board, piece, preTile, curTile)) 
      return false;
    
    /**
     * Verify if piece breaks the one hive rule while sliding to next tile.
     * It does not check if the resulting move create two disconnect hives.
     */ 
    for (const preNeighbor of preNeighbors) {
      const commonNeighbor = curNeighbors.find(curNeighbor => curNeighbor === preNeighbor);
      if (commonNeighbor) {
        return verifyBoardContinuityOnMove(piece, { x: curTile.x, y: curTile.y });
      }
    }

    return false;
  }

  moveToPreviousTile() {
    this.moveToTile(this.previousTileXYZ);
  }

  moveToTile(destinationTile) {
    if (this.moveTo.isRunning) return false;
    this.reorderDestinationTile(destinationTile);
    this.previousTileXYZ = this.rexChess.tileXYZ;
    const tileXYArray = this.pathFinder.getPath(destinationTile);
    this.moveAlongPath(tileXYArray);
    return true;
  }

  moveAlongPath(path) {
    if (path.length === 0) {
      this.hideMoveableArea();
      this.pathFinder.findArea(this.movingPoints);
      Events.emit('piece-moved', this);
      return;
    }

    const nextTile = path[0];
    this.moveTo.once('complete', function () {
      this.moveAlongPath(path.slice(1));
    }, this);
    
    this.moveTo.moveTo(nextTile);
    return this;
  }

  /**
   * This function handles the layering of pieces, when pieces occupy the same tile.
   * This is due to the limitation of the board library that does no permit multiple
   * pieces to occupy the same tile at the same layerZ.
   */ 
  reorderTiles(gameObject) {
    const board = gameObject.rexChess.board;

    // On previous tile, send piece back to base layer
    const previousTilePieces = getAllPiecesAtTileXY(board, gameObject.previousTileXYZ, null);
    const pieceAtBaseLayer = previousTilePieces.find(piece => piece.rexChess.tileXYZ.z === 'pathfinderLayer');
    if (previousTilePieces.length > 0 && !pieceAtBaseLayer){
      previousTilePieces[previousTilePieces.length - 1].rexChess.setTileZ('pathfinderLayer');
    }

    // On destination tile, send piece back to base layer if it was not occupied
    const destinationTile = gameObject.rexChess.tileXYZ;
    const destinationTilePieces = getAllPiecesAtTileXY(board, destinationTile, null);
    if (!board.contains(destinationTile.x, destinationTile.y, 'pathfinderLayer'))
      gameObject.rexChess.setTileZ('pathfinderLayer');

    // Reposition pieces within the tile
    this.reposition(previousTilePieces);
    this.reposition(destinationTilePieces);
  }

  reorderDestinationTile(destinationTile) {
    if (this.rexChess.board.contains(destinationTile.x, destinationTile.y, 'pathfinderLayer'))
      this.rexChess.setTileZ(`pathfinderLayer-${this.rexChess.$uid}`);
  }

  /**
   * This function changes the location of the piece within the tile
   * Since multiple pieces can occupy a tile, this function organize the pieces
   * such that the piece at the top of the stack will be more prominent.
   */ 
  reposition(piecesInTile) {
    piecesInTile.forEach(piece => piece.setDepth(Constants.GameObjectDepth.PIECE));

    if (piecesInTile.length == 1) {
      piecesInTile[0].setOrigin(0.5);
      piecesInTile[0].setScale(0.45);
    } else if (piecesInTile.length == 2) {
      piecesInTile[0].setOrigin(0.5, 0.35);
      piecesInTile[0].setScale(0.35);
      this.topOfStackPositioning(piecesInTile, 1);
    } else if (piecesInTile.length == 3) {
      piecesInTile.forEach(piece => piece.setScale(0.35));
      piecesInTile[0].setOrigin(0.2, 0.35);
      piecesInTile[1].setOrigin(0.8, 0.35);
      this.topOfStackPositioning(piecesInTile, 2);
    } else if (piecesInTile.length == 4) {
      piecesInTile.forEach(piece => piece.setScale(0.3));
      piecesInTile[0].setOrigin(0.1, 0.35);
      piecesInTile[1].setOrigin(0.5, 0.35);
      piecesInTile[2].setOrigin(0.9, 0.35);
      this.topOfStackPositioning(piecesInTile, 3);
    } else if (piecesInTile.length == 5) {
      piecesInTile.forEach(piece => piece.setScale(0.3));
      piecesInTile[0].setOrigin(0, 0.35);
      piecesInTile[1].setOrigin(0.33, 0.35);
      piecesInTile[2].setOrigin(0.66, 0.35);
      piecesInTile[3].setOrigin(1, 0.35);
      this.topOfStackPositioning(piecesInTile, 4);
    }
  }

  topOfStackPositioning(piecesInTile, index) {
    piecesInTile[index].setOrigin(0.5, 0.95);
    piecesInTile[index].setDepth(Constants.GameObjectDepth.PIECE_BACK);
    piecesInTile[index].setScale(0.45);
  }
}
