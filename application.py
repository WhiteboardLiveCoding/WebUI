import os
import requests
from flask import Flask, render_template, request, json
from flask_sslify import SSLify

app = Flask(__name__)
app.debug = not os.environ.get('DEPLOYED')
app.config['BACKEND_URL'] = 'http://whiteboardlivecoding-ocr.azurewebsites.net'
app.config['IMAGE_PROCESSOR'] = app.config['BACKEND_URL'] + '/api/upload_image'
app.config['CODE_RESUBMISSION'] = app.config['BACKEND_URL'] + '/api/resubmit_code'
sslify = SSLify(app)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files.get('file')
        if not file or not file.filename:
            # TODO: show there's an error on the page
            return render_template('base.html')
        else:
            r = requests.post('{}?language={}'.format(app.config['IMAGE_PROCESSOR'], request.args.get('language')),
                              files={'file': file.read()})

            if r.status_code != requests.codes.ok or r.status_code == 404:
                # TODO: Handle error in a better way than just rendering the index
                return render_template('base.html')

            res = r.json()

            return json.dumps({'result': res.get('result',""),
                               'errors': res.get('errors',""),
                               'fixed': res.get('fixed',""),
                               'key': res.get('key',""),
                               'ar': res.get('ar',"")})
    else:
        return render_template('base.html')


@app.route('/resubmit', methods=['POST'])
def resubmit():
    if request.method == 'POST':
        r = requests.post(app.config['CODE_RESUBMISSION'],
                          json={'code': request.json.get('code'), 'key': request.json.get('key')})

        if r.status_code != requests.codes.ok or r.status_code == 404:
            # TODO: Handle error in a better way than just rendering the index
            return render_template('base.html')

        r = r.json()
        return json.dumps({'result': r.get('result'), 'errors': r.get('errors'), 'ar': r.get('ar'), 'key': r.get('key')})


if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', port=80)
