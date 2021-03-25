import { getAllPieces, getAllPiecesAtTileXY, getAllPiecesAtTileZ, getAllPiecesOfPlayer, isKingOnTheBoard } from '../utils/piecesUtils';
import { Constants } from '../utils/constants';
import InteractionModel from './model/InteractionModel';
import StealthPiece from './StealthPiece';
import MagePiece from './MagePiece';
import KingPiece from './KingPiece';
import BarbarianPiece from './BarbarianPiece';
import KnightPiece from './KnightPiece';
import BoardPiece from './BoardPiece';

export const BoardStateAdapter =  {
  convertAction: convertAction,
  convertState: convertState
};

/**
 * This function converts the contents of the board to the format
 * required by the server
 * @param {*} board board object used in the game
 * @param {*} players reference to the players
  */
function convertState(board, players) {
  // const playerPieces = getAllPiecesOfPlayer(board, players[0]);
  // const AIPieces = getAllPiecesOfPlayer(board, players[1]);
  // const playerPiecesInHand = players[0].getPiecesInHand();
  // const AiPiecesInHand = players[1].getPiecesInHand();

  
  return "Base;NotStarted;Black[2];wA1;bS1 -wA1;wB1 \\bS1;wB1 bS1;wB1";
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
  InteractionModel.setMoveHistory(demoStr); //update movesHistory array
  var action = InteractionModel.getMoveHistory();

  if(action.slice(0,3) === "err"){
    result = { type: 'error '};
    throw new Error("Invalid Action Received");
  }

  var splitStr = action.split(";");
  var GameTypeString = splitStr[0];
  var GameStateString = splitStr[1];
  var TurnString = splitStr[2];
  var movesArr = splitStr.slice(3);
  var lastMove = movesArr[movesArr.length-1].split(" ");

  var pieceToMove;
  var coordinatePiece;
  var result = { type: null, tileXY: null , piece: null };


  if(lastMove.length > 1){
    pieceToMove = lastMove[0];
    coordinatePiece = lastMove[1];
  }else{ //assumes player always starts
    result = { type: 'error '};
    
  }

  var color1;
  var color2;
  var piece1;
  var piece2;
  var direction;

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
  var cardOrPiece = cards.find(card => card.getId() === color1+piece1);
  isCard = typeof(cardOrPiece) != 'undefined'; //cards[1].getId()===color1+piece1;
  const AIPieces = getAllPiecesOfPlayer(board, players[1]);
  const playerPieces = getAllPiecesOfPlayer(board, players[0]);
  if(isCard){ //it is a card
    result.type = 'placement';
    result.piece = cardOrPiece;

  }else{ //it is a piece
    result.type = 'move';
    var findPiece1 = AIPieces.find(piece => piece.getId() === color1+piece1);
    result.piece = findPiece1;
  }

  /**
   * Finds coordinate piece
   */

   var findPiece2Player = playerPieces.find(piece => piece.getId() === color2+piece2);

  if(AIPieces.length > 0){ //AI has a piece on the board
    var findPiece2AI = AIPieces.find(piece => piece.getId() === color2+piece2);
//    var findPiece2Player = playerPieces.find(piece => piece.getId() === color2+piece2);
    var coordPiecePos;
    if((typeof(findPiece2AI) === 'undefined') && (typeof(findPiece2Player) === 'undefined')){ //coordinate piece is not on the board
      result.type = 'error';
    }
    if( (typeof(findPiece2AI) != 'undefined') && (typeof(findPiece2Player) === 'undefined')){ //coordinate piece is one of the AI's pieces
      coordPiecePos = findPiece2AI.rexChess.tileXYZ;
      if(direction === 'T'){
        result.tileXY = board.getTileXYAtDirection(coordPiecePos, direction, 0);
      }else{
        result.tileXY = board.getTileXYAtDirection(coordPiecePos, direction, 1);
      }
      
    }
    if((typeof(findPiece2AI) === 'undefined') && (typeof(findPiece2Player) != 'undefined')){ //coordinate piece is one of the player's pieces
      coordPiecePos = findPiece2Player.rexChess.tileXYZ;
      if(direction === 'T'){
        result.tileXY = board.getTileXYAtDirection(coordPiecePos, direction, 0);
      }else{
        result.tileXY = board.getTileXYAtDirection(coordPiecePos, direction, 1);
      }
    }
  }else{ //first piece of the game
    result.tileXY = {x:14, y:14};
  }


  /**
   * helper function to extract card types
   */
  var arr = [];
  function typeExtr(item){
    arr.push(item['type']);
  }

  /**
   * Need to add ID's to all pieces & cards references
   */

  /**
  if(piece1 === 'Q'){
    arr = []; //clear array before function call
    cards.forEach(typeExtr); //call helper function on all cards
    if(arr.includes("KING")){ //checks the ai cards to see if it has the piece
      result.piece = "KING";
      result.type = 'placement';
    }else{ // ai does not have the card, meaning it is a piece
      result.piece = KingPiece;
    }
  }else if(piece1 === 'B1'){
    arr = [];
    cards.forEach(typeExtr);
    if(arr.includes("MAGE")){
      result.piece = "MAGE";
      result.type = 'placement';
    }else{
      result.piece = MagePiece;
      result.type = 'move';
    }
  }else if(piece1 === 'B2'){
    arr = [];
    cards.forEach(typeExtr);
    if(arr.includes("MAGE")){
      result.piece = "MAGE";
      result.type = 'placement';
    }else{
      result.piece = MagePiece;
      result.type = 'move';
    }
  }else if(piece1 === 'G1'){
    arr = [];
    cards.forEach(typeExtr);
    if(arr.includes("STEALTH")){
      result.piece = "STEALTH";
      result.type = 'placement';
    }else{
      result.piece = StealthPiece;
      result.type = 'move';
    }
  }else if(piece1 === 'G2'){
    arr = [];
    cards.forEach(typeExtr);
    if(arr.includes("STEALTH")){
      result.piece = "STEALTH";
      result.type = 'placement';
    }else{
      result.piece = StealthPiece;
      result.type = 'move';
    }
  }else if(piece1 === 'G3'){
    arr = [];
    cards.forEach(typeExtr);
    if(arr.includes("STEALTH")){
      result.piece = "STEALTH";
      result.type = 'placement';
    }else{
      result.piece = StealthPiece;
      result.type = 'move';
    }
  }else if(piece1 === 'S1'){
    arr = [];
    cards.forEach(typeExtr);
    if(arr.includes("BARBARIAN")){
      result.piece = "BARBARIAN";
      result.type = 'placement';
    }else{
      result.piece = BarbarianPiece;
      result.type = 'move';
    }
  }else if(piece1 === 'S2'){
    arr = [];
    cards.forEach(typeExtr);
    if(arr.includes("BARBARIAN")){
      result.piece = "BARBARIAN";
      result.type = 'placement';
    }else{
      result.piece = BarbarianPiece;
      result.type = 'move';
    }
  }else if(piece1 === 'A1'){
    arr = [];
    cards.forEach(typeExtr);
    if(arr.includes("KNIGHT")){
      result.piece = "KNIGHT";
      result.type = 'placement';
    }else{
      result.piece = KnightPiece;
      result.type = 'move';
    }
  }else if(piece1 === 'A2'){
    arr = [];
    cards.forEach(typeExtr);
    if(arr.includes("KNIGHT")){
      result.piece = "KNIGHT";
      result.type = 'placement';
    }else{
      result.piece = KnightPiece;
      result.type = 'move';
    }
  }else if(piece1 === 'A3'){
    arr = [];
    cards.forEach(typeExtr);
    if(arr.includes("KNIGHT")){
      result.piece = "KNIGHT";
      result.type = 'placement';
    }else{
      result.piece = KnightPiece;
      result.type = 'move';
    }
  }else{
    result.type = 'error';
    throw new Error("Invalid Action Received");
  }
    
  */
    
    /**
     * No need to check if card or piece for destination piece (always piece, except for first move)
     */
    /*
    var secondPiece;

    if(piece2 === 'Q'){
      secondPiece = KingPiece1;
    }else if(piece2 === 'B1'){
      secondPiece = MagePiece1;
    }else if(piece2 === 'B2'){
      secondPiece = MagePiece2;
    }else if(piece2 === 'G1'){
      secondPiece = StealthPiece1;
    }else if(piece2 === 'G2'){
      secondPiece = StealthPiece2;
    }else if(piece2 === 'G3'){
      secondPiece = StealthPiece3;
    }else if(piece2 === 'S1'){
      secondPiece = BarbarianPiece1;
    }else if(piece2 === 'S2'){
      secondPiece = BarbarianPiece2;
    }else if(piece2 === 'A1'){
      secondPiece = KnightPiece1;
    }else if(piece2 === 'A2'){
      secondPiece = KnightPiece2;
    }else if(piece2 === 'A3'){
      secondPiece = KnightPiece3;
    }else{
      result.type = 'error';
      throw new Error("Invalid Action Received");
    }

    //check if coordinate piece is on the board
    const PlayerPieces;
    if(color2 === 'w'){ //to be placed next to one of the player's pieces
      PlayerPieces = getAllPiecesOfPlayer(board, players[0]);
    }else{ //to be placed next to one of the AI's pieces
      PlayerPieces = getAllPiecesOfPlayer(board, players[1]);
    }
    if(!PlayerPieces.includes(secondPiece)){
      result.type = 'error';
      throw new Error("Invalid Action Received");
    }
*/

/**
 * Get position of coordinate piece (make sure to distinguish between player's & AI's piece)
 */


  //might not be needed
  var fullPieceToMove = { 'player': null, 'piece': piece1 };
  var fullDestinationPiece = { 'player': null, 'piece': piece2 };
  if(color1 === 'w'){
    fullPieceToMove.player = 0;
  }else{
    fullPieceToMove.player = 1;
  }
  if(color2 === 'w'){
    fullDestinationPiece.player = 0;
  }else{
    fullDestinationPiece.player = 1;
  }

  //result.piece = [fullPieceToMove, fullDestinationPiece]

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

  const validPlacementTiles = board.showInitialPlacementPositions(players[1]);
  var pos = getAllPieces(board);

  //result.type = direction;
  return result;
}
