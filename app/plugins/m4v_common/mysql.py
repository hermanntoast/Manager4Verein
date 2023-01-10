import mysql.connector

from .config import ConfigReader
from .exceptions import MySQLException

class MySQLConnector:
    def __init__(self):
        self.config = ConfigReader().load().get()
        self.__connect()
        self.__close()

    def __connect(self):
        self.mysql = mysql.connector.connect(
          host=self.config["mysql_host"],
          user=self.config["mysql_user"],
          password=self.config["mysql_password"],
          database=self.config["mysql_database"]
        )
        if self.mysql == None:
            raise(MySQLException("MySQL Connection failed!"))

    def __close(self):
        self.mysql.close()

    def query(self, query):
        self.__connect()
        cursor = self.mysql.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        self.__close()
        return result

    def get(self, table, fields, append=""):
        self.__connect()
        cursor = self.mysql.cursor()
        field_string = ""
        for field in fields:
            field_string += field + ","
        field_string = field_string[:-1]
        query = "SELECT " + field_string + " FROM " + table + " " + append
        try:
            cursor.execute(query)
            query_results = cursor.fetchall()
        except Exception as e:
            print("====> Query was: " + query)
            print(e)
            return False
        result = []
        for query_result in query_results:
            tmp = {}
            for i in range(0, len(fields)):
                fieldname = fields[i]
                if "AS" in fieldname:
                    fieldname = fieldname.split(" AS ")[1]
                else:
                    if "." in fieldname:
                        fieldname = fieldname.split(".")[1]
                tmp[fieldname] = str(query_result[i])
            result.append(tmp)
        self.__close()
        return result

    def insert(self, table, data_param):
        self.__connect()
        if type(data_param) == type([]):
            datas = data_param
        else:
            datas = [data_param]

        for data in datas:
            cursor = self.mysql.cursor()
            fields = list(data.keys())
            values = []
            for value in data:
                values.append(data[value])
            fields_string = ""
            for field in fields:
                fields_string += field + ","
            fields_string = fields_string[:-1]
            values_str = ""
            for value in values:
                if value == "NOW()":
                    values_str += str(value) + ","
                elif type(value) == str:
                    values_str += "'" + str(value) + "',"
                else:
                    values_str += str(value) + ","
            values_str = values_str[:-1]
            query = "INSERT INTO " + table + " (" + fields_string + ") VALUES (" + values_str + ")"
            try:
                cursor.execute(query)
                self.mysql.commit()
            except Exception as e:
                print("====> Query was: " + query)
                print(e)
                return False

        self.__close()
        return True

    def delete(self, table, filter):
        self.__connect()
        cursor = self.mysql.cursor()
        query = "DELETE FROM " + table + " WHERE " + filter
        try:
            cursor.execute(query)
            self.mysql.commit()
        except Exception as e:
            print("====> Query was: " + query)
            print(e)
            return False

        self.__close()
        return True

    def update(self, table, data, filter):
        self.__connect()
        cursor = self.mysql.cursor()
        data_string = ""
        for d in data:
            if data[d] == "NOW()":
                data_string += str(d) + " = " + str(data[d]) + ","
            elif type(data[d]) == str:
                data_string += str(d) + " = '" + str(data[d]) + "',"
            else:
                data_string += str(d) + " = " + str(data[d]) + ","
        data_string = data_string[:-1]
        query = "UPDATE " + table + " SET " + data_string + " WHERE " + filter
        try:
            cursor.execute(query)
            self.mysql.commit()
        except Exception as e:
            print("====> Query was: " + query)
            print(e)
            return False

        self.__close()
        return True
