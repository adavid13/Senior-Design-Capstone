from flask import Flask, request
app = Flask(__name__)

@app.route("/")
def hello():
    return "<h1 style='color:blue'>Hello There!</h1>"

    
@app.route('/play', methods=['POST'])
def play():
    if request.method == 'POST':
        return request.form  #echo

if __name__ == "__main__":
    app.run(host='0.0.0.0')
