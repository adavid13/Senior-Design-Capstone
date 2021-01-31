import engine.ArtificialAgent.ArtificialAgent



class Engine(EngineInterface):
    def __init__(self):
        self.INFO_STRING = "ENGG4000 Chexy System"
        self.artificialAgent = ArtificialAgent()

    def ParseCommand(self, commandString):
        pass

    def info(self):
        print(self.INFO_STRING)
        pass

    def newGame(self):
        pass
    def play(self, MoveString: str) -> str:
        pass
    def passTurn(self) -> str:
        pass
    def validMoves(self):
        pass
    def bestMove(self, MaxTime=None, MaxDepth=None) -> str:
        pass
    def undo(self, numMoves = 1) -> str:
        pass
    def options(self):
        pass
    def parseMoveString(self, moveString):
        pass
    def parseGameString(self, gameString):
        pass