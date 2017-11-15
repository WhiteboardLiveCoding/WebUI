FROM tiangolo/uwsgi-nginx-flask:python3.6

ENV DEPLOYED True

COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
