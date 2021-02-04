import Phaser from 'phaser';
import { Subject } from 'rxjs';

export default class Button extends Phaser.GameObjects.Rectangle {
  clickSubject;

  constructor(scene, x, y, { width, height, backgroundColor }, callbacks) {
    super(scene, x, y, width, height, backgroundColor);
    this.clickSubject = new Subject();
    this.callbacks = callbacks;

    this.setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleUp, this)
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.handleOut, this)
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleDown, this)
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, this.handleOver, this);
  }

  setDisabled(disable) {
    if (disable) {
      this.disableInteractive();
      return this;
    }
    this.setInteractive();
    return this;
  }

  handleUp(pointer) {
    this.callbacks.onUp();
    this.handleOver(pointer);
    this.clickSubject.next(pointer);
  }

  handleOver(pointer) {
    this.callbacks.onOver();
  }

  handleDown(pointer) {
    this.callbacks.onDown();
  }

  handleOut(pointer) {
    this.callbacks.onOut();
  }

  onClick() {
    return this.clickSubject.asObservable();
  }

  destroy(fromScene = false) {
    this.clickSubject.complete();
    super.destroy(fromScene);
  }
}
