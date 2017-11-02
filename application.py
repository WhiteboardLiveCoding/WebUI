import os
import requests
from flask import Flask, render_template, request, redirect, url_for
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files['file']
        if 'file' not in request.files or file.filename == '':
            return render_template('base.html', template='index.html')
        elif file and allowed_file(file.filename):
            # Save file to file system
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            filesFound = {'file':open(app.config['UPLOAD_FOLDER'] + filename, 'rb')}

            r = requests.post('http://0.0.0.0:5000/api/upload_image', files=filesFound)
            r = r.json()
            # Remove file immediately after we submit it to the other endpoint
            os.remove(app.config['UPLOAD_FOLDER'] + filename)
            # Yeah, request parsing is weird
            unfixed = r[1]
            fixed = r[3]
            result = r[5]
            error = r[7]

            return render_template('base.html', template='code.html', fixed=fixed)
    else:
        return render_template('base.html', template='index.html')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
