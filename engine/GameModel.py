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

    def __init__(self, state='NotStarted', turnColor='White', turnNum=1, moves=[], board=gb.GameBoard()):
        '''Create model for new game'''
        self.gameType = "Base"          # Creates a game without expansion pieces
        self.gameState = state
        self.turnColor = turnColor
        self.turnNum = turnNum
        self.moves = moves
        self.board = board

        self.updateString()
    
    def __repr__(self):
        return self.gamestring

    def updateString(self):
        self.gamestring = ';'.join(map(str, [self.gameType, self.gameState, self.turnColor + f"[{self.turnNum}]"]))
        if self.moves:
            self.movestring = ';'.join(self.moves)
            self.gamestring += ';' + self.movestring
        return self.gamestring

    def playMove(self, passTurn=False):
        if passTurn:
            if self.turnColor == 'White':
                self.turnColor = 'Black'
            else:
                self.turnColor = 'White'
                self.turnNum += 1
        else:
            pass
        
        return self.updateString()
