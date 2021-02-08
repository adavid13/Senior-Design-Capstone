from ArtificialAgent import ArtificialAgent
from GameBoard import GameBoard

class Engine:
    def __init__(self):
        self.INFO_STRING = "id ENGG 4000 Chexy Development Version"
        self.artificialAgent = ArtificialAgent()
        self.gameBoard = GameBoard()

    def parse(self, string):
        '''
        Calls functions based on command strings

        > command [argument 1] [argument 2]
        '''

        if "info" in string:
            self.info()
        elif "newgame" in string:
            self.newGame()
        elif "play" in string:
            self.play(string.split()[1])
        elif "pass" in string:
            self.passTurn()
        elif "validmoves" in string:
            self.validmoves()
        elif "bestmove" in string:
            args = string.split()
            self.bestmove(args[1], args[2])
        elif "undo" in string:
            self.undo(string.split()[1])
        elif "options" in string:
            self.options()
        elif "help" in string:
            return "Available commands: info, newgame, play, pass, validmoves, bestmove, undo, options, help"
        else:
            return "err Invalid command. Try 'help' to see a list of valid commands"

    def info(self):
        """
        Asks the engine to return its identification string.
        UHP compliant 

        > info
        """
        return self.INFO_STRING
    def newGame(self):
        """
        Asks the engine to start a new base game  
        UHP  compliant
        May not need parameters based on our requirements

        > newgame
        """
        pass
    def play(self, moveString: str) -> str:
        """
        Asks the engine to play the specified MoveString
        Returns updated GameString

        > play wS1
        < Base;InProgress;Black[1];wS1
        """
        pass
    def passTurn(self) -> str:
        """
        Asks the engine to play a pass move and return an updated GameString
        
        > pass
        < Base;InProgress;Black[1];wS1
        """
        pass
    def validmoves(self):
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
        pass
    def options(self):
        """
        Used to configure the engine, though no functionality required for UHP compliance.

        No options currently, return nothing
        """
        return None
    def parseMoveString(self, moveString):
        pass
    def parseGameString(self, gameString):
        pass

if __name__ == "__main__":
    ge = Engine()
    print("Engine Created")