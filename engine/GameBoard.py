from AntPiece import AntPiece
from BeetlePiece import BeetlePiece
from GrasshopperPiece import GrasshopperPiece
from QueenPiece import QueenPiece
from SpiderPiece import SpiderPiece

class GameBoard:
# Game board holds a list of pieces
# https://www.redblobgames.com/grids/hexagons/
# Doubled Coordinates
    def __init__(self, gameString=False):
        self.MAX_BOARD_SIZE = 50
        self.Board = [[None]*self.MAX_BOARD_SIZE]*self.MAX_BOARD_SIZE
        self.pieces = []

    def insertPiece(self, piece, relativeLoc):
        """
        Inserts a piece onto the board in UHP notation (ex: wS1 wS2/)

        No checking for validity yet
        """
        gamePiece = self.createPiece(piece)
        self.pieces.append(gamePiece)
        if relativeLoc==None:
            self.Board[self.MAX_BOARD_SIZE//2][self.MAX_BOARD_SIZE//2] = gamePiece
            gamePiece.coordinates = (self.MAX_BOARD_SIZE//2, self.MAX_BOARD_SIZE//2)
            print('first piece played {}'.format(piece))
            return
        
        direction, relPieceString = self.getDirectionAndPieceString(relativeLoc)

        relativePiece = self.getPieceFromString(relPieceString)
        #tuple (x, y)
        relativePieceCoordinates = relativePiece.coordinates

        # See linked guide at top of file to see how these translations are determined
        newCoords = self.getNewCoordinates(relativePieceCoordinates, direction)

        if direction != "beetleclimb":
            self.Board[newCoords[0]][newCoords[1]] = gamePiece
        else:
            self.Board[relativePieceCoordinates[0]][relativePieceCoordinates[1]].isBeetled = True
        gamePiece.coordinates = newCoords
        print('piece: {}, newlocation: {},{}'.format(gamePiece.id, newCoords[0], newCoords[1]))
        return

    def movePiece(self, piece, relativeLoc):
        """
        Moves a piece to another location

        No validity checking yet
        """

        direction, relPieceString = self.getDirectionAndPieceString(relativeLoc)


        relativePiece = self.getPieceFromString(relPieceString)
        movingPiece = self.getPieceFromString(piece)

        relativePieceCoordinates = relativePiece.coordinates
        newCoords = self.getNewCoordinates(relativePieceCoordinates, direction)


        movingPiece.coordinates = newCoords

        if direction != "beetleclimb":
            self.Board[newCoords[0]][newCoords[1]] = movingPiece
        else:
            self.Board[relativePieceCoordinates[0]][relativePieceCoordinates[1]].isBeetled = True

        print('piece: {}, newlocation: {},{}'.format(movingPiece.id, newCoords[0], newCoords[1]))


    def getNewCoordinates(self, relativePieceCoordinates, direction):
        """
        Translates UHP notation to engine array coordinates
        """
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
        elif direction == "beetleclimb":
            newCoords = relativePieceCoordinates

        return newCoords

    def getDirectionAndPieceString(self, relativeLoc):
        """
        Gets the piece the piece to be moved will be adjacent to, as well as the edge it will connect on.
        """
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
        else:
            direction = "beetleclimb"
            relPieceString = relativeLoc
        
        return direction, relPieceString

    def createPiece(self, piece):
        """
        Given a piece string in UHP notation, create the correct object and return it

        'wS1' => Spider Object
        'bB2' => beetle Object
        'bQ' => Queen object
        """
        pieceColour = piece[0]
        pieceType = piece[1]
        if pieceType == 'Q':
            pieceNum = 1

        else:
            pieceNum = piece[2]

        if pieceType == 'S':
            gamePiece = SpiderPiece(pieceColour, pieceNum)

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
        """
        Finds the piece on the board that matches the given piecestring id
        """
        for piece in self.pieces:
            print(piece.id, pieceStr, piece.id == pieceStr)
            if piece.id == pieceStr:
                return piece
        
        raise Exception("Relative Piece {} not on board".format(pieceStr))

    def deepCopyBoard(self):
        """
        Returns a deep copy of the board, used for creating different gamestates
        """
        pass

if __name__ == '__main__':
    """
    Driver code for testing
    """
    gb = GameBoard()
    gb.insertPiece("wA1", None)
    gb.insertPiece("bG1", "wA1\\")
    gb.movePiece("wA1", "\\bG1")