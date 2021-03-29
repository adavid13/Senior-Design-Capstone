import Command from './Command';
import { createPiece } from '../PieceFactory';
import { BoardStateAdapter } from '../BoardStateAdapter';  
import { Events } from '../EventCenter';

const execute = function () {
  const { board, selectedCard, tileXY, placeSound, interactionModel } = this.value;
  const type = selectedCard.getType();
  const player = selectedCard.getPlayer();
  const faction = selectedCard.getFaction();
  const id = selectedCard.getId();
  const piece = createPiece(type, { board, player, tileXY, faction, id });
  player.removePieceFromHand(type);
  selectedCard.setVisible(false);
  placeSound.play();
  selectedCard.isOnBoard = true;
  const uhpString = BoardStateAdapter.actionToUHPString('Place', selectedCard, tileXY, board, interactionModel);
  interactionModel.addToHistory(uhpString);
  Events.emit('piece-added', piece);
};

const undo = function () {
  const { board, selectedCard, tileXY, interactionModel } = this.value;
  const type = selectedCard.getType();
  const player = selectedCard.getPlayer();
  board.removeChess(null, tileXY.x, tileXY.y, 'pathfinderLayer', true);
  player.addPieceToHand(type);
  selectedCard.setVisible(true);
  selectedCard.isOnBoard = false;
  interactionModel.removeFromHistory();
  Events.emit('piece-removed', tileXY);
};

const PlaceCommand = function (value) {
  return new Command(execute, undo, value);
};

export default PlaceCommand;