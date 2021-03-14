class QueenPiece:
    # Note: the queen should not have a number in the final version as per UHP.
    def __init__(self, colour):
        self.colour = colour
        self.coordinates = None
        self.id = "{}Q1".format(self.colour)
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
        moves = []
        
        def wrap(j):
            if j > 5:
                j=0
            elif j < 0:
                j=5
            return j
        
        copyGameModel = model.deepCopy()
        copyGameModel.board.Board[self.coordinates[0]][self.coordinates[1]] = None
        copyGameModel.board.pieces.remove(self)
        if(copyGameModel.board.isHiveConnected() is False):
            return moves #no valid moves
        
        neighbours = [[-2, 0], [-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1]]
        for i in range(len(neighbours)): #each potential move
            x,y = neighbours[i]
            x_1,y_1 = neighbours[wrap(i-1)]
            x_2,y_2 = neighbours[wrap(i+1)]
            #check if passage is big enough to fit through:
            if(model.board.Board[self.coordinates[0]+x][self.coordinates[1]+y] is None and
            (model.board.Board[self.coordinates[0]+x_1][self.coordinates[1]+y_1] is None or
            model.board.Board[self.coordinates[0]+x_2][self.coordinates[1]+y_2] is None)):
                for x_3,y_3 in neighbours: #need 1 future neighbour to stay connected
                    if (copyGameModel.board.Board[self.coordinates[0]+x+x_3][self.coordinates[1]+y+y_3] 
                    is not None):
                        moves += [[self.coordinates[0]+x,self.coordinates[1]+y]]
                        break
        return moves
