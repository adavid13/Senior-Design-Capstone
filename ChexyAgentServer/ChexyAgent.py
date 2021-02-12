from flask import Flask, request
from time import sleep
app = Flask(__name__)

@app.route("/")
def hello():
    return "<h1 style='color:blue'>Hello There!</h1>\n"

@app.route("/test")
def test():
    return "<h1 style='color:red'>Test</h1>\n"

    
@app.route('/play', methods=['POST'])
def play():
    if request.method == 'POST':
        sleep(10)
        print('keys=',repr([x for x in request.form.keys()]))
        print('vals=',repr([x for x in request.form.values()]))
        print('form=',request.form)
        print('data=',request.data)
        return 'Queen to D4; ' + request.data.decode('utf-8') #repr(request.form) + repr(request.form.values()) 

if __name__ == "__main__":
    app.run(host='0.0.0.0')
