import { getAllNeighborsOfTileXY, getAllPieces, getAllPiecesAtTileXY, getAllPiecesAtTileZ, getAllPiecesOfPlayer, isKingOnTheBoard } from '../utils/piecesUtils';
import { Constants } from '../utils/constants';

export const BoardStateAdapter =  {
  actionToUHPString: actionToUHPString,
  convertAction: convertAction
};

function actionToUHPString(actionType, piece, destination, board, interactionModel) {
  // First move of the game 
  if (interactionModel.currentTurn === 1)
    return piece.getId();

  // If piece is Mage and is moving on top of another piece
  const piecesAtDestination = getAllPiecesAtTileXY(board, destination);
  if (actionType === 'Move' && piece.getType() === Constants.Pieces.MAGE && piecesAtDestination.length > 0) {
    return piece.getId() + ' ' + piecesAtDestination[0].getId();
  }

  const allNeighbors = getAllNeighborsOfTileXY(board, { x: destination.x, y: destination.y });
  const neighborRef = allNeighbors[0];
  const neighborDir = board.directionBetween(neighborRef, destination);
  const destinationString = appendDir(neighborRef.getId(), neighborDir);
  return piece.getId() + ' ' + destinationString;
}

/**
 * This function appends direction position to a moveString
 * @param {*} moveString the moveString to append position to
 * @param {*} dir integer indicating direction to be appended
 * @returns the moveString with the direction appended
 */
  function appendDir(moveString, dir){
  if(dir === 0){ //right
    return moveString+'-';
  }
  if(dir === 1){ //down right
      return moveString+'\\';
  }
  if(dir === 2){ //down left
    return '/'+moveString;
  }
  if(dir === 3){ //left
    return '-'+moveString;
  }
  if(dir === 4){ //up left
    return '\\'+moveString;
  }
  if(dir === 5){ //up right
    return moveString+'/';
  }
}


/**
 * This function converts the string in UHP format to a valid action 
 * @param {*} uhpString this is the response of the server with the AI action in the UHP format
 * @param {*} board board object used in the game
 * @param {*} cards Card objects representing the pieces currently in the hand of the AI player
 * @param {*} interactionModel 
 * @returns an object with the following format { type: , tileXY: , piece: }
 * if the uhpString represents a placement action return { type: 'placement', tileXY: tile where the piece is placed, piece: Card object reference }
 * if the uhpString represents a move action return { type: 'move', tileXY: destination tile of piece, piece: BoardPiece object reference }
 * if the action is invalid (throw new Error("Invalid Action Received"), and return { type: 'error' } )
 */
function convertAction(uhpString, board, players, cards) {
  //uhpstring parsing
  /**
   * Piece name equivalents:
   * Queen(Q) = King(K)
   * Beetle(B) = Mage(M)
   * Grasshopper(G) = Stealth(S)
   * Spider(S) = Barbarian(B)
   * Ant(A) = Knight(N)
   * 
   * Locations:
   * bS1 wS1/ = Top right edge
   * bS1 wS1- = Right hand edge
   * bS1 wS1\ = Bottom right edge
   * bS1 /wS1 = Bottom left edge
   * bS1 -wS1 = Left hand edge
   * bS1 \wS1 = Top left edge
   * wB1 wS1 = on top of piece
   */

  var demoStr = "Base;1;InProgress;White[3];wA1;bS1 -wA1;wB1 \\bS1;wB1 bS1;bQ \\wA1"; //replace demoStr with uhpstring
  //var action = uhpString;
  var action = demoStr;


  if(action.slice(0,3) === "err"){ //if AI returns 'err'
    return { type: 'error' };
  }

  var splitStr = action.split(";"); //Turn moveString into array split on the semicolon (';')
  var GameTypeString = splitStr[0];
  var aiDifficulty = splitStr[1];
  var GameStateString = splitStr[2];
  var TurnString = splitStr[3];
  var movesArr = splitStr.slice(4); //array with just the moves
  var lastMove = movesArr[movesArr.length-1].split(" "); //an array of the last (AI) move: piece/card & coordinate piece

  var pieceToMove;
  var coordinatePiece;
  var result = { type: null, tileXY: null , piece: null }; //template of output to return


  if(lastMove.length > 1){ //containing both the piece or card to move and the coordinate piece
    pieceToMove = lastMove[0];
    coordinatePiece = lastMove[1];
  }else{ //assumes player always starts
    return { type: 'error '};
  }

  var color1;
  var color2;
  var piece1;
  var piece2;
  var direction;

  /**
   * This function converts a UHP moveCommand symbol to its equivalent Phaser board Hexagon direction
   * @param {*} sym the symbol to convert
   * @param {*} dir the direction of the symbol (right: R or left: L)
   * @returns digit representing the direction 
   */
  function symbol2dir(sym, dir){
    if(dir === 'R'){
      if(sym === '-'){
        return 0;
      }
      if(sym === '/'){
        return 5;
      }
      if(sym === '\\'){
        return 1;
      }
    }else if(dir === 'L'){
      if(sym === '-'){
        return 3;
      }
      if(sym === '/'){
        return 2;
      }
      if(sym === '\\'){
        return 4;
      }
    }
  }

  if(pieceToMove.length === 2){ //the queen piece (no number)
    color1 = pieceToMove[0];
    piece1 = pieceToMove[1];
  }else{
    color1 = pieceToMove[0];
    piece1 = pieceToMove.slice(1,3);
  }

  if(coordinatePiece.length === 2){ //placing beetle on queen
    color2 = coordinatePiece[0];
    piece2 = coordinatePiece[1];
    direction = 'T'; //place on top
  }else if(coordinatePiece.length === 3){ //placing besides queen (no number) or placing beetle on piece (no symbol)
    if(coordinatePiece[2].match(/[1-3]/i)){ //For placing the beetle on top of piece
      color2 = coordinatePiece[0];
      piece2 = coordinatePiece.slice(1,3);
      direction = 'T';
    }else if(coordinatePiece[0].match(/[a-z]/i)){ //check if first character is the direction (placing on right of queen)
      color2 = coordinatePiece[0];
      piece2 = coordinatePiece[1];
      direction = symbol2dir(coordinatePiece[2], 'R'); //place on right
    }else{ //placing on the left of the queen
      color2 = coordinatePiece[1];
      piece2 = coordinatePiece[2];
      direction = symbol2dir(coordinatePiece[0], 'L'); //place on left
    }
  }else{ //anything else
    if(coordinatePiece[0].match(/[a-z]/i)){ //check if first character is the direction
      color2 = coordinatePiece[0];
      piece2 = coordinatePiece.slice(1,3);
      direction = symbol2dir(coordinatePiece[3], 'R');
    }else{
      color2 = coordinatePiece[1];
      piece2 = coordinatePiece.slice(2,4);
      direction = symbol2dir(coordinatePiece[0], 'L');
    }
  }
  

  /**
   * Logic to determine if AI is trying to move a piece or place a card
   */
  var isCard;
  var cardOrPiece = cards.find(card => card.getId() === color1+piece1); //determine if AI tries to place one of its cards
  isCard = typeof(cardOrPiece) != 'undefined'; //checks if cardOrPiece is not undefined, which means the AI is placing a card
  const AIPieces = getAllPiecesOfPlayer(board, players[1]);
  const playerPieces = getAllPiecesOfPlayer(board, players[0]);
  if(isCard){ //it is a card
    result.type = 'placement';
    result.piece = cardOrPiece;
  }else{ //it is a piece
    result.type = 'move';
    var findPiece1 = AIPieces.find(piece => piece.getId() === color1+piece1); //gets reference to AI piece
    result.piece = findPiece1;
    
  }

  /**
   * Finds coordinate piece
   */
  if(AIPieces.length > 0){ //AI has a piece on the board
    var findPiece2AI = AIPieces.find(piece => piece.getId() === color2+piece2); //determines if coordinate piece belongs to AI
    var findPiece2Player = playerPieces.find(piece => piece.getId() === color2+piece2); //determines if coordinate piece belong to player
    var coordPiecePos;
    if((typeof(findPiece2AI) === 'undefined') && (typeof(findPiece2Player) === 'undefined')){ //coordinate piece is not on the board
      return { type: 'error' };
    }
    if( (typeof(findPiece2AI) != 'undefined') && (typeof(findPiece2Player) === 'undefined')){ //coordinate piece is one of the AI's pieces
      coordPiecePos = findPiece2AI.rexChess.tileXYZ; //get the tile (position) of the coordinate piece
      if(direction === 'T'){ //for placing on top (beetle)
        result.tileXY = board.getTileXYAtDirection(coordPiecePos, direction, 0);
      }else{
        result.tileXY = board.getTileXYAtDirection(coordPiecePos, direction, 1);
      }
      
    }
    if((typeof(findPiece2AI) === 'undefined') && (typeof(findPiece2Player) != 'undefined')){ //coordinate piece is one of the player's pieces
      coordPiecePos = findPiece2Player.rexChess.tileXYZ; //get the tile (position) of the coordinate piece
      if(direction === 'T'){ //for placing on top (beetle)
        result.tileXY = board.getTileXYAtDirection(coordPiecePos, direction, 0);
      }else{
        result.tileXY = board.getTileXYAtDirection(coordPiecePos, direction, 1);
      }
    }
  }else{ //first piece of the game
    var findPiece2Player = playerPieces.find(piece => piece.getId() === color2+piece2); //determines if coordinate piece belong to player
    if((typeof(findPiece2Player) === 'undefined')){ //coordinate piece is not on the board
      return { type: 'error' };
    }else{
      coordPiecePos = findPiece2Player.rexChess.tileXYZ; //get the tile (position) of the coordinate piece
      if(direction === 'T'){ //for placing on top (beetle)
        result.tileXY = board.getTileXYAtDirection(coordPiecePos, direction, 0);
      }else{
        result.tileXY = board.getTileXYAtDirection(coordPiecePos, direction, 1);
      }
    }
  }


  /**
   * check if card/piece can move to the destination tile (tile is free)
   */
  var pieceAtTile = board.tileXYToChessArray(result.tileXY.x, result.tileXY.y); //get piece at destination tile
  if((pieceAtTile.length != 0) && (result.piece.getId().slice(1,2) != 'B')){ //if destination tile is not empty, and piece/card to move is not Beetle
    return { type: 'error' };
  }

  /**
   * Check if placement action is valid
   */
  if(result.type === 'placement'){
    const validPlacementTiles = board.showInitialPlacementPositions(players[1]); // Only tiles listed here can be used to place pieces
    var isDestXValid = validPlacementTiles.find(tile => tile.x === result.tileXY.x); //compares all destination tiles' x value with TileXY's x value
    var isDestYValid = validPlacementTiles.find(tile => tile.y === result.tileXY.y); //compares all destination tiles' y value with TileXY's y value
    if( !((typeof(isDestXValid) != 'undefined') && (typeof(isDestYValid) != 'undefined')) ){ //if no valid placement tile exists
      return { type: 'error' };
    }
  }

  /**
   * Check if piece to move is allowd to move
   */
  const validPieces = AIPieces.filter(piece => piece.getDestinationTiles().length > 0); // This will list all the pieces that are allowed to move
  var isAllowed = validPieces.find(piece => piece.getId() === color1+piece1); //check if piece to move is in the validPieces list
  if((result.type === 'move') && (typeof(isAllowed) === 'undefined')){ //if it's a move action but piece is not allowed to move
    return { type: 'error' };
  }

  /**
   * Check if move action is valid (destionation)
   */
  if(result.type === 'move'){
    const validTiles = result.piece.getDestinationTiles(); //check which are the valid tiles the selected piece can move to
    var isXValid = validTiles.find(tile => tile.x === result.tileXY.x); //Check if TileXY's x-coordinate is part of ValidTiles
    var isYvalid = validTiles.find(tile => tile.y === result.tileXY.y); //Check if TileXY's y-coordinate is part of ValidTiles
    if( !((typeof(isXValid) != 'undefined') && (typeof(isYvalid) != 'undefined')) ){ //if no valid destination tile exists
      return { type: 'error' };
    }
  }


  return result;
}
