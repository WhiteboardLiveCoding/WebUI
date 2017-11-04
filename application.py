import os
import requests
from flask import Flask, render_template, request, redirect, url_for
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['IMAGE_PROCESSOR'] = 'http://0.0.0.0:5000/api/upload_image'


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        create_directory()
        file = request.files['file']
        if 'file' not in request.files or file.filename == '':
            return render_template('base.html', template='index.html')
        elif file and allowed_file(file.filename):
            # Save file to file system
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            open_file = open(app.config['UPLOAD_FOLDER'] + filename, 'rb')

            # Build request and close the file
            r = requests.post(app.config['IMAGE_PROCESSOR'],
                              files={'file':open_file.read()})
            r = r.json()
            open_file.close()

            # Yeah, request parsing is weird
            unfixed = r[1]
            fixed = r[3]
            result = r[5]
            error = r[7]

            rendered = render_template('base.html',
                                       template='code.html',
                                       fixed=fixed,
                                       result=result,
                                       error=error)

            # Remove file after everything else is completed
            os.remove(app.config['UPLOAD_FOLDER'] + filename)

            return rendered
    else:
        return render_template('base.html', template='index.html')


def create_directory():
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
