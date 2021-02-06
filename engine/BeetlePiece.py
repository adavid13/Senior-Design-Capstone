class BeetlePiece:
    def __init__(self, colour, pieceNum):
        self.colour = colour
        self.pieceNum = pieceNum
        self.coordinates = None
        self.id = "{}B{}".format(self.colour, self.pieceNum)

    