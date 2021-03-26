from flask import Flask, request
from time import sleep
from engine import Engine

app = Flask(__name__)
# import sys
# # insert at 1, 0 is the script path (or '' in REPL)
# sys.path.insert(1, '/path/to/application/app/folder')

@app.route("/ai/")
def hello():
    return "<h1 style='color:blue'>Hello There!</h1>\n"

@app.route("/ai/test")
def test():
    return "<h1 style='color:red'>Test</h1>\n"


@app.route('/ai/play', methods=['POST'])
#example
# curl -X POST -H "Content-Type: text/plain" -d "Base;InProgress;Black[2];wB1;bG1 \wB1;wA1 -bG1" http://0.0.0.0:5000/ai/play
def play():
    if request.method == 'POST':
        # print('data=',request.data)
        e = Engine.Engine()
        gs = request.data.decode('utf-8')
        e.parseGameString(gs)
        s = e.bestmove(difficulty=1)
        gameStringSplit = gs.split(";")
        return str(';'.join(gameStringSplit+[s]))

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
