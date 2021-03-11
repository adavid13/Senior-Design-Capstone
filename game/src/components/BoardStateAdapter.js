import { getAllPiecesOfPlayer, isKingOnTheBoard } from '../utils/piecesUtils';
import { Constants } from '../utils/constants';

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
  return;
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
   * bS1 \wS1 = Top right edge
   */


  // Use functions below to help determine if the MOVE action is valid
  const AIPieces = getAllPiecesOfPlayer(this.board, players[1]);
  const validPieces = AIPieces.filter(piece => piece.getDestinationTiles().length > 0); // This will list all the pieces that are allowed to move
  const validTiles = validPiece.getDestinationTiles();  // use this to check which are the valid tiles the selected piece can move (validPiece must be one of the pieces in the validPieces array )



  // Use functions below to help determine if the PLACEMENT action is valid
  const validPlacementTiles = this.board.showInitialPlacementPositions(players[1]); // Only tiles listed here can be used to place pieces
  const validCards = cards; // this will list all the valid piece cards that can be played 


  const convertedAction = {
    type,
    tileXY,
    piece
  }
  return convertedAction;
}
