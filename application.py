import requests
from flask import Flask, render_template, request, redirect, url_for, json

app = Flask(__name__)
app.config['IMAGE_PROCESSOR'] = 'http://whiteboardlivecoding-ocr.azurewebsites.net/api/upload_image'


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files['file']
        if file.filename == 'blob':
            file.filename = 'blob.png'
        if 'file' not in request.files or file.filename == '':
            return render_template('base.html', template='index.html')
        elif file:
            r = requests.post(app.config['IMAGE_PROCESSOR'],
                              files={'file': file.read()})

            if r.status_code != requests.codes.ok:
                # Handle error in a better way than just rendering the index
                return render_template('base.html', template='index.html')

            r = r.json()

            fixed = r.get('fixed')
            result = r.get('result')
            error = r.get('error')
            ar = r.get('ar')

            # Use this when resubmitting code to run
            key = r.get('key')

            return render_template('base.html',
                                   template='code.html',
                                   fixed=fixed,
                                   result=result,
                                   error=error,
                                   key=key,
                                   ar=ar)
    else:
        return render_template('base.html', template='index.html')


@app.route('/resubmit', methods=['POST'])
def resubmit():
    if request.method == 'POST':
        r = requests.post('http://127.0.0.1:5000/api/resubmit_code',
                          json={'code': request.json.get('code'), 'key': request.json.get('key')})
        r = r.json()
        return json.dumps({'result': r.get('result'), 'error': r.get('error')})


if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=True, port=80)
