export const Constants = {
  // Games Scenes
  Scenes: {
    PRELOAD: 'PRELOAD',
    TITLE: 'TITLE',
    OPTIONS: 'OPTIONS',
    CREDITS: 'CREDITS',
    DIFFICULTY: 'DIFFICULTY',
    GAMEUI: 'GAMEUI',
    GAME: 'GAME',
    CONTROLLER: 'CONTROLLER'
  },

  Difficulty: {
    BEGINNER: 'BEGINNER',
    INTERMEDIATE: 'INTERMEDIATE',
    ADVANCED: 'ADVANCED',
  },

  World: {
    WIDTH: 3000,
    HEIGHT: 2800,
  },

  Window: {
    WIDTH: 1024,
    HEIGHT: 768,
  },

  GameObjectDepth: {
    GRID_TILE: 1,
    GRID_OUTLINE: 2,
    PIECE_BACK: 4,
    PIECE: 5,
    MARKER: 10,
    GRID_DEBUG: 20,
    UI: 30
  },

  Color: {
    BLACK: 0x000000,
    BLUE: 0x6FC9F9,
    GREY: 0x69696c,
    GREY_LIGHT: 0xa2a2a2,
    GREY_DARK: 0x595959,
    BROWN_LIGHT: 0xd3baac,
    BROWN_DARK: 0x867472,
    GREEN_LIGHT: 0xdfdf86,
    GREEN_MEDIUM: 0xb6bb7d,
    GREEN_DARK: 0x7f8a78,
    ORANGE: 0xffad00,
    RED: 0xff777c,
    DARK_RED: 0xa00037,
    YELLOW: 0xffda82,
    WHITE: 0xffffff,
    YELLOW_HIGHLIGHT: 0xffff00,
  },

  Faction: {
    HUMAN: 'HUMAN',
    ANIMAL: 'ANIMAL',
    MONSTER: 'MONSTER'
  },

  Pieces: {
    KING: 'KING',
    STEALTH: 'STEALTH',
    KNIGHT: 'KNIGHT',
    BARBARIAN: 'BARBARIAN',
    MAGE: 'MAGE'
  },

  PlayerType: {
    HUMAN: 'HUMAN',
    AI: 'AI'
  },

  GameState: {
    UI: 'UI',
    READY: 'READY',
    PIECE_MOVING: 'PIECE_MOVING',
    PIECE_SELECTION: 'PIECE_SELECTION',
    END_GAME: 'END_GAME'
  },

  Turn: {
    NEXT_TURN: 'NEXT_TURN',
    SKIP_TURN: 'SKIP_TURN',
    NEED_KING: 'NEED_KING',
    VICTORY: 'VICTORY',
    DEFEAT: 'DEFEAT'
  }
};
