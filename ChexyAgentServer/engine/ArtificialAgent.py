import random
from queue import PriorityQueue

class ArtificialAgent:
    def __init__(self):
        pass

    def setOfValidMoves(self, gamemodel):
        validMoves = gamemodel.validMoves()[0:-1]
        moveList1 = [p for p in validMoves.split(";") if p != '']
        moveList = [self.moveStringToStandardString(gamemodel, p) for p in moveList1]
        setMoveList = []
        [setMoveList.append(x) for x in moveList if x not in setMoveList]
        return setMoveList
        """
        valid moves contains a lot of redundant data.
        This should be reduced to a small subset of values to reduce the branching factor
        """

        pass

    def moveStringToStandardString(self, model, movestring):

        neighbours = [[-2, 0], [-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1]]
        symbols =         ["{} {}-", "{} {}\\", "{} /{}", "{} -{}", "{} \\{}", "{} {}/"]
        oppositeSymbols = ["{} {}-", "{} \\{}", "{} {}/", "{} -{}", "{} {}\\", "{} /{}"]
        if len(movestring) <= 3:
            return movestring
        movingPiece, relPiece = movestring.split(" ")
        if len(relPiece) == 3:
            p2 = relPiece
            return movestring

        elif relPiece[3] == "-":
            p2 = relPiece[0:3]
            i = 0
        
        elif relPiece[3] == "\\":
            p2 = relPiece[0:3]
            i = 1

        elif relPiece[0] == "/":
            p2 = relPiece[1:]
            i = 2

        elif relPiece[0] == "-":
            p2 = relPiece[1:]
            i = 3

        elif relPiece[0] == "\\":
            p2 = relPiece[1:]
            i = 4

        elif relPiece[3] == "/":
            p2 = relPiece[0:3]
            i = 5

        relCoords = [model.board.getPieceFromString(p2).coordinates[0], model.board.getPieceFromString(p2).coordinates[1]]
        relCoords[0] -= neighbours[i][0]
        relCoords[1] -= neighbours[i][1]
        for j in range(len(neighbours)):
            new_x, new_y = relCoords[0] + neighbours[j][0], relCoords[1] + neighbours[j][1]
            if model.board.Board[new_x][new_y] is not None:
                return symbols[j].format(movingPiece, model.board.Board[new_x][new_y])
        raise Exception("*Skyrim Guard voice* You shouldn't be here")
        

    def bestMove(self, gameModel, difficulty=0, maxTime=None, maxDepth=None):
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
        print(choice)
        return choice

    def medium(self, gameModel, moveList):
        return self.getPriorityMove(gameModel, moveList)[1]

    def hard(self, gameModel):
        """
        build a depth 3 tree
        evaluate all the leaf nodes
        minimax it
        """
        pass

    def getPriorityMove(self, gameModel, moveList):
        # TODO: Beetles think sitting on the queen is better than surrounding it
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
            return (0, self.easy(gameModel, moveList))

        # Prioritize moves
        for move in moveList:
            piece, loc = move.split(' ')
            priority=0
            model = gameModel.deepCopy()

            # Prioritize placing pieces
            try:
                p = model.board.getPieceFromString(piece)
                beforeDistance = model.board.getDistance(bQ, p)
            except:
                priority -= 1
                # Default distance from opponent's queen is 5
                beforeDistance = 5

            model.playMove(move)

            gameover = model.board.isGameOver()
            if gameover:
                if (gameover == 'W' and gameModel.turnColor == "White") or (gameover == 'B' and gameModel.turnColor == "Black"):
                    priority = -100
                elif gameover == 'D':
                    priority = 0
                else:
                    # Win for opponent
                    priority = 100
            else:
                whiteNeighbours = len(model.board.getNeighbours(wQ))
                blackNeighbours = len(model.board.getNeighbours(bQ))
                # Should be a value between -5 and 5
                afterScore = whiteNeighbours - blackNeighbours

                # Should be a value between -2 and 2
                priority += (afterScore - beforeScore)*2

                #Prioritize getting closer to the queen
                afterDistance = model.board.getDistance(bQ, model.board.getPieceFromString(piece))
                delta_dist = afterDistance-beforeDistance
                priority += delta_dist  # This will influence the priority too much I think
            
            q.put((priority, move))

        highPriority = [q.get()]
        high = highPriority[0][0]
        while (not q.empty() and highPriority[-1][0] == high):
            highPriority.append(q.get())
        choice = random.choice(highPriority)
        print("{:.2f}, {}".format(choice[0], choice[1]))
        return choice
