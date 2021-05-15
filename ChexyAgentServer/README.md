# Frontend-Backend Communication

## How to Communicate from browser

import node-fetch:

```const fetch = require('node-fetch'); //sudo npm install node-fetch```

make post request with fetch:

currently works with text, but JSON is possible

example modification of init() from GAMEUIScene.js to display server message in browser console:

```
 init(initParams) {
    //executes after selecting difficulty
    console.log('initparam');
    
    //https://www.npmjs.com/package/node-fetch
    //const url = 'http://0.0.0.0:5000/play'; //if running locally
    const url = 'https://chexy.tk/play'; //if on server
    //async method, will wait at least 10 minutes for response
    fetch(url, {
            method: 'POST',
            body:    'King to G1; ',
            headers: { 'Content-Type': 'text/plain' },
        })
        .then(res => res.text())
        .then(text => console.log(text));

    ...
  }

  create() {
      ...
```

After making changes, run 

```
sudo npm install
sudo npm start
```

in game folder

## Testing in browser

open chrome

install CORS Changer extension: https://chrome.google.com/webstore/detail/moesif-origin-cors-change/digfbfaphojjndkpccljibejjbppifbc?hl=en-US.

open console (ctrl-shift-C)

click gear icon

scroll down to network and activate 'Disable cache'

### Local Server

python ChexyAgent.py

or

gunicorn --bind 0.0.0.0:5000 wsgi:app

## Communicate from server

example methods:

```
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
```

To test run

```python <filename.py>```

## Timeouts

There are no known timeouts with development server. Timeouts are set to 700s in production.

## Production

debug workflow: https://askubuntu.com/questions/1187751/django-guncorn-nginx-111-connection-refused-bad-gateway-502

print statements from python will show up here: journalctl -u ChexyAgent.service

## Debuging

curl -X POST -H "Content-Type: text/plain" -d "Base;1;InProgress;Black[2];wB1;bG1 \wB1;wA1 -bG1" https://chexy.tk/ai/play

sudo tail -30 /var/log/nginx/error.log
