from flask import Flask, request
from time import sleep

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
def play():
    from engine import Engine
    if request.method == 'POST':
        print('data=',request.data)
        e = Engine.Engine()
        e.parseGameString(request.data.decode('utf-8'))
        s = e.bestmove(difficulty=1)
        del e, Engine
        return s

    # works first time
    # curl -X POST -H "Content-Type: text/plain" -d "Base;NotStarted;Black[1];wB1" http://0.0.0.0:5000/ai/play
    # doesn't work
    #curl -X POST -H "Content-Type: text/plain" -d "Base;NotStarted;Black[2];wA1 -bG3 \wB1" http://0.0.0.0:5000/ai/play
if __name__ == "__main__":
    app.run(host='0.0.0.0')
