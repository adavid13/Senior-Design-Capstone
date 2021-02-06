class AntPiece:
    def __init__(self, colour, pieceNum):
        self.colour = colour
        self.pieceNum = pieceNum
        self.coordinates = None
        self.id = "{}A{}".format(self.colour, self.pieceNum)