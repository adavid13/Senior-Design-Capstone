class GrasshopperPiece:
    def __init__(self, colour, pieceNum):
        self.colour = colour
        self.pieceNum = pieceNum
        self.coordinates = None
        self.id = "{}G{}".format(self.colour, self.pieceNum)
        self.beetleOnTop = None

    def __eq__(self, other):
        return self.id == other.id

    def __repr__(self):
        return self.id

    def __str__(self):
        return self.id

    def validMoves(self, model):
        cpModel = model.deepCopy()
        # Remove self from the copied board
        cpModel.board.Board[self.coordinates[0]][self.coordinates[1]] = None
        cpModel.board.pieces.remove(self)
        if (not cpModel.board.isHiveConnected()):
            # Hive is not connected without this piece therefore it cannot be moved
            return []

        neighbours = [[-2, 0], [-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1]]
        x = self.coordinates[0]
        y = self.coordinates[1]
        moves = []

        for i in range(len(neighbours)):
            dx,dy = neighbours[i]
            dist = 0
            x = self.coordinates[0]
            y = self.coordinates[1]
            nextPiece = cpModel.board.Board[x+dx][y+dy]
            while nextPiece is not None:
                x += dx
                y += dy
                dist += 1
                nextPiece = cpModel.board.Board[x+dx][y+dy]
            if dist > 0:
                moves.append([x+dx,y+dy])

        return moves