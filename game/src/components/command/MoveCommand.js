import Command from './Command';
import { Constants } from '../../utils/constants';

const execute = function () {
  //translatation for MoveString
  const { selectedMarker } = this.value;
  const targetTile = selectedMarker.tileXY;
  const piece = selectedMarker.parentPiece;
  piece.moveToTile(targetTile);
  if (selectedMarker.setFillStyle)
    selectedMarker.setFillStyle(Constants.Color.RED);
};

const undo = function () {
  const { selectedMarker, interactionModel, blockInput } = this.value;
  blockInput();
  interactionModel.selectedPiece = undefined;
  const piece = selectedMarker.parentPiece;
  piece.moveToPreviousTile();
};

const MoveCommand = function (value) {
  return new Command(execute, undo, value);
};

export default MoveCommand;