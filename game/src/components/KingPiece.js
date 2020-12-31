import Phaser from 'phaser';
import MoveableMarker from './MoveableMarker';

export default class KingPiece extends Phaser.GameObjects.Image {
  constructor(board, tileXY, type) {
    let tilePosition = tileXY;
    const scene = board.scene;
    if (tilePosition === undefined) {
      tilePosition = board.getRandomEmptyTileXY(0);
    }

    const worldXY = board.tileXYToWorldXY(tilePosition.x, tilePosition.y);
    super(scene, worldXY.x, worldXY.y, type);
    this.setOrigin(0.5);
    this.setScale(0.45);
    scene.add.existing(this);
    board.addChess(this, tilePosition.x, tilePosition.y, 1);
    // add behaviors        
    this.moveTo = scene.rexBoard.add.moveTo(this, { speed: 200 });
    this.pathFinder = scene.rexBoard.add.pathFinder(this, {
        cacheCost: false,
        costCallback: function (curTile, preTile, pathFinder) {
          var board = pathFinder.board;
            if (board.contains(curTile.x, curTile.y, 0)) {
                return pathFinder.BLOCKER;
            }
            var cost = 1;
            var prePreTile = preTile.preNodes[0];
            if (prePreTile) {
                var dirPreTileToCurTile = board.getNeighborTileDirection(preTile, curTile);
                var dirPrePreTileToPreTile = board.getNeighborTileDirection(prePreTile, preTile);
                if (dirPreTileToCurTile !== dirPrePreTileToPreTile) {
                    cost += 1;
                }
            }
            return cost;
        }
    });
    // private members
    this.movingPoints = 1;
    this.markers = [];
}

showMoveableArea() {
    this.hideMoveableArea();
    var tileXYArray = this.pathFinder.findArea(this.movingPoints);
    for (var i = 0, cnt = tileXYArray.length; i < cnt; i++) {
        this.markers.push(
            new MoveableMarker(this, tileXYArray[i])
        );
    }
    return this;
}

hideMoveableArea() {
    for (var i = 0, cnt = this.markers.length; i < cnt; i++) {
        this.markers[i].destroy();
    }
    this.markers.length = 0;
    return this;
}

moveToTile(endTile) {
    if (this.moveTo.isRunning) {
        return false;
    }
    var tileXYArray = this.pathFinder.getPath(endTile.rexChess.tileXYZ);
    this.moveAlongPath(tileXYArray);
    return true;
}

moveAlongPath(path) {
    if (path.length === 0) {
        this.showMoveableArea();
        return;
    }

    this.moveTo.once('complete', function () {
        this.moveAlongPath(path);
    }, this);
    this.moveTo.moveTo(path.shift());
    return this;
  }
}