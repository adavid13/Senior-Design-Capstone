class UHP_Interface:
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
