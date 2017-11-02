from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('base.html', template='index.html')

@app.route('/code')
def code():
    return render_template('base.html', template='code.html')
