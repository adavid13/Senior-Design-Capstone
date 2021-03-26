import { getAllNeighborsOfTileXY, getAllPieces, getAllPiecesAtTileXY, getAllPiecesAtTileZ, getAllPiecesOfPlayer, isKingOnTheBoard } from '../utils/piecesUtils';
import { Constants } from '../utils/constants';

export const BoardStateAdapter =  {
  actionToUHPString: actionToUHPString,
  convertAction: convertAction,
  convertState: convertState
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
 * This function converts the contents of the board to the format
 * required by the server
 * @param {*} board board object used in the game
 * @param {*} players reference to the players
  */
function convertState(board, players, difficulty) {
  // const playerPieces = getAllPiecesOfPlayer(board, players[0]);

  // //var gameString = InteractionModel.getMoveHistory();
  // var gameString = "Base;1;InProgress;White[3];wA1;bS1 -wA1;wB1 \\bS1;wB1 bS1;wB2"; //demo moveHistory after user moves
  // //var gameString = "wA1"; //demo string for first move of game

  // const stateString = "InProgress";

  // if(difficulty === "BEGINNER"){
  //   difficulty = 1;
  // }
  // if(difficulty === "INTERMEDIATE"){
  //   difficulty = 2;
  // }
  // if(difficulty === "ADVANCED"){
  //   difficulty = 3;
  // }

  // if(gameString.length < 4){ //first move of the game
  //   var out = [];
  //   out[0] = "Base"; //gameTypeString
  //   out[1] = String(difficulty); //AI difficulty
  //   out[2] = stateString; //gameStateString
  //   out[3] = "Black[1]"; //Color and turn number
  //   out[4] = gameString; //first move of the game
  //   return out.join(';');
  // }

  // var movesArr, gameType, gameState, AIdiff, color, turn, lastMove, movesOnly, newString;
  // //Gets the last move from the gameString variable
  // if(!(typeof(gameString) === "undefined")){
  //   movesArr = gameString.split(";");
  //   gameType = movesArr[0];
  //   AIdiff = difficulty;
  //   gameState = stateString;
  //   color = "Black";
  //   turn = movesArr[3].slice(6, 7);
  //   turn = parseInt(turn)+1;
  //   turn = '['+turn+']';
  //   newString = [];
  //   newString.push(gameType, AIdiff, gameState, color+turn);
  //   newString = newString.join(';');
  //   movesOnly = movesArr.slice(4);
  //   movesOnly = movesOnly.join(';');
  //   newString = newString+';'+movesOnly;
  //   lastMove = movesArr[movesArr.length-1];
  // }
  
  // //find reference to the piece on the board
  // const pieceRef = playerPieces.find(piece => piece.getId() === lastMove);
  // var piecePosition = null;
  // var neighborRef = null;
  // var allNeighbors = null;
  // var neighborID = null;
  // var neighborDir = null;
  // var neighborAppend = null;
  // if(!(typeof(pieceRef) === "undefined")){
  //   piecePosition = pieceRef.rexChess.tileXYZ; //get position of piece on the board
  //   //delete piecePosition['z']; //removes the unnecessary key 'z' from the position dict

  //   allNeighbors = getAllNeighborsOfTileXY(board, { x: piecePosition.x, y: piecePosition.y }); //find all neighbor pieces of the piece
  //   neighborRef = allNeighbors[0]; //get reference of first neighbor
  //   neighborID = neighborRef.getId(); //get the first neighbor piece id
  //   neighborDir = board.getNeighborChessDirection(neighborRef, pieceRef); //returns direction of the neighbor piece
  //   neighborAppend = appendDir(neighborID, neighborDir); //append UHP direction symbol
  // }

  // const uhp_gameString = newString + ' ' + neighborAppend;

  // /**
  //  * Need to implement checks and placing piece on top of another piece (beetle).
  //  */

  // return uhp_gameString;
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
function convertAction(uhpString, board, players, cards, interactionModel) {
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

  var demoStr = "Base;NotStarted;Black[2];wA1;bS1 -wA1;wB1 \\bS1;wB1 bS1;bA2 \\wA1"; //replace demoStr with uhpstring
  // interactionModel.setMoveHistory(demoStr); //update movesHistory array
  var action = demoStr;

  if(action.slice(0,3) === "err"){ //if AI returns 'err'
    return { type: 'error '};
  }

  var splitStr = action.split(";"); //Turn moveString into array split on the semicolon (';')
  var GameTypeString = splitStr[0];
  var GameStateString = splitStr[1];
  var TurnString = splitStr[2];
  var movesArr = splitStr.slice(3); //array with just the moves
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
   * Finds out if it's a move or a placement action, and which card or piece it is.
   */
  var isCard;
  var cardOrPiece = cards.find(card => card.getId() === color1+piece1); //determine if AI tries to place one of its cards
  isCard = typeof(cardOrPiece) != 'undefined'; //checks if cardOrPiece is undefined, which means the AI is not placing a card
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
    result.tileXY = {x:14, y:14};
  }

  /**
   * Check if action is move or placement (by checking if card is part of cards that the player has --> check cards)
   */
  /**
   * Check if piece to place can be placed (not placed already)
   */
  /**
   * Check if piece to move can move
   */
  /**
   * Check if move or placement action is valid
   */
  /**
   * check if piece to move besides has a free tile
   */

  // Use functions below to help determine if the MOVE action is valid
  //const AIPieces = getAllPiecesOfPlayer(board, players[1]);
 // const validPieces = AIPieces.filter(piece => piece.getDestinationTiles().length > 0); // This will list all the pieces that are allowed to move
  //result.piece = validPieces;
/*  const validTiles = validPiece.getDestinationTiles();  // use this to check which are the valid tiles the selected piece can move (validPiece must be one of the pieces in the validPieces array )



  // Use functions below to help determine if the PLACEMENT action is valid
  const validPlacementTiles = this.board.showInitialPlacementPositions(players[1]); // Only tiles listed here can be used to place pieces
  const validCards = cards; // this will list all the valid piece cards that can be played 
  */

  return result;
}
