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
        # Due to doubled offsets being used, MAX_BOARD SIZE needs to be twice the size of 
        # the actual amount of tiles that can be placed end-to-end
        self.MAX_BOARD_SIZE = 40
        self.Board = [[None for _ in range(self.MAX_BOARD_SIZE)] for __ in range(self.MAX_BOARD_SIZE)]
        self.pieces = []

    def playMove(self, moveString):
        """
        Seperates moves that place a piece and moves that move a piece from one place to another
        """
        # print('playMove')
        # print('ms=',moveString)
        splitStr = moveString.split()
        pieceStr = splitStr[0]
        if len(splitStr) > 1:
            relativeStr = splitStr[1]
        else:
            relativeStr = None
        if self.getPieceFromString(pieceStr) is not None:
            # print('if')
            self.movePiece(pieceStr, relativeStr)
        else:
            # print('else')
            self.insertPiece(pieceStr, relativeStr)

    def insertPiece(self, piece, relativeLoc):
        """
        Inserts a piece onto the board in UHP notation (ex: wS1 wS2/)

        No checking for validity yet (e.g. check if board is empty if relativeLoc is None)
        """
        gamePiece = self.createPiece(piece)
        self.pieces.append(gamePiece)
        if relativeLoc is None:
            self.Board[self.MAX_BOARD_SIZE//2][self.MAX_BOARD_SIZE//2] = gamePiece
            gamePiece.coordinates = (self.MAX_BOARD_SIZE//2, self.MAX_BOARD_SIZE//2)
            return
        
        direction, relPieceString = self.getDirectionAndPieceString(relativeLoc)

        relativePiece = self.getPieceFromString(relPieceString)
        #tuple (x, y)
        if relativePiece is None:
            raise Exception("piece {} is not on the board yet".format(relPieceString))
        relativePieceCoordinates = relativePiece.coordinates

        # See linked guide at top of file to see how these translations are determined
        newCoords = self.getNewCoordinates(relativePieceCoordinates, direction)
        if direction != "beetleclimb":
            self.Board[newCoords[0]][newCoords[1]] = gamePiece
        else:
            self.Board[relativePieceCoordinates[0]][relativePieceCoordinates[1]].beetleOnTop = gamePiece
        gamePiece.coordinates = newCoords
        return

    def movePiece(self, piece, relativeLoc):
        """
        Moves a piece to another location

        No validity checking yet
        """
        # print('piece=',piece,'relLoc=',relativeLoc)

        direction, relPieceString = self.getDirectionAndPieceString(relativeLoc)


        relativePiece = self.getPieceFromString(relPieceString)
        movingPiece = self.getPieceFromString(piece)
        if movingPiece.beetleOnTop is not None:
            raise Exception("piece {} is beelted by piece {}".format(movingPiece, movingPiece.beetleOnTop))
        if relativePiece is None or movingPiece is None:
            raise Exception("This piece not implemented")

        relativePieceCoordinates = relativePiece.coordinates
        newCoords = self.getNewCoordinates(relativePieceCoordinates, direction)

        oldCoords = movingPiece.coordinates
        movingPiece.coordinates = newCoords

        if direction != "beetleclimb":
            self.Board[newCoords[0]][newCoords[1]] = movingPiece
            self.Board[oldCoords[0]][oldCoords[1]] = None
            if piece[1] == 'B':
                #beetle moved off piece
                if movingPiece.beetling is not None:
                    beetledPiece = movingPiece.beetling
                    self.Board[oldCoords[0]][oldCoords[1]] = beetledPiece
                    movingPiece.beetling = None
                    beetledPiece.beetleOnTop = None
        else:
            beetledPiece = movingPiece.beetling
            movingPiece.beetling = self.Board[relativePieceCoordinates[0]][relativePieceCoordinates[1]]

            if beetledPiece is not None:
                self.Board[oldCoords[0]][oldCoords[1]] = beetledPiece #redundant b/c already the case?
                beetledPiece.beetleOnTop = None
            else:
                self.Board[oldCoords[0]][oldCoords[1]] = None
            self.Board[relativePieceCoordinates[0]][relativePieceCoordinates[1]].beetleOnTop = movingPiece



    def getNewCoordinates(self, relativePieceCoordinates, direction):
        """
        Helps translates UHP notation to engine array coordinates
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
        # print("getDirectionAndPieceString")
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
            raise NotImplementedError("This piece ({}) is not available".format(piece))

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
        
        Actually I don't think it'll be required. GameModel will have a function that generates a new board from GameString
        """

        pass

    def isGameOver(self):
        """
        Determines if the game is over, "W": white win, "B": Black win, "D": Draw, False: not done
        """
        whiteLost = False
        blackLost = False

        whiteQueen = self.getPieceFromString("wQ1")
        if whiteQueen is not None:
            neighbours = self.getNeighbours(whiteQueen)
            whiteLost = len(neighbours) == 6
        
        blackQueen = self.getPieceFromString("bQ1")
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

    def getNeighbours(self, piece=None, coords=None):
        if piece:
            gamePiece = piece
            coords = gamePiece.coordinates
        neighbours = []
        neighbours.append(self.Board[coords[0]-2][coords[1]])
        neighbours.append(self.Board[coords[0]-1][coords[1]-1])
        neighbours.append(self.Board[coords[0]+1][coords[1]-1])
        neighbours.append(self.Board[coords[0]+2][coords[1]])
        neighbours.append(self.Board[coords[0]+1][coords[1]+1])
        neighbours.append(self.Board[coords[0]-1][coords[1]+1])

        #print(neighbours)
        neighbours = [n for n in neighbours if n is not None]
        return neighbours


    def isHiveConnected(self):
        """
        Turns board into a graph structure to detect if the board is a single hive
        """
        if(len(self.pieces) == 0):
            return True
        rootPiece = self.pieces[0]
        pieceStack = [rootPiece]
        connectedSet = set()
        while len(pieceStack) > 0:
            root = pieceStack.pop()
            connectedSet.add(root.id)
            for neigh in self.getNeighbours(root):
                if neigh.id not in connectedSet:
                    pieceStack.append(neigh)

            if root.beetleOnTop is not None:
                pieceStack.append(root.beetleOnTop)

        return len(connectedSet) == len(self.pieces)


    def printBoard(self):
        """
        Debugging tool, displays the board and relative pieces
        """
        for j in range(self.MAX_BOARD_SIZE):
            if j % 2 == 0:
                print('{:02d}'.format(j),end='  ')
        print()
        for j in range(self.MAX_BOARD_SIZE):
            # Every other row is offset
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
                    if self.Board[i][j] is not None and self.Board[i][j].beetleOnTop is not None:
                        rowstr = rowstr[0:-1] + "*"
            print(rowstr, j)


if __name__ == '__main__':
    """
    Driver code for testing
    """
    gb = GameBoard()
    gb.playMove("wS1")
    gb.playMove("bS1 wS1-")
    gb.playMove("wA1 bS1-")
    gb.playMove("bS1 wA1-")
    gb.playMove("wS1 -wA1")
    gb.playMove("bB1 bS1")
    gb.printBoard()

    #print(gb.isGameOver())
    print(gb.isHiveConnected())
    

