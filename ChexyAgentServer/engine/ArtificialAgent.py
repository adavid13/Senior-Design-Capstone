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
        if gameModel.turnColor == "Black" and difficulty > 0:
            print(gameModel.gamestring)
            raise Exception("RIP")
        # print('bestMove')
        validMoves = gameModel.validMoves()
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

        # If one of the queens hasn't been played yet, play a random move
        pieces = [p.id for p in gameModel.board.pieces]
        if "wQ1" in pieces and "bQ1" in pieces:
            wQ = gameModel.board.getPieceFromString("wQ1")
            bQ = gameModel.board.getPieceFromString("bQ1")
            # If it's black's turn, these variables are swapped
            # We always optimize for wQ
            if moveList[0][0] == 'b':
                wQ, bQ = bQ, wQ

            whiteNeighbours = len(gameModel.board.getNeighbours(wQ))
            blackNeighbours = len(gameModel.board.getNeighbours(bQ))
            # Should be a value between -5 and 5
            beforeScore = whiteNeighbours - blackNeighbours
        else:
            return self.easy(gameModel, moveList)

        
        # Prioritize moves
        for move in moveList:
            piece, loc = move.split(' ')
            priority=0
            model = gameModel.deepCopy()

            # Get distance from opponent queen
            

            #print("DEBUG: playing a move while prioritizing... ", end="")
            model.playMove(move)
            #print("Done.")

            whiteNeighbours = len(model.board.getNeighbours(wQ))
            blackNeighbours = len(model.board.getNeighbours(bQ))
            # Should be a value between -5 and 5
            afterScore = whiteNeighbours - blackNeighbours

            # Should be a value between -2 and 2
            priority = (afterScore - beforeScore)*2

            ### Other rules
            # Prioritize placing pieces
            try:
                gameModel.board.getPieceFromString(piece)
            except:
                priority -= 1

            # Prioritize getting closer to the queen
            

            q.put((priority, move))

        highPriority = [q.get()]
        high = highPriority[0][0]
        while (not q.empty() and highPriority[-1][0] == high):
            highPriority.append(q.get())
        choice = random.choice(highPriority)
        #print("(priority, move): {}, options: {}".format(choice, highPriority))
        return choice[1]

    def hard(self, gameModel):
        pass
