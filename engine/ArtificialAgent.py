import random
from queue import PriorityQueue

class ArtificialAgent:
    def __init__(self):
        pass
    
    # Difficulty is set as a default in Engine. This default value of 0 should never have an effect
    def bestMove(self, gameModel, difficulty=0, maxTime=None, maxDepth=None):
        # Get valid moves
        validMoves = gameModel.validMoves()[0:-1]
        moveList = [p for p in validMoves.split(";") if p != '']
        if len(moveList) == 0:
            return "pass"
        if "" in moveList:
            print(moveList)
            print(validMoves)
            input("WOWOWOWW")
        
        if difficulty==0:
            return self.easy(gameModel, moveList)
        elif difficulty==1:
            return self.medium(gameModel, moveList)
        elif difficulty==2:
            return self.hard(gameModel, moveList)
        else:
            raise Exception("Invalid difficulty. Must be between 0-2")

    def easy(self, gameModel, moveList):
        choice = random.choice(moveList)
        return choice

    def medium(self, gameModel, moveList):
        q = PriorityQueue()

        # Prioritize moves that surround the opponent's queen
        for move in moveList:
            piece, loc = move.split(' ')
            priority=0
            
            # If turn is placing the piece on the opponent's queen
            if piece[0] not in loc and 'Q' in loc:
                priority -= 1

            q.put((priority, move))

        highPriority = [q.get()]
        high = highPriority[0][0]
        while (not q.empty and highPriority[-1][0] == high):
            highPriority.append(q.get())
        return random.choice(highPriority)[1]


    def hard(self, gameModel):
        pass