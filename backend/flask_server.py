import json
import logging
import threading
import time

import emails
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
        self.flask_app.add_url_rule('/api/listdata', 'listdata', self.list_data, methods=['POST'])

    def test_request(self):
        self.request_data = request.get_json()
        self.logger.debug("Req data: {}".format(self.request_data))
        return json.dumps("Hello world! Got req: {}".format(self.request_data))

    def login(self):
        request_data = request.get_json()
        self.logger.info("Got login request. Data: {}".format(request_data))
        status, token, email= self.db.login_user(request_data["user"], request_data["password"])
        self.logger.debug("Login status: {}".format(status))
        if status:
            ip = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
            threading.Thread(target=self.__send_login_email, args=(email, ip)).start()
        return json.dumps({'status': str(status), 'token': str(token)})

    def list_data(self):
        request_data = request.get_json()
        self.logger.info("Got request to retrieve list data!")
        data = self.db.get_list_data()
        if request_data:
            self.logger.debug("Will return json dictionary")
            return json.dumps({"data": data})
        else:
            self.logger.debug("Will return json list")
            return json.dumps(data)

    def __send_login_email(self, email, ip):
        """
        Send a validation email (tries 2 times) to a user to notice them to activate the account
        :param activation_hash: generated hash for activation
        :param email: the email were the activation link will be sent
        :return:
        """
        self.logger.info("Will send email to {}".format(email))

        self.logger.info("Got ip of req: {}".format(ip))
        url = 'http://0.0.0.0:16000/api/login'

        for i in range(5):
            m = emails.Message(
                html='<html>New login on from ip <a href="%s"></a></html>' % (ip,),
                subject='Keep it app. New login!',
                mail_from='facultaubb@gmail.com')

            r = m.send(smtp={'host': 'smtp.gmail.com',
                             'tls': True,
                             'user': 'facultaubb@gmail.com',
                             'password': 'P@rolamea'},
                       to=email)
            if r.status_code not in (250,) and i != 1:
                self.logger.info("Email sending error: {}".format(r.status_code))
                time.sleep(5)

            else:
                break
