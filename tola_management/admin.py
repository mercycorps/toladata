# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from tola_management.models import (
    UserManagementAuditLog,
)

@admin.register(UserManagementAuditLog)
class UserManagementAuditLogAdmin(admin.ModelAdmin):
    autocomplete_fields = ('admin_user', 'modified_user')
    readonly_fields = ('date',)
    list_display = ('date', 'admin_user', 'modified_user', 'change_type')
    search_fields = ('admin_user', 'modified_user')
    list_filter = ('change_type',)
