import os
import requests
from flask import Flask, render_template, request, json
from flask_sslify import SSLify

app = Flask(__name__)
app.debug = not os.environ.get('DEPLOYED')
app.config['BACKEND_URL'] = 'http://127.0.0.1:3000'
app.config['IMAGE_PROCESSOR'] = app.config['BACKEND_URL'] + '/api/upload_image'
app.config['CODE_RESUBMISSION'] = app.config['BACKEND_URL'] + '/api/resubmit_code'
app.config['TEMPLATE'] = app.config['BACKEND_URL'] + '/api/template'
sslify = SSLify(app)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files.get('file')
        if not file or not file.filename:
            # TODO: show there's an error on the page
            return render_template('base.html')
        else:
            url = '{}?language={}'.format(app.config['IMAGE_PROCESSOR'], request.args.get('language'))

            if 'template' in request.args:
                url = '{}&template={}'.format(url, request.args.get('template'))

            r = requests.post(url, files={'file': file.read()})

            if r.status_code != requests.codes.ok or r.status_code == 404:
                # TODO: Handle error in a better way than just rendering the index
                return render_template('base.html')

            res = r.json()

            return json.dumps({'result': res.get('result',""),
                               'errors': res.get('errors',""),
                               'fixed': res.get('fixed',""),
                               'key': res.get('key',""),
                               'testResults': res.get('testResults', []),
                               'ar': res.get('ar',"")})
    else:
        return render_template('base.html')


@app.route('/resubmit', methods=['POST'])
def resubmit():
    if request.method == 'POST':
        url = '{}?language={}'.format(app.config['CODE_RESUBMISSION'], request.args.get('language'))

        if 'template' in request.args:
            url = '{}&template={}'.format(url, request.args.get('template'))

        r = requests.post(url, json={'code': request.json.get('code'), 'key': request.json.get('key')})

        if r.status_code != requests.codes.ok or r.status_code == 404:
            # TODO: Handle error in a better way than just rendering the index
            return render_template('base.html')

        r = r.json()
        return json.dumps({'result': r.get('result'),
                           'errors': r.get('errors'),
                           'ar': r.get('ar'),
                           'testResults': r.get('testResults', []),
                           'key': r.get('key')})


@app.route('/template', methods=['POST'])
def template():
    if request.method == 'POST':
        template_file = request.files.get('templateFile')
        test_file = request.files.get('testFile')

        if (not template_file or not template_file.filename) and (not test_file or not test_file.filename):
            # TODO: show there's an error on the page
            return json.dumps({
                'id': "",
                'error': "Files missing",
                'success': False
            })

        else:
            r = requests.post(app.config['TEMPLATE'],
                              files={'templateFile': template_file.read(),
                                     'testFile': test_file.read()})

            if r.status_code != requests.codes.ok or r.status_code == 404:
                return json.dumps({
                    'id': "",
                    'error': "Template creation failed",
                    'success': False
                })

            return json.dumps(r.json())


if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', port=80)
