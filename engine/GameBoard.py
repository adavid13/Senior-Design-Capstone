import AntPiece, BeetlePiece, GrasshopperPiece, QueenPiece, SpiderPiece

class GameBoard:
# Game board holds a list of pieces
# https://www.redblobgames.com/grids/hexagons/
# Doubled Coordinates
    def __init__(self):
        self.MAX_BOARD_SIZE = 50
        self.Board = [[None for _ in range(self.MAX_BOARD_SIZE)] for __ in range(self.MAX_BOARD_SIZE)]
        self.pieces = []

    def insertPiece(self, piece, relativeLoc):
        """
        Inserts a piece onto the board in UHP notation (ex: wS1 wS2/)
        """
        gamePiece = self.createPiece(piece)
        print(gamePiece)
        self.pieces.append(gamePiece)
        if relativeLoc==None:
            self.Board[25][25] = gamePiece
            gamePiece.coordinates = (25, 25)
            print('first piece played {}'.format(piece))
            return
        
        
        relPieceString = None
        direction = None
        if relativeLoc.startswith('-'):
            direction = 'left'
            relPieceString = relativeLoc[1:]
        elif relativeLoc.startswith('\\'):
            direction = 'topleft'
            relPieceString = relativeLoc[1:]
        elif relativeLoc.startswith('/'):
            direction = 'bottomleft'
            relPieceString = relativeLoc[1:]
        elif relativeLoc.endswith('-'):
            direction='right'
            relPieceString = relativeLoc[:-1]
        elif relativeLoc.endswith('\\'):
            direction='bottomright'
            relPieceString = relativeLoc[:-1]
        elif relativeLoc.endswith('/'):
            direction='topright'
            relPieceString = relativeLoc[:-1]

        relativePiece = self.getPieceFromString(relPieceString)
        #tuple (x, y)
        relativePieceCoordinates = relativePiece.coordinates

        if direction == 'left':
            newCoords = (relativePieceCoordinates[0]-2, relativePieceCoordinates[1])
        elif direction == 'topleft':
            newCoords = (relativePieceCoordinates[0]-1, relativePieceCoordinates[1]-1)
        elif direction == 'topright':
            newCoords = (relativePieceCoordinates[0]+1, relativePieceCoordinates[1]-1)
        elif direction == 'right':
            newCoords = (relativePieceCoordinates[0]+2, relativePieceCoordinates[1])
        elif direction == 'bottomright':
            newCoords = (relativePieceCoordinates[0]+1, relativePieceCoordinates[1]+1)
        elif direction == 'bottomleft':
            newCoords = (relativePieceCoordinates[0]-1, relativePieceCoordinates[1]+1)

        self.Board[newCoords[0]][newCoords[1]] = gamePiece
        gamePiece.coordinates = newCoords
        print('piece: {}, newlocation: {},{}'.format(relativePiece, newCoords[0], newCoords[1]))
        return

    def createPiece(self, piece):
        pieceColour = piece[0]
        pieceType = piece[1]
        if pieceType == 'Q':
            pieceNum = 1

        else:
            pieceNum = piece[2]

        if pieceType == 'S':
            gamePiece = SpiderPiece.SpiderPiece(pieceColour, pieceNum)

        elif pieceType == 'A':
            gamePiece = AntPiece(pieceColour, pieceNum)

        elif pieceType == 'Q':
            gamePiece = QueenPiece(pieceColour)

        elif pieceType == 'B':
            gamePiece = BeetlePiece(pieceColour, pieceNum)

        elif pieceType == 'G':
            gamePiece = GrasshopperPiece(pieceColour, pieceNum)

        else:
            raise NotImplementedError("This piece is not available")

        return gamePiece

    def getPieceFromString(self, pieceStr):
        for piece in self.pieces:
            print(piece.id, pieceStr, piece.id == pieceStr)
            if piece.id == pieceStr:
                return piece
        
        return None

if __name__ == '__main__':
    gb = GameBoard()
    gb.insertPiece("wS1", None)
    gb.insertPiece("bS1", "wS1\\")
