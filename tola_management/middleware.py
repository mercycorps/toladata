import json
from tola_management.models import ProgramAuditLog

class GlobalConstantsMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        js_globals = request.session.get('js_globals', {})
        js_globals.update(self.get_js_globals())
        request.session['js_globals'] = js_globals
        response = self.get_response(request)
        return response

    def get_js_globals(self):
        reason_for_change_options = [
            {'value': value, 'label': label, 'rationale_required': required}
            for (value, label, required) in ProgramAuditLog.reason_for_change_options()]
        return {
            'reason_for_change_options': json.dumps(reason_for_change_options)
        }
