from tola_management.views import (
    audit_log_host_page,
    app_host_page
)

from django.urls import path

urlpatterns = [
    path('audit_log/<int:program_id>/', audit_log_host_page, name="tola_management_audit_log"),
    path('<str:react_app_page>/', app_host_page, name="tola_management"),
]
