import random

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

        # for i in range(len(neighbours)):
        #     if sy
        



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