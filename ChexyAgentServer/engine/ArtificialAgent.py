import random
from queue import PriorityQueue

class ArtificialAgent:
    def __init__(self):
        pass

    def setOfValidMoves(self, gamemodel):
        validMoves = gamemodel.validMoves()[0:-1]
        moveList = [self.moveStringToIndexes(gamemodel, p) for p in validMoves.split(";") if p != '']
        return moveList
        """
        valid moves contains a lot of redundant data.
        This should be reduced to a small subset of values to reduce the branching factor
        """

        pass

    def moveStringToIndexes(self, model, movestring):
        neighbours = [[-2, 0], [-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1]]
        symbols = ["{} {}-", "{} {}\\", "{} /{}", "{} -{}", "{} \\{}", "{} {}/"]
        p1Coord = []
        p2Coord = []
        moveStringSplit = movestring.split(" ")
        p1 = model.board.getPieceFromString(moveStringSplit[0])
        if p1 is None:
            p1 = moveStringSplit[0]
            pstr = p1
            p1Coord = pstr
        else:
            pstr = p1.id
            p1Coord = p1.coordinates
        
        relPiece = moveStringSplit[1]
        i = None
        p2 = None
        if relPiece[0] == "-":
            i = 3
            p2 = model.board.getPieceFromString(relPiece[1:])
        elif relPiece[0] == "/":
            i = 2
            p2 = model.board.getPieceFromString(relPiece[1:])
        elif relPiece[0] == "\\":
            i = 4
            p2 = model.board.getPieceFromString(relPiece[1:])
        elif relPiece[3] == "-":
            i = 0
            p2 = model.board.getPieceFromString(relPiece[:-1])
        elif relPiece[3] == "/":
            i = 5
            p2 = model.board.getPieceFromString(relPiece[:-1])
        elif relPiece[3] == "\\":
            i = 1
            p2 = model.board.getPieceFromString(relPiece[:-1])

        p2Coord = (p2.coordinates[0]+neighbours[i][0], p2.coordinates[1]+neighbours[i][1])
        return [p1Coord, p2Coord]

    def bestMove(self, gameModel, difficulty=0, maxTime=None, maxDepth=None):
        # print('bestMove')
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
        # Don't play queen on turn 1
        while gameModel.turnNum == 1 and 'Q' in choice:
            choice = random.choice(moveList)
        return choice

    def medium(self, gameModel, moveList):
        q = PriorityQueue()
        
        # Prioritize moves
        for move in moveList:
            piece, loc = move.split(' ')
            priority=0
            
            # Prioritize moves that surround the opponent's queen
            # Need to make sure it doesnt move if already on the queen
            if piece[0] not in loc and 'Q' in loc:
                priority -= 1

            # Prioritize placing pieces
            # try:
            #     gameModel.board.getPieceFromString(piece)
            # except:
            #     priority -= 1

            # Discourage moves that surround the active player's queen
            if piece[0] in loc and 'Q' in loc:
                priority += 1

            # Discourage moves that leave the opponent's queen
            # Errors out
            # if gameModel.board.getPieceFromString(loc.translate({ord(i): None for i in '-\\/'})) in gameModel.board.getNeighbours(gameModel.board.getPieceFromString(piece)):
            #     priority+=10

            q.put((priority, move))

        highPriority = [q.get()]
        high = highPriority[0][0]
        while (not q.empty and highPriority[-1][0] == high):
            highPriority.append(q.get())
        choice = random.choice(highPriority)
        print("(priority, move): ",choice)
        return choice[1]

    def hard(self, gameModel):
        pass
