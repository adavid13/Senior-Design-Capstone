import random

class ArtificialAgent:
    def __init__(self):
        pass

    def bestMove(self, gameModel, maxTime=None, maxDepth=None):
        validMoves = gameModel.validMoves()[0:-1]
        moveList = [p for p in validMoves.split(";") if p != '']
        if len(moveList) == 0:
            return "pass"
        if "" in moveList:
            print(moveList)
            print(validMoves)
            input("WOWOWOWW")
        choice = random.choice(moveList)
        return choice