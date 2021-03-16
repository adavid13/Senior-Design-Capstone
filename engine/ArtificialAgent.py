import random

class ArtificialAgent:
    def __init__(self):
        pass

    def bestMove(self, gameModel, maxTime=None, maxDepth=None):
        validMoves = gameModel.validMoves()[0:-1]
        moveList = validMoves.split(";")
        print(moveList)
        choice = random.choice(moveList)
        print("choice, ", choice)
        return choice