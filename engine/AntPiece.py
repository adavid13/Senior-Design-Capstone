class AntPiece:
    def __init__(self, colour, pieceNum):
        self.colour = colour
        self.pieceNum = pieceNum
        self.coordinates = None
        self.id = "{}A{}".format(self.colour, self.pieceNum)
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

        stack = []
        moves = set()
        neighbours = [[-2, 0], [-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1]]
        x = self.coordinates[0]
        y = self.coordinates[1]
        while (True):
            for i in range(len(neighbours)):
                dx, dy = neighbours[i]
                x1, y1 = neighbours[(i-1)%6]
                x2, y2 = neighbours[(i+1)%6]

                # If space is empty and slide rule allows movement to it
                if (cpModel.board.Board[x+dx][y+dy] is None and (cpModel.board.Board[x+x1][y+y1] is None or cpModel.board.Board[x+x2][y+y2] is None)):
                    # if move has not already been added to movelist
                    if ((x+dx,y+dy) not in moves):
                        # Check that moved piece did not separate from hive
                        for x3,y3 in neighbours:
                            if cpModel.board.Board[x+dx+x3][y+dy+y3] is not None:
                                stack.append([x+dx, y+dy])
                                moves.add((x+dx, y+dy))
                                break
            
            # Find the next location to check
            if stack:
                x,y = stack.pop()
            else:
                break

        moves.remove((self.coordinates[0],self.coordinates[1]))
        return list(moves)