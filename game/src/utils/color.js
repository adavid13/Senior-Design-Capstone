import Phaser from 'phaser';

/**
 * Converts a color value (integer) in the string format 
 */
export function convertIntegerColorToString(color) {
  const colorRGB = Phaser.Display.Color.IntegerToColor(color);
  const { r, g, b, a } = colorRGB;
  return Phaser.Display.Color.RGBToString(r, g, b, a);
}