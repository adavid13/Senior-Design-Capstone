from ArtificialAgent import ArtificialAgent
from GameBoard import GameBoard
from GameModel import GameModel

class Engine:
    def __init__(self):
        self.INFO_STRING = "id ENGG 4000 Chexy Development Version"
        self.artificialAgent = ArtificialAgent()
        #self.gameBoard = GameBoard() # GameModel contains a board object
        self.gameModel = GameModel()

    def parse(self, string):
        '''
        Calls functions based on command strings

        > command [argument 1] [argument 2]
        '''
        returnStr = ""
        params = string.split()

        if "info" in params[0]:
            returnStr += self.info()
        elif "newgame" in params[0]:
            returnStr += self.newGame()
        elif "pass" in string:          # Pass has to check the entire string because it may be passed as a "play" parameter
            returnStr += self.passTurn()
        elif "play" in params[0]:
            if len(params) > 1:
                returnStr += self.play(' '.join(params[1:]))
            else:
                return "err Not enough arguments. A move must be specified."
        elif "validmoves" in params[0]:
            returnStr += self.validmoves()
        elif "bestmove" in params[0]:
            if len(params) == 2:
                returnStr += self.bestmove(params[1])
            elif len(params) == 3:
                returnStr += self.bestmove(params[1], params[2])
            else:
                return "err bestmove requires 1-2 parameters"
        elif "undo" in params[0]:
            if len(params) > 1:
                returnStr += self.undo(params[1])
            else:
                returnStr += self.undo()
        elif "options" in params[0]:
            returnStr += self.options()
        elif "help" in params[0]:
            return "Available commands: info, newgame, play, pass, validmoves, bestmove, undo, options, help"
        else:
            return "err Invalid command. Try 'help' to see a list of valid commands."
        
        returnStr += "\nok"
        return returnStr

    def info(self):
        """
        Asks the engine to return its identification string.
        UHP compliant 

        > info
        """
        return self.INFO_STRING
    def newGame(self) -> str:
        """
        Asks the engine to start a new base game  
        UHP  compliant
        May not need parameters based on our requirements

        > newgame
        > Base;NotStarted;White[1]
        """
        self.gameModel = GameModel()
        return str(self.gameModel)

    def passTurn(self) -> str:
        """
        Asks the engine to play a pass move and return an updated GameString
        
        > pass
        < Base;InProgress;Black[1];wS1
        """
        return self.gameModel.playMove(passTurn=True)

    def play(self, moveString: str) -> str:
        """
        Asks the engine to play the specified MoveString
        Returns updated GameString

        > play wS1
        < Base;InProgress;Black[1];wS1
        """
        try:
            return self.gameModel.playMove(moveString)
        except Exception as e:
            return "err" + str(e)
    
    def validmoves(self) -> str:

        piecesInPlay = []
        whiteTotalPieces = "wQ1;wS1;wS2;wB1;wB2;wA1;wA2;wA3;wG1;wG2;wG3".split(';')
        blackTotalPieces = "bQ1;bS1;bS2;bB1;bB2;bA1;bA2;bA3;bG1;bG2;bG3".split(';')
        if len(self.gameModel.board.pieces) == 0:
            if self.gameModel.turnColor == "White":
                return "wQ1;wS1;wS2;wB1;wB2;wA1;wA2;wA3;wG1;wG2;wG3"
            else:
                return "bQ1;bS1;bS2;bB1;bB2;bA1;bA2;bA3;bG1;bG2;bG3"
        blackQueeninPlay = "bQ1" in [p.id for p in self.gameModel.board.pieces]
        whiteQueeninPlay = "wQ1" in [p.id for p in self.gameModel.board.pieces]
        validMovesString = ""
        for piece in self.gameModel.board.pieces:
            piecesInPlay.append(piece.id)
            try:
                if (piece.colour == 'b' and self.gameModel.turnColor == "Black" and blackQueeninPlay) or (piece.colour == 'w' and self.gameModel.turnColor == "White" and whiteQueeninPlay):
                    validMoves = piece.validMoves(self.gameModel)
                    for move in validMoves:
                        moveString = self._parseMoveString(move, piece)
                        validMovesString= validMovesString + (moveString+";")
                else:
                    print(piece.colour, self.gameModel.turnColor)
            except Exception as e:
                print(e)
                pass
        print("->", validMovesString)
        neighbours = [[-2, 0], [-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1]]
        symbols = ["{} {}-", "{} {}\\", "{} /{}", "{} -{}", "{} \\{}", "{} {}/"]
        whitePiecesNotInPlay = [p for p in whiteTotalPieces if p not in piecesInPlay]
        blackPiecesNotInPlay = [p for p in blackTotalPieces if p not in piecesInPlay]

        for i in range(4, self.gameModel.board.MAX_BOARD_SIZE-2):
            for j in range(4, self.gameModel.board.MAX_BOARD_SIZE-2):
                if ((i+j) % 2) == 0:
                    if self.gameModel.board.Board[i][j] is None:
                        whiteCount = []
                        blackCount = []
                        for k in range(len(neighbours)):
                            pieceAtLoc = self.gameModel.board.Board[i+neighbours[k][0]][j+neighbours[k][1]]
                            if pieceAtLoc is not None:
                                if pieceAtLoc.id[0] == 'w':
                                    whiteCount.append([pieceAtLoc, symbols[k]])
                                elif pieceAtLoc.id[0] == 'b':
                                    blackCount.append([pieceAtLoc, symbols[k]])
                        if self.gameModel.turnColor == 'White' and len(whiteCount)>0 and len(blackCount) == 0:
                            for p in whitePiecesNotInPlay:
                                for wp in whiteCount:
                                    validMovesString = validMovesString + wp[1].format(wp[0].id, p) + ";"
                        if self.gameModel.turnColor == 'Black' and len(blackCount)>0 and len(whiteCount) == 0:
                            for p in blackPiecesNotInPlay:
                                for wp in blackCount:
                                    validMovesString = validMovesString + wp[1].format(p, wp[0].id) + ";"
        return validMovesString


    def _parseMoveString(self, moveArr, gamePiece):
        """
        _parseMoveString([17, 19], "wB1") -> "wB1 -wS1;wB1 wA1;wB1 bQ1/"

        """
        if(self.gameModel.board.Board[moveArr[0]][moveArr[1]] is not None):
            return "{} {}".format(gamePiece.id, self.gameModel.board.Board[moveArr[0]][moveArr[1]].id)
        collection = ""
        neighbours = [[-2, 0], [-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1]]
        symbols = ["{} {}-", "{} {}\\", "{} /{}", "{} -{}", "{} \\{}", "{} {}/"]
        for i in range(len(neighbours)):
            dx, dy = neighbours[i][0], neighbours[i][1]
            piece = self.gameModel.board.Board[moveArr[0]+dx][moveArr[1]+dy]
            if  piece is not None and piece != gamePiece:
                collection+=symbols[i].format(gamePiece.id, piece.id)
        return collection

    def bestmove(self, maxTime=None, maxDepth=None) -> str:
        """
        Asks the engine for the AI's suggestion for the best move on the current board within certain limits

        > bestmove time 0.05
        > bestmove depth 2
        < wS1
        """

        pass
    def undo(self, numMoves = 1) -> str:
        """
        Asks the engine to undo one or more previous moves
        >undo 3
        <Base;NotStarted;White[1]
        """
        self.gameModel = GameModel.previousState
        pass
    def options(self):
        """
        Used to configure the engine, though no functionality required for UHP compliance.

        No options currently, return nothing
        """
        return ""
    def parseMoveString(self, moveString):
        pass
    def parseGameString(self, gameString):
        """
        Creates a gamestate from a gamestring

        """
        gameModel = GameModel()
        gameStringSplit = gameString.split(";")
        if gameStringSplit[0] != "Base":
            raise NotImplementedError("Non-Base games not supported")
        turnColour = gameStringSplit[0:5]
        for i in range(3, len(gameStringSplit)):
            print(gameStringSplit[i])
            #gameModel.board.playMove(gameStringSplit[i])
            gameModel.playMove(gameStringSplit[i])

        return gameModel

if __name__ == "__main__":
    ge = Engine()
    ge.newGame()
    ge.parse("play wB1")
    ge.parse("play bQ1 -wB1")
    ge.parse("play wQ1 bQ1/")
    ge.gameModel.board.printBoard()
    print(ge.validmoves())
