from jadi import component

from aj.api.http import url, HttpPlugin
from aj.auth import authorize
from aj.api.endpoint import endpoint, EndpointError

import base64

@component(HttpPlugin)
class Handler(HttpPlugin):
    def __init__(self, context):
        self.context = context

    @url(r'/api/m4v/common/files/csv')
    @endpoint(api=True)
    def handle_api_m4v_common_files_csv(self, http_context):
        if http_context.method == 'POST':
            filecontent = http_context.json_body()['filecontent'].splitlines()
            header = filecontent[0].split(";")
            lines = filecontent.pop(0)

            final_entries = []

            for line in filecontent:
                line = line.split(";")
                tmp = {}
                for entry in line:
                    col_name = header[line.index(entry)].replace("\"", "").lower().replace(" ", "_").replace("/", "").replace("(", "").replace(")", "").replace("-", "_")
                    if "betrag" in col_name:
                        tmp[col_name] = float(entry.replace("\"", "").replace(",", "."))
                        tmp[col_name + "_formatted"] = "{:.2f}".format(tmp[col_name])
                        continue
                    tmp[col_name] = entry.replace("\"", "")
                tmp["selected"] = False
                final_entries.append(tmp)
            
            return final_entries

    @url(r'/api/m4v/common/files/attachment')
    @endpoint(api=True)
    def handle_api_m4v_common_files_attachment(self, http_context):
        if http_context.method == 'POST':
            filecontent = http_context.json_body()['filecontent']
            encoded_pricture = base64.b64encode(filecontent)
            return encoded_string.decode('utf-8')

