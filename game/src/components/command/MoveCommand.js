import Command from './Command';
import { Constants } from '../../utils/constants';

const execute = function () {
  const { selectedMarker } = this.value;
  const targetTile = selectedMarker.getTileXY();
  const piece = selectedMarker.getParentPiece();
  piece.moveToTile(targetTile);
  selectedMarker.setFillStyle(Constants.Color.RED);
};

const undo = function () {
  const { selectedMarker, interactionModel, blockInput } = this.value;
  blockInput();
  interactionModel.selectedPiece = undefined;
  const piece = selectedMarker.getParentPiece();
  piece.moveToPreviousTile();
};

const MoveCommand = function (value) {
  return new Command(execute, undo, value);
};

export default MoveCommand;