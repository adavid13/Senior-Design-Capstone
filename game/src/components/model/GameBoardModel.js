import { Constants } from '../../utils/constants';

export default class GameBoardModel {
  constructor(config, difficulty) {
    this.config = config;
    this.difficulty = difficulty;
  }

  getGridConfig() {
    return this.config;
  }

  getRadius() {
    return this.config.radius;
  }

  getKeys() {
    if (this.difficulty === Constants.Difficulty.BEGINNER) {
      return ['grassland0', 'grassland2', 'grassland2', 'grassland3'];
    } else if (this.difficulty === Constants.Difficulty.INTERMEDIATE) {
      return ['forest0', 'forest1', 'forest2', 'forest3'];
    } else if (this.difficulty === Constants.Difficulty.ADVANCED) {
      return ['moor0', 'moor1', 'moor2', 'moor3'];
    }
  }
}
