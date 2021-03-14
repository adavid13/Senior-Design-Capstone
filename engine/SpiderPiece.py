class SpiderPiece:
    def __init__(self, colour, pieceNum):
        self.colour = colour
        self.pieceNum = pieceNum
        self.coordinates = None
        self.id = "{}S{}".format(self.colour, self.pieceNum)
        self.beetleOnTop = None

    def __eq__(self, other):
        return self.id == other.id

    def __repr__(self):
        return self.id

    def __str__(self):
        return self.id

    def validMoves(self, model):
        model.board.printBoard()
        print(model.moves)

        cpModel = model.deepCopy()
        # Remove self from the copied board
        cpModel.board.Board[self.coordinates[0]][self.coordinates[1]] = None
        cpModel.board.pieces.remove(self)
        if (not cpModel.board.isHiveConnected()):
            # Hive is not connected without this piece therefore it cannot be moved
            return []

        stack = []
        visited = set()
        moves = set()
        neighbours = [[-2, 0], [-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1]]
        x = self.coordinates[0]
        y = self.coordinates[1]
        path = {(x,y)}
        while (True):
            for i in range(len(neighbours)):
                dx,dy = neighbours[i]
                x1,y1 = neighbours[(i-1)%6]
                x2,y2 = neighbours[(i+1)%6]
                
                # If space is empty and slide rule allows movement to it
                if (cpModel.board.Board[x+dx][y+dy] is None and (cpModel.board.Board[x+x1][y+y1] is None or cpModel.board.Board[x+x2][y+y2] is None)):
                    # if move has not already been added to movelist
                    if ((x+dx,y+dy) not in path and path.__len__() < 4):
                        # If current location and next location have any common neighbours
                        # Note: Fixes gap jumping bug
                        neighbourPieces = cpModel.board.getNeighbours(coords=[x,y])
                        newNeighbourPieces = cpModel.board.getNeighbours(coords=[x+dx,y+dy])
                        commonNeighbours = [p for p in neighbourPieces if p in newNeighbourPieces]
                        if commonNeighbours:
                            tmp = path.copy()
                            tmp.add((x+dx, y+dy))
                            stack.append([x+dx, y+dy, tmp])
                            if (path.__len__() == 3):
                                moves.add((x+dx, y+dy))
            
            # Find the next location to check
            if stack:
                x,y,path = stack.pop()
            else:
                break

        return list(moves)
