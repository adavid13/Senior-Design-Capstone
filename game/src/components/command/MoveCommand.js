import Command from './Command';
import { Constants } from '../../utils/constants';
import { BoardStateAdapter } from '../BoardStateAdapter';  

const execute = function () {
  const { interactionModel, selectedMarker, moveSound, board } = this.value;
  moveSound.play();
  const targetTile = selectedMarker.tileXY;
  const piece = selectedMarker.parentPiece;
  piece.moveToTile(targetTile);
  const uhpString = BoardStateAdapter.actionToUHPString('Move', piece, targetTile, board, interactionModel);
  interactionModel.addToHistory(uhpString);
  if (selectedMarker.setFillStyle)
    selectedMarker.setFillStyle(Constants.Color.RED);
};

const undo = function () {
  const { selectedMarker, interactionModel, blockInput, moveSound } = this.value;
  moveSound.play();
  blockInput();
  interactionModel.selectedPiece = undefined;
  const piece = selectedMarker.parentPiece;
  interactionModel.removeFromHistory();
  piece.moveToPreviousTile();
};

const MoveCommand = function (value) {
  return new Command(execute, undo, value);
};

export default MoveCommand;