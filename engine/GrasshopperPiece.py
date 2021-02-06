class GrasshopperPiece:
    def __init__(self, colour, pieceNum):
        self.colour = colour
        self.pieceNum = pieceNum
        self.coordinates = None
        self.id = "{}G{}".format(self.colour, self.pieceNum)