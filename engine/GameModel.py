import GameBoard as gb

class GameModel:
    '''
    GameModel object represents a snapshot of a gamestate. Given any GameModel 
    object, the engine can continue to simulate the game.

    See https://github.com/jonthysell/Mzinga/wiki/UniversalHiveProtocol#common-string-definitions for full documentation on game strings used to represent the game state

    Game state can be:
    NotStarted      The game has not started, no moves have been made.
    InProgress 	    The game is in progress, at least one move has been made.
    Draw 	        The game is over, the result is a draw.
    WhiteWins 	    The game is over, the white side has won.
    BlackWins 	    The game is over, the black side has won.

    Player turn is in the form: 'color[#]' where color is either 'White' or 'Black', and 
    # is the turn number, which increments whenever a new round begins (both players 
    complete a turn)


    '''

    def __init__(self, state='NotStarted', turn='White[1]', moves=[], board=gb.GameBoard()):
        '''Create model for new game'''
        self.gameType = "Base"          # Creates a game without expansion pieces
        self.gameState = state
        self.playerTurn = turn
        self.moves = moves
        self.board = board      # Note: Seems like a board object is irrelevant when we keep a list of moves like this

        self.movestring = ';'.join(self.moves)
        self.gamestring = ';'.join(map(str, [self.gameType, self.gameState, self.playerTurn]))
        self.gamestring += ';' + self.movestring
    
    def __repr__(self):
        return self.gamestring