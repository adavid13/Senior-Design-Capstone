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
        """
        Asks the engine for every valid move for the current board, returned as semi-colon seperated list

        > validmoves
        < wS1;Wb1;wG1;wA1
        """
        pass
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
    ge.parse("newgame")
    ge.parse("play wQ1")
    ge.parse("play bS1 -wQ1")
    ge.parse("play wS1 wQ1\\")
    ge.parse("play bS2 /bS1")
    ge.parse("play wA1 /bS2")
    ge.parse("play bS3 /wS1")
    ge.gameModel.board.printBoard()
    print(ge.gameModel.board.getPieceFromString("wA1").validMoves(ge.gameModel))
    print("Engine Created")
