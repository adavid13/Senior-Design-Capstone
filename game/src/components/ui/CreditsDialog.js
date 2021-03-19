import Dialog from './Dialog';
import Label from './Label';

export default class CreditsDialog extends Dialog {
  constructor(scene, sounds, interfaceModel, onClickClose) {
    const primaryButton = {
      text: 'Close',
      callback: onClickClose
    };

    super(scene, interfaceModel, 'Credits', 500, [primaryButton]);
    this.scene = scene;
    this.sounds = sounds;
    this.interfaceModel = interfaceModel;

    this.populateContent();
    this.layout();
  }

  populateContent() {
    const labelWidth = 450;
    const contentContainer = this.getElement('content');
    const introText = 'This game was developed in Phaser 3 game engine with \nthe support of Rex plugins for Phaser.\n';
    const intro = new Label(this.scene, 0, 0, introText, 14, 'left', labelWidth);
    intro.clearShadow();

    const devTitle = new Label(this.scene, 0, 0, 'Developers', 20, 'left', labelWidth);
    const developersText = '\nAlexandre Carvalho\n' + 'Amir David\n' + 'Ben Myles\n'
      + 'Jakob Roberts\n' + 'Tye Shutty\n';
    const developers = new Label(this.scene, 0, 0, developersText, 14, 'left', labelWidth);
    developers.clearShadow();
    
    const assetsTitle = new Label(this.scene, 0, 0, 'Assets', 20, 'left', labelWidth);
    const gameArtTitle = new Label(this.scene, 0, 0, '\nGame Art', 16, 'left', labelWidth);
    const gameArtText = '\nSteve Colling \t(http://stevencolling.itch.io/)'
      + '\nRenata Britez \t(http://renatabritez.com)'
      + '\nZuhria A \t(http://https://www.gameart2d.com/)'
      + '\nAlexandre Carvalho\n';
    const gameArt = new Label(this.scene, 0, 0, gameArtText, 14, 'left', labelWidth);
    gameArt.clearShadow();

    const musicTitle = new Label(this.scene, 0, 0, 'Music', 16, 'left', labelWidth);
    const musicText = '\nJoel Steudler \t(http://patreon.com/joelsteudler)\n';
    const music = new Label(this.scene, 0, 0, musicText, 14, 'left', labelWidth);
    music.clearShadow();

    const soundsTitle = new Label(this.scene, 0, 0, 'Sound Effects', 16, 'left', labelWidth);
    const soundsText = '\nJoel Steudler \t(http://patreon.com/joelsteudler)\n'
      + 'Imphenzia \t(https://www.imphenzia.com/)\n';
    const sounds = new Label(this.scene, 0, 0, soundsText, 14, 'left', labelWidth);
    sounds.clearShadow();

    contentContainer.add(intro);
    contentContainer.add(devTitle);
    contentContainer.add(developers);
    
    contentContainer.add(assetsTitle);
    contentContainer.add(gameArtTitle);
    contentContainer.add(gameArt);
    
    contentContainer.add(musicTitle);
    contentContainer.add(music);

    contentContainer.add(soundsTitle);
    contentContainer.add(sounds);
  }
}
