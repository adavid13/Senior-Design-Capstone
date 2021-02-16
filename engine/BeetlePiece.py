class BeetlePiece:
    def __init__(self, colour, pieceNum):
        self.colour = colour
        self.pieceNum = pieceNum
        self.coordinates = None
        self.id = "{}B{}".format(self.colour, self.pieceNum)
        self.beetleOnTop = None
        self.beetling = None

    def getValidMoves(self, gameBoard):
        """
        Returns a list of string, the possible moves the piece can make in it's position in the gameboard
        """

        pass


    def __eq__(self, other):
        return self.id == other.id

    def __repr__(self):
        return self.id

    def __str__(self):
        return self.id
