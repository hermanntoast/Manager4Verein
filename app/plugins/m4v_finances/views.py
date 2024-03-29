from jadi import component

from aj.api.http import url, HttpPlugin
from aj.auth import authorize
from aj.api.endpoint import endpoint, EndpointError

from aj.plugins.m4v_common.mysql import MySQLConnector

from datetime import datetime

import hashlib
import re

@component(HttpPlugin)
class Handler(HttpPlugin):
    def __init__(self, context):
        self.context = context
        self.mysql = MySQLConnector()

    ############### ACCOUNTS ###############

    @url(r'/api/m4v/finances/accounts')
    @endpoint(api=True)
    def handle_api_m4v_finances_accounts(self, http_context):
        if http_context.method == 'GET':
            mysql_result = self.mysql.get("m4v_accounts", ["id", "name", "description", "type", "total_amount", "created_by", "created_at"])
            return mysql_result

    @url(r'/api/m4v/finances/accounts/add')
    @endpoint(api=True)
    def handle_api_m4v_finances_accounts_add(self, http_context):
        if http_context.method == 'POST':
            name = http_context.json_body()['name']
            description = http_context.json_body()['description']
            type = http_context.json_body()['type']
            created_by = http_context.json_body()['created_by']
            mysql_result = self.mysql.insert("m4v_accounts", {"name": name, "description": description, "type": type, "created_by": created_by, "updated_by": created_by})
            return mysql_result

    @url(r'/api/m4v/finances/accounts/update')
    @endpoint(api=True)
    def handle_api_m4v_finances_accounts_update(self, http_context):
        if http_context.method == 'POST':
            id = http_context.json_body()['id']
            name = http_context.json_body()['name']
            description = http_context.json_body()['description']
            type = http_context.json_body()['type']
            updated_by = http_context.json_body()['updated_by']
            mysql_result = self.mysql.update("m4v_accounts", {"name": name, "description": description, "type": type, "updated_by": updated_by, "updated_at": "NOW()"}, "id = " + str(id))
            return mysql_result
    
    @url(r'/api/m4v/finances/accounts/delete')
    @endpoint(api=True)
    def handle_api_m4v_finances_accounts_delete(self, http_context):
        if http_context.method == 'POST':
            id = http_context.json_body()['id']
            mysql_result = self.mysql.delete("m4v_accounts", "id = " + str(id))
            return mysql_result

    @url(r'/api/m4v/finances/accounts/calc')
    @endpoint(api=True)
    def handle_api_m4v_finances_accounts_calc(self, http_context):
        if http_context.method == 'POST':
            id = http_context.json_body()['id']
            mysql_result = self.mysql.get("m4v_bookings", ["SUM(amount) AS account_total"], "WHERE account = " + str(id))
            if "None" in mysql_result[0]["account_total"]:
                mysql_result[0]["account_total"] = "0.0"
            self.mysql.update("m4v_accounts", {"total_amount": mysql_result[0]["account_total"], "updated_by": "SYSTEM", "updated_at": "NOW()"}, "id = " + str(id))
            return mysql_result

    ############### PROJECTS ###############

    @url(r'/api/m4v/finances/projects')
    @endpoint(api=True)
    def handle_api_m4v_finances_projects(self, http_context):
        if http_context.method == 'GET':
            mysql_result = self.mysql.get("m4v_projects", ["id", "name", "description", "color", "created_by", "created_at"])
            return mysql_result

    @url(r'/api/m4v/finances/projects/add')
    @endpoint(api=True)
    def handle_api_m4v_finances_projects_add(self, http_context):
        if http_context.method == 'POST':
            name = http_context.json_body()['name']
            description = http_context.json_body()['description']
            color = http_context.json_body()['color']
            created_by = http_context.json_body()['created_by']
            mysql_result = self.mysql.insert("m4v_projects", {"name": name, "description": description, "color": color, "created_by": created_by, "updated_by": created_by})
            return mysql_result

    @url(r'/api/m4v/finances/projects/get')
    @endpoint(api=True)
    def handle_api_m4v_finances_projects_get(self, http_context):
        if http_context.method == 'POST':
            id = http_context.json_body()['id']
            mysql_result = self.mysql.get("m4v_projects", ["id", "name", "description", "color", "created_by", "created_at"], "WHERE id = " + str(id))
            return mysql_result

    @url(r'/api/m4v/finances/projects/update')
    @endpoint(api=True)
    def handle_api_m4v_finances_projects_update(self, http_context):
        if http_context.method == 'POST':
            id = http_context.json_body()['id']
            name = http_context.json_body()['name']
            description = http_context.json_body()['description']
            color = http_context.json_body()['color']
            updated_by = http_context.json_body()['updated_by']
            mysql_result = self.mysql.update("m4v_projects", {"name": name, "description": description, "color": color, "updated_by": updated_by, "updated_at": "NOW()"}, "id = " + str(id))
            return mysql_result

    @url(r'/api/m4v/finances/projects/delete')
    @endpoint(api=True)
    def handle_api_m4v_finances_projects_delete(self, http_context):
        if http_context.method == 'POST':
            id = http_context.json_body()['id']
            mysql_result = self.mysql.delete("m4v_projects", "id = " + str(id))
            return mysql_result

    ############### TAXZONES ###############

    @url(r'/api/m4v/finances/taxzones')
    @endpoint(api=True)
    def handle_api_m4v_finances_taxzones(self, http_context):
        if http_context.method == 'GET':
            mysql_result = self.mysql.get("m4v_taxzones", ["id", "name", "tax"])
            return mysql_result

    @url(r'/api/m4v/finances/taxzones/get')
    @endpoint(api=True)
    def handle_api_m4v_finances_taxzones_get(self, http_context):
        if http_context.method == 'POST':
            id = http_context.json_body()['id']
            mysql_result = self.mysql.get("m4v_taxzones", ["id", "name", "tax"], "WHERE id = " + str(id))
            return mysql_result

    ############### BOOKINGS ###############

    @url(r'/api/m4v/finances/bookings')
    @endpoint(api=True)
    def handle_api_m4v_finances_bookings(self, http_context):
        if http_context.method == 'POST':
            account = http_context.json_body()['account']
            month = http_context.json_body()['month']
            year = http_context.json_body()['year']
            monthfilter = ""
            yearfilter = ""
            if int(month) > 0:
                monthfilter = " AND MONTH(booking_date) = " + str(month)
            if int(year) > 0:
                yearfilter = " AND YEAR(booking_date) = " + str(year)
            mysql_result = self.mysql.get("m4v_bookings AS b", ["b.id", "b.name", "b.description", "DATE_FORMAT(booking_date, '%Y-%m-%d') AS booking_date", "DATE_FORMAT(booking_date, '%d.%m.%Y') AS booking_date_formatted", "b.amount", "FORMAT(b.amount, 2) AS amount_formatted", "b.account", "b.project", "p.name AS project_name", "p.color AS project_color", "b.tax_zone", "b.invoice_image", "b.created_by", "b.created_at"], "LEFT JOIN `m4v_projects` AS p ON p.id = b.project WHERE account = " + account + monthfilter + yearfilter + " ORDER BY booking_date")
            return mysql_result

    @url(r'/api/m4v/finances/bookings/add')
    @endpoint(api=True)
    def handle_api_m4v_finances_bookings_add(self, http_context):
        if http_context.method == 'POST':
            name = http_context.json_body()['name']
            description = http_context.json_body()['description']
            amount = http_context.json_body()['amount']
            account = http_context.json_body()['account']
            project = http_context.json_body()['project']
            tax_zone = http_context.json_body()['tax_zone']
            if 'invoice_image' in http_context.json_body():
                invoice_image = http_context.json_body()['invoice_image']
            else:
                invoice_image = ""
            created_by = http_context.json_body()['created_by']
            if 'booking_date' in http_context.json_body():
                try:
                    if "." in http_context.json_body()['booking_date']:
                        booking_date = datetime.strptime(http_context.json_body()['booking_date'], '%d.%m.%y').strftime('%Y-%m-%d %H:%M:%S')
                    elif "-" in http_context.json_body()['booking_date']:
                        booking_date = datetime.strptime(http_context.json_body()['booking_date'], '%Y-%m-%d').strftime('%Y-%m-%d %H:%M:%S')
                    else:
                        booking_date = "NOW()"
                except:
                    booking_date = "NOW()"
            else:
                booking_date = "NOW()"

            values = {
                "name": name, 
                "description": description, 
                "booking_date": booking_date, 
                "amount": amount, 
                "account": account, 
                "project": project, 
                "tax_zone": tax_zone, 
                "invoice_image": invoice_image, 
                "created_by": created_by, 
                "updated_by": created_by
            }

            if 'booking_text' in http_context.json_body():
                values["booking_text"] = http_context.json_body()["booking_text"]

            if 'booking_usage' in http_context.json_body():
                values["booking_usage"] = http_context.json_body()["booking_usage"]

            if 'booking_beneficiary_payer' in http_context.json_body():
                values["booking_beneficiary_payer"] = http_context.json_body()["booking_beneficiary_payer"]

            if 'booking_account_number' in http_context.json_body():
                values["booking_account_number"] = http_context.json_body()["booking_account_number"]

            if 'booking_bic' in http_context.json_body():
                values["booking_bic"] = http_context.json_body()["booking_bic"]

            if "booking_date" in values and "booking_usage" in values and "booking_account_number" in values and "amount" in values:
                values["booking_hash"] = str(values["booking_text"]) + str(values["booking_usage"]) + str(values["booking_account_number"]) + str(values["amount"])
                values["booking_hash"] = re.sub('[^A-Za-z0-9]+', '', values["booking_hash"]).replace(" ", "")
                values["booking_hash"] = hashlib.md5(values["booking_hash"].encode()).hexdigest()

            mysql_result = self.mysql.insert("m4v_bookings", values)
            return mysql_result

    @url(r'/api/m4v/finances/bookings/update')
    @endpoint(api=True)
    def handle_api_m4v_finances_bookings_update(self, http_context):
        if http_context.method == 'POST':
            id = http_context.json_body()['id']
            name = http_context.json_body()['name']
            description = http_context.json_body()['description']
            amount = http_context.json_body()['amount']
            account = http_context.json_body()['account']
            project = http_context.json_body()['project']
            tax_zone = http_context.json_body()['tax_zone']
            invoice_image = http_context.json_body()['invoice_image']
            updated_by = http_context.json_body()['updated_by']

            if 'booking_date' in http_context.json_body():
                try:
                    if "." in http_context.json_body()['booking_date']:
                        booking_date = datetime.strptime(http_context.json_body()['booking_date'], '%d.%m.%y').strftime('%Y-%m-%d %H:%M:%S')
                    elif "-" in http_context.json_body()['booking_date']:
                        booking_date = datetime.strptime(http_context.json_body()['booking_date'], '%Y-%m-%d').strftime('%Y-%m-%d %H:%M:%S')
                    else:
                        booking_date = "NOW()"
                except:
                    booking_date = "NOW()"
            else:
                booking_date = "NOW()"

            mysql_result = self.mysql.update("m4v_bookings", {"name": name, "booking_date": booking_date, "description": description, "amount": amount, "account": account, "project": project, "tax_zone": tax_zone, "invoice_image": invoice_image, "updated_by": updated_by, "updated_at": "NOW()"}, "id = " + str(id))
            return mysql_result

    @url(r'/api/m4v/finances/bookings/delete')
    @endpoint(api=True)
    def handle_api_m4v_finances_bookings_delete(self, http_context):
        if http_context.method == 'POST':
            id = http_context.json_body()['id']
            mysql_result = self.mysql.delete("m4v_bookings", "id = " + str(id))
            return mysql_result

    @url(r'/api/m4v/finances/bookings/years')
    @endpoint(api=True)
    def handle_api_m4v_finances_bookings_years(self, http_context):
        if http_context.method == 'GET':
            mysql_result = self.mysql.get("m4v_bookings", ["YEAR(booking_date) AS year"], "GROUP BY year")
            return mysql_result

    @url(r'/api/m4v/finances/bookings/exist')
    @endpoint(api=True)
    def handle_api_m4v_finances_bookings_exist(self, http_context):
        if http_context.method == 'POST':
            booking_text = http_context.json_body()['booking_text']
            booking_usage = http_context.json_body()['booking_usage']
            booking_account_number = http_context.json_body()['booking_account_number']
            amount = http_context.json_body()['amount']

            booking_hash = str(booking_text) + str(booking_usage) + str(booking_account_number) + str(amount)
            print(booking_hash)
            booking_hash = re.sub('[^A-Za-z0-9]+', '', booking_hash).replace(" ", "")
            booking_hash = hashlib.md5(booking_hash.encode()).hexdigest()
            print(booking_hash)

            mysql_result = self.mysql.get("m4v_bookings", ["id"], "WHERE booking_hash LIKE '" + booking_hash + "'")
            print(mysql_result)
            if len(mysql_result) > 0:
                return True
            return False

    @url(r'/api/m4v/finances/bookings/count')
    @endpoint(api=True)
    def handle_api_m4v_finances_bookings_count(self, http_context):
        if http_context.method == 'POST':
            id = http_context.json_body()['id']
            mysql_result = self.mysql.get("m4v_bookings", ["COUNT(*) AS count_bookings"], "WHERE account = " + str(id))
            return mysql_result

    ############### EVALUATIONS ###############

    @url(r'/api/m4v/finances/evaluations/project')
    @endpoint(api=True)
    def handle_api_m4v_finances_evaluations_project(self, http_context):
        if http_context.method == 'POST':
            project = http_context.json_body()['project']
            date_from = http_context.json_body()['date_from']
            date_to = http_context.json_body()['date_to']
            mysql_result = self.mysql.get("m4v_bookings", ["id", "name", "description", "DATE_FORMAT(booking_date, '%Y-%m-%d') AS booking_date", "amount"], "WHERE project = '" + str(project) + "' AND booking_date BETWEEN '" + str(date_from) + "' AND '" + str(date_to) + "' ORDER BY booking_date")
            
            total_amount = 0.0
            total_amount_minus = 0.0
            total_amount_plus = 0.0
            
            for result in mysql_result:
                total_amount += float(result["amount"])
                if float(result["amount"]) < 0:
                    total_amount_minus += float(result["amount"])
                elif float(result["amount"]) > 0:
                    total_amount_plus += float(result["amount"])
                

            return { "data": mysql_result, "total_amount": total_amount, "total_amount_plus": total_amount_plus, "total_amount_minus": total_amount_minus }