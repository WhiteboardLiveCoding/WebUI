import requests
from flask import Flask, render_template, request

app = Flask(__name__)
app.config['IMAGE_PROCESSOR'] = 'http://whiteboardlivecoding-ocr.azurewebsites.net/api/upload_image'


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files['file']

        if 'file' not in request.files or file.filename == '':
            return render_template('base.html', template='index.html')
        elif file:
            r = requests.post(app.config['IMAGE_PROCESSOR'], files={'file': file.read()})
            r = r.json()

            fixed = r.get('fixed')
            result = r.get('result')
            error = r.get('error')

            # Use this when resubmitting code to run
            key = r.get('key')

            return render_template('base.html', template='code.html', fixed=fixed, result=result, error=error)
    else:
        return render_template('base.html', template='index.html')
