from jadi import component

from aj.plugins.core.api.sidebar import SidebarItemProvider


@component(SidebarItemProvider)
class ItemProvider(SidebarItemProvider):
    def __init__(self, context):
        pass

    def provide(self):
        return [
            {
                'attach': 'category:finances',
                'name': 'Konten',
                'icon': 'file',
                'url': '/view/m4v/finances/accounts',
                'children': []
            },
            {
                'attach': 'category:finances',
                'name': 'Buchungen',
                'icon': 'coins',
                'url': '/view/m4v/finances/bookings',
                'children': []
            },
            {
                'attach': 'category:finances',
                'name': 'Projekte',
                'icon': 'tasks',
                'url': '/view/m4v/finances/projects',
                'children': []
            }
        ]

# Uncomment the following lines to set a new permission
# from aj.auth import PermissionProvider
# @component(PermissionProvider)
# class Permissions (PermissionProvider):
#     def provide(self):
#         return [
#             {
#                 'id': 'm4v_finances:show',
#                 'name': _('Show the Python binding example'),
#                 'default': False,
#             },
#         ]