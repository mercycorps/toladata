# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from tola_management.models import (
    CountryAdminAuditLog,
    OrganizationAdminAuditLog,
    ProgramAdminAuditLog,
    ProgramAuditLog,
    UserManagementAuditLog,
)

@admin.register(UserManagementAuditLog)
class UserManagementAuditLogAdmin(admin.ModelAdmin):
    autocomplete_fields = ('admin_user', 'modified_user')
    readonly_fields = ('date',)
    list_display = ('date', 'admin_user', 'modified_user', 'change_type')
    search_fields = ('admin_user', 'modified_user')
    list_filter = ('change_type',)


@admin.register(ProgramAuditLog)
class ProgramAuditLogAdmin(admin.ModelAdmin):
    autocomplete_fields = ('program', 'user', 'indicator', 'level')
    readonly_fields = ('rationale_selections', 'date')
    list_display = ('date', 'change_type', 'user', 'program', 'indicator', 'level')
    search_fields = ('user__name', 'program__name', 'indicator__name', 'level__name')
    list_filter = ('change_type',)


@admin.register(ProgramAdminAuditLog)
class ProgramAdminAuditLogAdmin(admin.ModelAdmin):
    autocomplete_fields = ('program', 'admin_user')
    readonly_fields = ('date',)
    list_display = ('date', 'admin_user', 'program', 'change_type')
    search_fields = ('admin_user__name', 'program__name',)
    list_filter = ('change_type',)
    

@admin.register(OrganizationAdminAuditLog)
class OrganizationAdminAuditLogAdmin(admin.ModelAdmin):
    autocomplete_fields = ('admin_user',)
    readonly_fields = ('date',)
    list_display = ('date', 'admin_user', 'organization', 'change_type')
    search_fields = ('admin_user__name',)
    list_filter = ('change_type', 'organization__name')


@admin.register(CountryAdminAuditLog)
class CountryAdminAuditLogAdmin(admin.ModelAdmin):
    autocomplete_fields = ('admin_user', 'disaggregation_type')
    readonly_fields = ('date',)
    list_display = ('date', 'admin_user', 'country', 'change_type')
    search_fields = ('admin_user__name', 'disaggregation_type__disaggregation_type')
    list_filter = ('change_type', 'country')
