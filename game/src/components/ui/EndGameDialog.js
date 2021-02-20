import Dialog from './Dialog';

export default class EndGameDialog extends Dialog {
  constructor(scene, onPlayAgain, onMainMenu) {
    const primaryButton = {
      text: 'Play again',
      callback: onPlayAgain
    };
    const secondaryButton = {
      text: 'Main menu',
      callback: onMainMenu
    };
    super(scene, '', 400, [primaryButton, secondaryButton]);
    this.getElement('content').add(
      scene.add.image(0, 0, 'victory'),
      { padding: { top: 15, right: 0, bottom: 30, left: 0 } }
    );
    this.layout();
  }

  changeTile(title) {
    this.getElement('title').getElement('text').setText(title);
    this.layout();
  }

  changeImage(texture) {
    this.getElement('content').getElement('items')[0].setTexture(texture);
    this.layout();
  }
}
