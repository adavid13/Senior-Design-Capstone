class BeetlePiece:
    def __init__(self, colour, pieceNum):
        self.colour = colour
        self.pieceNum = pieceNum
        self.coordinates = None
        self.id = "{}B{}".format(self.colour, self.pieceNum)
        self.isBeetled = False


    def __eq__(self, other):
        return self.id == other.id