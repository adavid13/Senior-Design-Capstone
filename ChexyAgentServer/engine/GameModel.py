from GameBoard import GameBoard

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

    def __init__(self, board, state='NotStarted', turnColor='White', turnNum=1):
        '''Create model for new game'''
        self.gameType = "Base"          # Creates a game without expansion pieces
        self.gameState = state
        self.turnColor = turnColor
        self.turnNum = turnNum
        self.moves = []
        if board is None:
            self.board = GameBoard()
        else:
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
        # print('playMove')
        copyGameModel = self.deepCopy()
        if not passTurn:
            # Should check for valid move before doing this
            # Check if correct player is playing their turn
            if ((moveString[0] == 'w' and self.turnColor == 'Black') or (moveString[0] == 'b' and self.turnColor == 'White')):
                print("err {} cannot be played during the {} player's turn".format(moveString[0:3],self.turnColor))
                board.printBoard()
                raise Exception("err {} cannot be played during the {} player's turn".format(moveString, self.turnColor))
                
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

    def validMoves(self):
        piecesInPlay = []
        whiteTotalPieces = "wQ1;wS1;wS2;wB1;wB2;wA1;wA2;wA3;wG1;wG2;wG3".split(';')
        blackTotalPieces = "bQ1;bS1;bS2;bB1;bB2;bA1;bA2;bA3;bG1;bG2;bG3".split(';')
        if len(self.board.pieces) == 0:
            if self.turnColor == "White":
                return "wQ1;wS1;wS2;wB1;wB2;wA1;wA2;wA3;wG1;wG2;wG3"
            else:
                return "bQ1;bS1;bS2;bB1;bB2;bA1;bA2;bA3;bG1;bG2;bG3"
        blackQueeninPlay = "bQ1" in [p.id for p in self.board.pieces]
        whiteQueeninPlay = "wQ1" in [p.id for p in self.board.pieces]
        validMovesString = ""

        if not ((self.turnNum == 4 and self.turnColor == "Black" and not blackQueeninPlay) or ((self.turnNum == 4 and self.turnColor == "White" and not whiteQueeninPlay))):
            for piece in self.board.pieces:
                piecesInPlay.append(piece.id)
                if (piece.colour == 'b' and self.turnColor == "Black" and blackQueeninPlay) or (piece.colour == 'w' and self.turnColor == "White" and whiteQueeninPlay):
                    if piece.beetleOnTop is None:
                        validMoves = piece.validMoves(self)
                        for move in validMoves:
                            moveString = self._parseMoveString(move, piece)
                            validMovesString= validMovesString + (moveString+";")

        neighbours = [[-2, 0], [-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1]]
        symbols = ["{} {}-", "{} {}\\", "{} /{}", "{} -{}", "{} \\{}", "{} {}/"]
        whitePiecesNotInPlay = [p for p in whiteTotalPieces if p not in piecesInPlay]
        blackPiecesNotInPlay = [p for p in blackTotalPieces if p not in piecesInPlay]
        if not whiteQueeninPlay and self.turnNum == 4:
            whitePiecesNotInPlay = ["wQ1"]
        elif not blackQueeninPlay and self.turnNum == 4:
            blackPiecesNotInPlay = ["bQ1"]
        for i in range(4, self.board.MAX_BOARD_SIZE-2):
            for j in range(4, self.board.MAX_BOARD_SIZE-2):
                if ((i+j) % 2) == 0:
                    if self.board.Board[i][j] is None:
                        whiteCount = []
                        blackCount = []
                        for k in range(len(neighbours)):
                            pieceAtLoc = self.board.Board[i+neighbours[k][0]][j+neighbours[k][1]]
                            if pieceAtLoc is not None:
                                if pieceAtLoc.id[0] == 'w':
                                    whiteCount.append([pieceAtLoc, symbols[k]])
                                elif pieceAtLoc.id[0] == 'b':
                                    blackCount.append([pieceAtLoc, symbols[k]])
                        if (self.turnColor == 'White' and len(whiteCount)>0 and len(blackCount) == 0):
                            for p in whitePiecesNotInPlay:
                                for wp in whiteCount:
                                    validMovesString = validMovesString + wp[1].format(p, wp[0].id) + ";"
                        if self.turnColor == 'Black' and len(blackCount)>0 and len(whiteCount) == 0:
                            for p in blackPiecesNotInPlay:
                                for wp in blackCount:
                                    validMovesString = validMovesString + wp[1].format(p, wp[0].id) + ";"
                        if self.turnColor == "Black" and self.turnNum==1 and len(whiteCount) > 0:
                            for p in blackPiecesNotInPlay:
                                for wp in whiteCount:
                                    validMovesString = validMovesString + wp[1].format(p, wp[0].id) + ";"
        return validMovesString
    def _parseMoveString(self, moveArr, gamePiece):
        """
        _parseMoveString([17, 19], "wB1") -> "wB1 -wS1;wB1 wA1;wB1 bQ1/"

        """
        if(self.board.Board[moveArr[0]][moveArr[1]] is not None):
            return "{} {}".format(gamePiece.id, self.board.Board[moveArr[0]][moveArr[1]].id)
        collection = ""
        neighbours = [[-2, 0], [-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1]]
        symbols = ["{} {}-", "{} {}\\", "{} /{}", "{} -{}", "{} \\{}", "{} {}/"]
        for i in range(len(neighbours)):
            dx, dy = neighbours[i][0], neighbours[i][1]
            piece = self.board.Board[moveArr[0]+dx][moveArr[1]+dy]
            if  piece is not None and piece != gamePiece:
                collection+=symbols[i].format(gamePiece.id, piece.id)+";"
        return collection

    def deepCopy(self):
        # print('dc')
        # print('moves=',self.moves)
        newGameModel = GameModel(board=None)
        #newGameModel.board = GameBoard(pieces=[])
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
        # print('wo checking')
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
