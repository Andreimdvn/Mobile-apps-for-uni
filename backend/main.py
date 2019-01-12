from flask_server import FlaskServer
import logging
import os
import time


def init_logger():
    global logger
    logger = logging.getLogger()

    log_format_string = \
        '[ %(levelname)8s ] | %(asctime)20s | %(filename)15s | %(lineno)4d | %(funcName)15s() | %(message)s'

    log_file_name = os.path.join(os.getcwd(), 'Logs', 'mobile_app%s.log' % time.strftime('%Y-%m-%d %H-%M-%S'))
    logger.setLevel(logging.DEBUG)

    logging.basicConfig(
        format=log_format_string,
        handlers=[
            logging.FileHandler(log_file_name),
            logging.StreamHandler()
        ])


def main():
    init_logger()
    flask_server = FlaskServer()
    flask_server.run()


if __name__ == '__main__':
    main()
