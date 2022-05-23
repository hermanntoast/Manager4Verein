import logging

class MySQLException(Exception):

    def __init__(self, message):
        self.message = message
        self.name = "MySQLException"

    def __str__(self):
        logging.error(self.name + ": " + self.message)


class ConfigException(Exception):

    def __init__(self, message):
        self.message = message
        self.name = "ConfigException"

    def __str__(self):
        logging.error(self.name + ": " + self.message)
