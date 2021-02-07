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
        self.MAX_BOARD_SIZE = 40
        #self.Board = [[None]*self.MAX_BOARD_SIZE]*self.MAX_BOARD_SIZE
        self.Board = [[None for _ in range(self.MAX_BOARD_SIZE)] for __ in range(self.MAX_BOARD_SIZE)]
        self.pieces = []

    def playMove(self, moveString):
        splitStr = moveString.split()
        pieceStr = splitStr[0]
        if len(splitStr) > 1:
            relativeStr = splitStr[1]
        else:
            relativeStr = None
        if self.getPieceFromString(pieceStr) is not None:
            print("moving {}...".format(pieceStr))
            self.movePiece(pieceStr, relativeStr)
        else:
            print("inserting {}...".format(pieceStr))
            self.insertPiece(pieceStr, relativeStr)

    def insertPiece(self, piece, relativeLoc):
        """
        Inserts a piece onto the board in UHP notation (ex: wS1 wS2/)

        No checking for validity yet
        """
        gamePiece = self.createPiece(piece)
        self.pieces.append(gamePiece)
        if relativeLoc is None:
            self.Board[self.MAX_BOARD_SIZE//2][self.MAX_BOARD_SIZE//2] = gamePiece
            gamePiece.coordinates = (self.MAX_BOARD_SIZE//2, self.MAX_BOARD_SIZE//2)
            print('first piece played {}'.format(piece))
            return
        
        direction, relPieceString = self.getDirectionAndPieceString(relativeLoc)

        relativePiece = self.getPieceFromString(relPieceString)
        #tuple (x, y)
        if relativePiece is None:
            raise Exception("This piece not on the board yet")
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
        if relativePiece is None or movingPiece is None:
            raise Exception("This piece not implemented")

        relativePieceCoordinates = relativePiece.coordinates
        newCoords = self.getNewCoordinates(relativePieceCoordinates, direction)

        oldCoords = movingPiece.coordinates
        movingPiece.coordinates = newCoords

        if direction != "beetleclimb":
            self.Board[newCoords[0]][newCoords[1]] = movingPiece
            self.Board[oldCoords[0]][oldCoords[1]] = None
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
        gamePiece = None
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
            if piece.id == pieceStr:
                return piece
        
        return None
        #raise Exception("Relative Piece {} not on board".format(pieceStr))

    def deepCopyBoard(self):
        """
        Returns a deep copy of the board, used for creating different gamestates
        """
        pass

    def isGameOver(self):
        """
        Determines if the game is over, "W": white win, "B": Black win, "D": Draw, False: not done
        """
        whiteLost = False
        blackLost = False

        whiteQueen = self.getPieceFromString("wQ")
        if whiteQueen is not None:
            neighbours = self.getNeighbours(whiteQueen)
            whiteLost = len(neighbours) == 6
        
        blackQueen = self.getPieceFromString("bQ")
        if blackQueen is not None:
            neighbours = self.getNeighbours(blackQueen)
            blackLost = len(neighbours) == 6

        if whiteLost and not blackLost:
            return "B"
        elif not whiteLost and blackLost:
            return "W"
        elif whiteLost and blackLost:
            return "D"
        else:
            return False
        return False

    def getNeighbours(self, piece):
        gamePiece = self.getPieceFromString(piece)
        coords = gamePiece.coordinates
        neighbours = []
        #print("Getting neighbours of {} at {},{}...".format(piece,  coords[0], coords[1]))
        neighbours.append(self.Board[coords[0]-2][coords[1]])
        neighbours.append(self.Board[coords[0]-1][coords[1]-1])
        neighbours.append(self.Board[coords[0]+1][coords[1]-1])
        neighbours.append(self.Board[coords[0]+2][coords[1]])
        neighbours.append(self.Board[coords[0]+1][coords[1]+1])
        neighbours.append(self.Board[coords[0]-1][coords[1]+1])

        #print(neighbours)
        neighbours = [n for n in neighbours if n is not None]
        return neighbours


    def makeGraph(self):
        """
        Turns board into a graph structure to simplify 1-hive detection and other features
        """
        pass

    def printBoard(self):
        """
        Debugging tool, displays the board and relative pieces
        """
        for j in range(self.MAX_BOARD_SIZE):
            if j % 2 == 0:
                rowstr = ""
            else:
                rowstr = "  "
            for i in range(self.MAX_BOARD_SIZE):
                if ((i+j) % 2 == 0):
                    if self.Board[i][j] is None:
                        rowstr += "--- "
                    else:
                        if (len(self.Board[i][j].id) == 2):
                            rowstr += self.Board[i][j].id + "1 "
                        else:

                            rowstr += self.Board[i][j].id + " "
            print(rowstr, j)


if __name__ == '__main__':
    """
    Driver code for testing
    """
    gb = GameBoard()
    # gb.insertPiece("wA1", None)
    # gb.insertPiece("bG1", "wA1\\")
    # gb.movePiece("wA1", "\\bG1")

    gb.playMove("wA1")

    gb.playMove("bS1 wA1\\")

    gb.playMove("wQ bS1\\")

    gb.playMove("bQ -wQ")

    print("num nieghbours wA1 = {}".format(len(gb.getNeighbours("wA1"))))
    print("num nieghbours bS1 = {}".format(len(gb.getNeighbours("bS1"))))
    print("num nieghbours wQ = {}".format(len(gb.getNeighbours("wQ"))))
    print("num nieghbours bQ = {}".format(len(gb.getNeighbours("bQ"))))

    gb.printBoard()

    

