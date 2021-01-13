import { Board } from 'phaser3-rex-plugins/plugins/board-components.js';
import graphlib, { Graph } from '@dagrejs/graphlib';
import BoardPiece from './BoardPiece';
import { Events } from './EventCenter';
import { scaleHexagonAtCenter } from '../utils/geometry';
import { getAllPiecesAtTileXY } from '../utils/piecesUtils';
import { Constants } from '../utils/constants'; 

export default class GameBoard extends Board {
  constructor(scene, model) {
    super(scene, model.getGridConfig());
    this.scene = scene;
    this.model = model;
  }

  inititialize() {
    this.scene.add.existing(this);
    this.tileXYArray = this.fit(this.scene.rexBoard.hexagonMap.hexagon(this, this.model.getRadius()));

    this.tileOutline = this.scene.add.graphics({
      lineStyle: { width: 1, color: Constants.Color.WHITE, alpha: 1 },
    });
    this.tileOutline.setDepth(Constants.GameObjectDepth.GRID_OUTLINE);

    let tileXY = {};
    let worldXY = {};
    const tileKeys = this.model.getKeys();
    for (const i in this.tileXYArray) {
      tileXY = this.tileXYArray[i];
      // this.tileOutline.strokePoints(this.getGridPoints(tileXY.x, tileXY.y, true), true);
      worldXY = this.tileXYToWorldXY(tileXY.x, tileXY.y);
      this.scene.add
        .image(
          worldXY.x,
          worldXY.y,
          tileKeys[Math.floor(Math.random() * tileKeys.length)],
          Math.floor(Math.random() * 10)
        )
        .setScale(0.625);
      this.scene.add.text(worldXY.x, worldXY.y, `${tileXY.x},${tileXY.y}`).setOrigin(0.5);
    }

    Events.on('piece-moved', this.handleTileColorChange, this);
    Events.on('piece-added', this.handleTileColorChange, this);

    this.setInteractive().on('tiledown', (pointer, tileXY) => {
    });

    return this;
  }

  handleTileColorChange(piece) {
    const tileXY = piece.rexChess.tileXYZ;
    const scaleFactor = 0.9;
    const points = scaleHexagonAtCenter(this.getGridPoints(tileXY.x, tileXY.y, true), scaleFactor);

    if (piece.getPlayer().getNumber() === 1) {
      this.drawHexagon(this.tileOutline, points, Constants.Color.BLUE);
    } else if (piece.getPlayer().getNumber() === 2) {
      this.drawHexagon(this.tileOutline, points, Constants.Color.RED);
    }
    
    const previousTile = piece.getPreviousTileXYZ();
    if (previousTile) {
      const previousTilePiece = getAllPiecesAtTileXY(this, previousTile, null);
      const prevPoints = scaleHexagonAtCenter(this.getGridPoints(previousTile.x, previousTile.y, true), scaleFactor);
      if (previousTilePiece.length > 0) {
        if (previousTilePiece[previousTilePiece.length - 1].getPlayer().getNumber() === 1) {
          this.drawHexagon(this.tileOutline, prevPoints, Constants.Color.BLUE);
        } else if (previousTilePiece[previousTilePiece.length - 1].getPlayer().getNumber() === 2) {
          this.drawHexagon(this.tileOutline, prevPoints, Constants.Color.RED);
        }
      } else {
        this.drawHexagon(this.tileOutline, prevPoints, Constants.Color.GREY);
      }
    }

  }

  drawHexagon(graphic, points, color) {
    const lineWidth = 5;
    graphic.lineStyle(lineWidth, color, 1);
    graphic.strokePoints(points, true);
  }

  update() {
  }

  getModel() {
    return this.model;
  }

  getTileXYArray() {
    return this.tileXYArray;
  }

  displayTileOutline(display) {
    this.tileOutline.setVisible(display);
  }

  arePiecesConnected() {
    const graph = new Graph({ directed: false });
    const pieces = this.getAllChess().filter(chess => chess instanceof BoardPiece);

    // Add nodes
    pieces.forEach(piece => {
      graph.setNode(piece.rexChess.$uid);
    });

    // Add vertices
    pieces.forEach(piece => {
      const neighbors = this.getNeighborChess(piece, null);
      neighbors.forEach(neighbor => {
        if (!graph.hasEdge(piece.rexChess.$uid, neighbor.rexChess.$uid))
          graph.setEdge(piece.rexChess.$uid, neighbor.rexChess.$uid);
      })
    });

    return graphlib.alg.components(graph).length == 1;
  }
}
