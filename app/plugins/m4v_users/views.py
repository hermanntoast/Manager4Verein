from jadi import component

from aj.api.http import url, HttpPlugin
from aj.auth import authorize
from aj.api.endpoint import endpoint, EndpointError

from aj.plugins.m4v_common.mysql import MySQLConnector

import hashlib

@component(HttpPlugin)
class Handler(HttpPlugin):
    def __init__(self, context):
        self.context = context
        self.mysql = MySQLConnector()

    @url(r'/api/m4v/users')
    # Set the right permissions if necessary, see main.py to activate it.
    #@authorize('m4v_users:show')
    @endpoint(api=True)
    def handle_api_m4v_users(self, http_context):
        if http_context.method == 'GET':
            mysql_result = self.mysql.get("m4v_users", ["id", "username", "firstname", "lastname", "mail"])
            return mysql_result
    
    @url(r'/api/m4v/users/update')
    @endpoint(api=True)
    def handle_api_m4v_users_update(self, http_context):
        if http_context.method == 'POST':
            id = http_context.json_body()['id']
            username = http_context.json_body()['username']
            firstname = http_context.json_body()['firstname']
            lastname = http_context.json_body()['lastname']
            mail = http_context.json_body()['mail']
            if "password" in http_context.json_body():
                password = http_context.json_body()['password']
                password = hashlib.sha512(password.encode('utf-8') + b":" + username.encode('utf-8')).hexdigest()
                mysql_result = self.mysql.update("m4v_users", {"firstname": firstname, "lastname": lastname, "mail": mail, "password": password}, "id = " + id)
            else:
                mysql_result = self.mysql.update("m4v_users", {"firstname": firstname, "lastname": lastname, "mail": mail}, "id = " + id)
            return mysql_result

    @url(r'/api/m4v/users/add')
    @endpoint(api=True)
    def handle_api_m4v_users_add(self, http_context):
        if http_context.method == 'POST':
            username = http_context.json_body()['username']
            firstname = http_context.json_body()['firstname']
            lastname = http_context.json_body()['lastname']
            mail = http_context.json_body()['mail']
            password = http_context.json_body()['password']
            password = hashlib.sha512(password.encode('utf-8') + b":" + username.encode('utf-8')).hexdigest()
            mysql_result = self.mysql.insert("m4v_users", {"username": username, "firstname": firstname, "lastname": lastname, "mail": mail, "password": password})
            return mysql_result

    @url(r'/api/m4v/users/delete')
    @endpoint(api=True)
    def handle_api_m4v_users_add(self, http_context):
        if http_context.method == 'POST':
            id = http_context.json_body()['id']
            mysql_result = self.mysql.delete("m4v_users", "id = " + id)
            return mysql_result