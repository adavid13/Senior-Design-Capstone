from engine import Engine
if __name__ == "__main__":
    games = 1
    wins = []
    turns=[]
    for i in range(games):
        ge = Engine.Engine()
        ge.newGame()
        print("Playing game {} of {}...".format(i+1, games))
        while(True):
            try:
                ge.parse("play {}".format(ge.bestmove(difficulty=1)))
                ge.parse("play {}".format(ge.bestmove(difficulty=0)))
                result = ge.gameModel.board.isGameOver()
                ge.gameModel.board.printBoard()
                if result or ge.gameModel.turnNum>=100:
                    break
            except Exception as e:
                raise(e)
                print("ERROR")
                result = False
                break
        ge.gameModel.board.printBoard()
        print("WINNER! {}".format(result))
        if result == 'W':
            wins.append(1)
        else:
            wins.append(0)
        turns.append(ge.gameModel.turnNum)
        del ge.gameModel
        del ge
    print("wins: ", wins)
    print("turns:", turns)
    print("avg turns:", sum(turns)/len(turns))
    print("white won {}%".format(sum(wins)/games*100))