class QueenPiece:
    def __init__(self, colour):
        self.colour = colour
        self.coordinates = None
        self.id = "{}Q".format(self.colour)
        self.isBeetled = False

    def __eq__(self, other):
        return self.id == other.id