import aj
import yaml
import hashlib

from aj.auth import AuthenticationProvider, OSAuthenticationProvider, AuthenticationService
from aj.config import UserConfigProvider
from aj.plugins.m4v_common.mysql import MySQLConnector
from jadi import component

@component(AuthenticationProvider)
class TMAuthenticationProvider(AuthenticationProvider):
    id = 'm4v'
    name = 'M4V Users'

    def __init__(self, context):
        self.context = context
        self.mysql = MySQLConnector()

    def authenticate(self, username, password):
        mysql_result = self.mysql.get("m4v_users", ["id", "username", "firstname", "lastname", "mail", "password"], "WHERE username LIKE '" + username + "'")
        if len(mysql_result) != 0:
            mysql_result = mysql_result[0]
            password = hashlib.sha512(password.encode('utf-8') + b":" + mysql_result["username"].encode('utf-8')).hexdigest()
            if mysql_result["password"] == password:
                del mysql_result["password"]
                return True
            else:
                return False
        else:
            return False

    def prepare_environment(self, username):
        return None

    def authorize(self, username, permission):
        return True

    def get_isolation_uid(self, username):
        return 0

    def get_isolation_gid(self, username):
        return None

    def get_profile(self, username):
        if username in ["root", None]:
            return { "id": 0 }
        mysql_result = self.mysql.get("m4v_users", ["id", "username", "firstname", "lastname", "mail"], "WHERE username LIKE '" + username + "'")
        if len(mysql_result) != 0:
            return mysql_result[0]

@component(UserConfigProvider)
class TMConfigProvider(UserConfigProvider):
    id = 'm4v'
    name = "M4V Config"

    def __init__(self, context):
        UserConfigProvider.__init__(self, context)
        self.context = context
        try:
            self.user = context.identity
        except AttributeError as e:
            self.user = None
        if self.user:
            self.load()
        else:
            self.data = {}

    def load(self):
        self.data = {}

    def save(self):
        return
