import Phaser from 'phaser';
import { Menu } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { Constants } from '../../utils/constants';

const COLOR_PRIMARY = 0x69696c;

export default class PieceSelectionMenu extends Menu {
  constructor(scene, x, y, items, onClick) {
    const config = {
      x,
      y,
      items,
      bounds: new Phaser.Geom.Rectangle(0, 0, Constants.World.WIDTH, Constants.World.HEIGHT),
      createButtonCallback: function (item, i) {
        return scene.rexUI.add.label({
          background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY),
          text: scene.add.text(0, 0, item.displayName, {
            fontSize: '20px',
          }),
          // icon: scene.rexUI.add.image(0, 0, 0, 0, 10, 0xffffff),
          space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            icon: 10,
          },
        });
      },
      easeIn: {
        duration: 500,
        orientation: 'y',
      },
      easeOut: {
        duration: 100,
        orientation: 'y',
      },
    };
    super(scene, config);
    scene.add.existing(this);
    this.setDepth(Constants.GameObjectDepth.UI);
    this.on('button.over', function (button) {
      button.getElement('background').setStrokeStyle(1, 0xffffff);
    })
      .on('button.out', function (button) {
        button.getElement('background').setStrokeStyle();
      })
      .on('button.click', function (button, index) {
        onClick(button.rexContainer.parent.items[index]);
      });
  }
}
