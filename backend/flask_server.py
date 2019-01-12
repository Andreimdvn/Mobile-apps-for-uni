import json
import logging

from flask import Flask, request
from flask_socketio import SocketIO

from db import Db


class FlaskServer:
    DEFAULT_HOST = "0.0.0.0"
    DEFAULT_PORT = 16000

    flask_app = Flask(__name__)
    app = SocketIO(flask_app)

    def __init__(self, host=DEFAULT_HOST, port=DEFAULT_PORT):
        self.host = host
        self.port = port
        self.request_data = {}
        self.logger = logging.getLogger()
        self.init_requests()
        self.db = Db()

    # not necessary yet
    # def update_wrapper(self):
    #     self.app.emit("update")

    def run(self):
        self.app.run(self.flask_app, self.host, self.port)

    def shutdown_server(self):
        func = request.environ.get('werkzeug.server.shutdown')
        if func is None:
            raise RuntimeError('Not running with the Werkzeug Server')
        func()

    def stop(self):
        self.shutdown_server()

    def init_requests(self):
        self.flask_app.add_url_rule('/test', 'test_request', self.test_request, methods=['GET', 'POST'])
        self.flask_app.add_url_rule('/api/login', 'login', self.login, methods=['POST'])

    def test_request(self):
        self.request_data = request.get_json()
        self.logger.debug("Req data: {}".format(self.request_data))
        return json.dumps("Hello world! Got req: {}".format(self.request_data))

    def login(self):
        request_data = request.get_json()
        self.logger.info("Got login request. Data: {}".format(request_data))
        status, token = self.db.login_user(request_data["user"], request_data["password"])
        self.logger.debug("Login status: {}".format(status))

        return json.dumps({'status': str(status), 'token': token})
