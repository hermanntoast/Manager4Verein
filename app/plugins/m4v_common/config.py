import os
import json

from .exceptions import ConfigException

class ConfigReader:
    def __init__(self):
        self.path = "/opt/app/config/config.json"
        self.config = None

    def load(self):
        with open(self.path) as file:
            self.config = json.load(file)
        return self

    def get(self):
        if self.config != None:
            return self.config
        return "ERROR"
