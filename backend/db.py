import mysql.connector
import logging


class Db:
    DEFAULT_USERNAME = 'root'
    DEFAULT_PASSWORD = 'root'
    DEFAULT_HOST = 'localhost'
    DEFAULT_DB_NAME = 'mobile_project'

    def __init__(self, host=DEFAULT_HOST, username=DEFAULT_USERNAME, password=DEFAULT_PASSWORD, db_name=DEFAULT_DB_NAME):
        self.mydb = mysql.connector.connect(
            host=host,
            user=username,
            passwd=password,
            database=db_name
        )
        self.logger = logging.getLogger()
        self.logger.debug("Mysql Connection initialised! {}".format(self.mydb))

    def login_user(self, user, password):
        mycursor = self.mydb.cursor()
        args = (user, password)
        query = "SELECT * FROM users WHERE user = %s and password = %s"
        mycursor.execute(query, args)
        result = mycursor.fetchone()
        self.logger.debug("Checking user {}. Result: {}".format(user, result))
        if result:
            return True, result[0], result[3]
        return False, -1, None

    def get_list_data(self):
        mycursor = self.mydb.cursor()
        query = "SELECT * FROM info"
        mycursor.execute(query)
        result = mycursor.fetchall()
        if not result:
            self.logger.warning("No data found!")
            return []
        lst = [{'text': tup[1], 'importance': tup[2]} for tup in result]
        self.logger.info("Returning list: {}".format(lst))
        return lst
