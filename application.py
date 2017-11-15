import os
import requests
from flask import Flask, render_template, request, json
from flask_sslify import SSLify

app = Flask(__name__)
app.config['IMAGE_PROCESSOR'] = 'http://whiteboardlivecoding-ocr.azurewebsites.net/api/upload_image'
app.config['RESUBMIT'] = 'http://whiteboardlivecoding-ocr.azurewebsites.net/api/resubmit_code'
sslify = SSLify(app)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files.get('file')
        if not file or not file.filename:
            # TODO: show there's an error on the page
            return render_template('base.html', template='index.html')
        else:
            r = requests.post(app.config['IMAGE_PROCESSOR'],
                              files={'file': file.read()})

            if r.status_code != requests.codes.ok or r.status_code == 404:
                # TODO: Handle error in a better way than just rendering the index
                return render_template('base.html', template='index.html')

            res = r.json()

            return render_template('base.html',
                                   template='code.html',
                                   fixed=res.get('fixed'),
                                   result=res.get('result'),
                                   error=res.get('error'),
                                   key=res.get('key'),  # Use this when resubmitting code to run
                                   ar=res.get('ar'))
    else:
        return render_template('base.html', template='index.html')


@app.route('/resubmit', methods=['POST'])
def resubmit():
    if request.method == 'POST':
        r = requests.post(app.config['RESUBMIT'],
                          json={'code': request.json.get('code'), 'key': request.json.get('key')})
        if r.status_code != requests.codes.ok or r.status_code == 404:
            # TODO: Handle error in a better way than just rendering the index
            return render_template('base.html', template='index.html')

        res = r.json()
        return json.dumps({'result': res.get('result'), 'error': res.get('error')})


if __name__ == "__main__":
    # Only for debugging while developing
    debug = not os.environ.get('DEPLOYED')
    app.run(host='0.0.0.0', debug=debug, port=80)
