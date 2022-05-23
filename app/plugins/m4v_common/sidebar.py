from jadi import component
from aj.plugins.core.api.sidebar import SidebarItemProvider


@component(SidebarItemProvider)
class ItemProvider(SidebarItemProvider):
    def __init__(self, context):
        self.context = context

    def provide(self):
        return [
            {
                'attach': None,
                'id': 'category:management',
                'name': _('Management'),
                'children': [
                ]
            },
            {
                'attach': None,
                'id': 'category:finances',
                'name': _('Finanzen'),
                'children': [
                ]
            },
        ]
