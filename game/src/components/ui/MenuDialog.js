import Dialog from './Dialog';

export default class MenuDialog extends Dialog {
  constructor(scene, openOptions, concede, close) {
    const primaryButton = {
      text: 'Options',
      callback: openOptions
    };
    const secondaryButton = {
      text: 'Concede',
      callback: concede
    };
    const tertiaryButton = {
      text: 'Close',
      callback: () => { this.hideDialog(); close(); }
    };
    super(scene, 'Menu', 250, [], [primaryButton, secondaryButton, tertiaryButton]);
    this.layout();
  }
}
