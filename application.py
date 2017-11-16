import os
import requests
from flask import Flask, render_template, request, json
from flask_sslify import SSLify

app = Flask(__name__)
app.config['IMAGE_PROCESSOR'] = 'http://whiteboardlivecoding-ocr.azurewebsites.net/api/upload_image'
app.config['RESUBMIT'] = 'http://whiteboardlivecoding-ocr.azurewebsites.net/api/resubmit_code'
app.debug = not os.environ.get('DEPLOYED')
sslify = SSLify(app)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files['file']
        if 'file' not in request.files or file.filename == '':
            return render_template('base.html')
        elif file:
            r = requests.post(app.config['IMAGE_PROCESSOR'],
                              files={'file': file.read()})
            if r.status_code != requests.codes.ok:
                # Handle error in a better way than just rendering the index
                return render_template('base.html')

            r = r.json()

            fixed = r.get('fixed',"")
            result = r.get('result',"")
            error = r.get('error',"")
            ar = r.get('ar',"")

            # Use this when resubmitting code to run
            key = r.get('key',"")

            return json.dumps({'result': r.get('result',""), 'error': r.get('error',""),
                               'fixed':fixed, 'key':key, 'ar':ar})
    else:
        return render_template('base.html')


@app.route('/resubmit', methods=['POST'])
def resubmit():
    if request.method == 'POST':
        r = requests.post(app.config['RESUBMIT'],
                          json={'code': request.json.get('code'), 'key': request.json.get('key')})
        if r.status_code != requests.codes.ok or r.status_code == 404:
            return render_template('base.html')

        res = r.json()
        return json.dumps({'result': res.get('result'), 'error': res.get('error')})


if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', port=80)
