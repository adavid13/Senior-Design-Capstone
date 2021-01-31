import engine.ArtificialAgent.ArtificialAgent

class Engine:
    def __init__(self):
        self.INFO_STRING = "ENGG4000 Chexy System"
        self.artificialAgent = ArtificialAgent()
        
    def parse(string):
        '''
        Calls functions based on command strings

        > command [argument 1] [argument 2]
        '''

        if "info" in string:
            this.info()
        elif "newgame" in string:
            this.newgame()
        elif "play" in string:
            this.play(string.split()[1])
        elif "pass" in string:
            this.passTurn()
        elif "validmoves" in string:
            this.validmoves()
        elif "bestmove" in string:
            args = string.split()
            this.bestmove(args[1], args[2])
        elif "undo" in string:
            this.undo(string.split()[1])
        elif "options" in string:
            this.options()
        else:
            return "Error: Command not recognized."

    def info():
        """
        Asks the engine to return its identification string.
        UHP compliant 

        > info
        """
        pass
    def newgame():
        """
        Asks the engine to start a new base game  
        UHP  compliant
        May not need parameters based on our requirements

        > newgame
        """
        pass
    def play(MoveString: str) -> str:
        """
        Asks the engine to play the specified MoveString
        Returns updated GameString

        > play wS1
        < Base;InProgress;Black[1];wS1
        """
        pass
    def passTurn() -> str:
        """
        Asks the engine to play a pass move and return an updated GameString
        
        > pass
        < Base;InProgress;Black[1];wS1
        """
        pass
    def validmoves():
        """
        Asks the engine for every valid move for the current board, returned as semi-colon seperated list

        > validmoves
        < wS1;Wb1;wG1;wA1
        """
        pass
    def bestmove(MaxTime=None, MaxDepth=None) -> str:
        """
        Asks the engine for the AI's suggestion for the best move on the current board within certain limits

        > bestmove time 0.05
        > bestmove depth 2
        < wS1
        """

        pass
    def undo(numMoves = 1) -> str:
        """
        Asks the engine to undo one or more previous moves
        >undo 3
        <Base;NotStarted;White[1]
        """
        pass
    def options():
        """
        Used to configure the engine, though no functionality required for UHP compliance.
        """
        pass
    def parseMoveString(self, moveString):
        pass
    def parseGameString(self, gameString):
        pass
