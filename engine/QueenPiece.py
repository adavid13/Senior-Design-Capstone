class QueenPiece:
    def __init__(self, colour):
        self.colour = colour
        self.coordinates = None
        self.id = "{}Q".format(self.colour)
        self.beetleOnTop = None

    def __eq__(self, other):
        return self.id == other.id

    def __repr__(self):
        return self.id

    def __str__(self):
        return self.id
