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
    [#] is the turn number, which increments whenever a new round begins (both players 
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
        self.previousState = None
        self.updateString()
    
    def __repr__(self):
        return self.gamestring

    def updateString(self):
        self.gamestring = ';'.join(map(str, [self.gameType, self.gameState, self.turnColor + f"[{self.turnNum}]"]))
        if self.moves:
            self.movestring = ';'.join(self.moves)
            self.gamestring += ';' + self.movestring
        return self.gamestring

    def playMove(self, moveString="", passTurn=False):
        copyGameModel = self.deepCopy()
        if not passTurn:
            # Should check for valid move before doing this
            # Check if correct player is playing their turn
            if ((moveString[0] == 'w' and self.turnColor == 'Black') or (moveString[0] == 'b' and self.turnColor == 'White')):
                print("err that piece cannot be played during the {} player's turn".format(self.turnColor))
                raise Exception("err that piece cannot be played during the {} player's turn".format(self.turnColor))
            self.board.playMove(moveString)
            self.moves.append(moveString)

        if self.turnColor == 'White':
            self.turnColor = 'Black'
        else:
            self.turnColor = 'White'
            self.turnNum += 1
        
        # update gamestate
        state = self.board.isGameOver()
        if state:
            if state == 'W':
                self.gameState = 'WhiteWins'
            elif state == 'B':
                self.gameState = 'BlackWins'
            elif state == 'D':
                self.gameState = 'Draw'
        else:
            self.gameState = 'InProgress'

        self.previousState = copyGameModel
        return self.updateString()

    def deepCopy(self):
        newGameModel = GameModel()
        newGameModel.board = gb.GameBoard()
        for move in self.moves:
            newGameModel._playMoveWithoutChecking(move)

        newGameModel.previousState = self.previousState
        return newGameModel

    def undo(self):
        return self.previousState

    def checkIfMoveDisconnectsHive(self, moveString):
        """
        False if move is fine
        True if move is not allowed
        """
        copyGameModel = self.deepCopy()
        copyGameModel.playMove(moveString)
        return not copyGameModel.board.isHiveConnected()

    def _playMoveWithoutChecking(self, moveString, passTurn = False):
        if not passTurn:
            # Should check for valid move before doing this
            self.board.playMove(moveString)
            #self.moves.append(moveString)

        if self.turnColor == 'White':
            self.turnColor = 'Black'
        else:
            self.turnColor = 'White'
            self.turnNum += 1
        
        # update gamestate
        state = self.board.isGameOver()
        if state:
            if state == 'W':
                self.gameState = 'WhiteWins'
            elif state == 'B':
                self.gameState = 'BlackWins'
            elif state == 'D':
                self.gameState = 'Draw'
        else:
            self.gameState = 'InProgress'

        return self.updateString()


if __name__ == "__main__":
    gm = GameModel()
    gm.playMove("wB1")
    gm.playMove("bS1 -wB1")
    gm.playMove("wS1 -bS1")
    print(gm.checkIfMoveDisconnectsHive("bS1 -wS1"))
    print(gm.checkIfMoveDisconnectsHive("bS1 -wS1"))
    print(gm.checkIfMoveDisconnectsHive("bS1 -wS1"))
    print(gm.checkIfMoveDisconnectsHive("bS1 -wS1"))

    gm.playMove("bQ \\wS1")
    
    # gm.playMove("wQ BS1-")
    gm.board.printBoard()
