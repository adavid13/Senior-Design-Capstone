class BeetlePiece:
    def __init__(self, colour, pieceNum):
        self.colour = colour
        self.pieceNum = pieceNum
        self.coordinates = None
        self.id = "{}B{}".format(self.colour, self.pieceNum)
        self.beetleOnTop = None
        self.beetling = None

    def validMoves(self, model):
        if self.beetleOnTop is not None:
            return []
        
        copyGameModel = model.deepCopy()

        moves = []
        neighbours = [[-2, 0], [-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1]]
        neighbourPieces = copyGameModel.board.getNeighbours(piece=self)

        # Remove the piece from the board copy if its not beetling
        # Beetles that are on top of another piece can't break the hive by moving. At all
        if self.beetling is None:
            copyGameModel.board.Board[self.coordinates[0]][self.coordinates[1]] = None
            copyGameModel.board.pieces.remove(self)
            # Moving the piece would disconnect the hive
            if copyGameModel.board.isHiveConnected() is False:
                return []

            # Check for each 6 moves if there is a gap that is blocking it's passage
            for i in range(len(neighbours)):
                x, y = self.coordinates[0], self.coordinates[1]
                dx, dy = neighbours[i]
                x1, y1 = neighbours[(i-1) % 6]
                x2, y2 = neighbours[(i+1) % 6]
                # If there is no sliding rule infringement that blocks the piece from moving
                if (copyGameModel.board.Board[x+x1][y+y1]) is None or (copyGameModel.board.Board[x+x2][y+y2] is None) or (copyGameModel.board.Board[x+dx][y+dy] is not None):
                    # If current location and next location have any common neighbours (including the piece that may be being beetled)
                    # Note: Fixes gap jumping bug
                    newNeighbourPieces = copyGameModel.board.getNeighbours(coords=[x+dx,y+dy])
                    if copyGameModel.board.Board[x+dx][y+dy] is not None:
                        newNeighbourPieces.append(copyGameModel.board.Board[x+dx][y+dy])
                    commonNeighbours = [p for p in neighbourPieces if p in newNeighbourPieces]
                    if commonNeighbours:
                        moves.append([x+dx, y+dy])
            return moves

        elif self.beetling is not None:
            # For beetles that are on top of a piece, there is no invalid
            # Move to any of its' six neighbours
            x, y = self.coordinates[0], self.coordinates[1]
            moves = [[x+neighbour[0], y+neighbour[1]] for neighbour in neighbours]
            return moves

    def __eq__(self, other):
        return self.id == other.id

    def __repr__(self):
        return self.id

    def __str__(self):
        return self.id
