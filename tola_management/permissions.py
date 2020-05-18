from rest_framework import permissions
from django.core.exceptions import PermissionDenied
from django.db.models import Q
from django.shortcuts import get_object_or_404

from workflow.models import (
    Program,
    Country,
    SiteProfile,
    PROGRAM_ROLE_CHOICES,
    PROGRAM_ROLE_INT_MAP,
)

from indicators.models import (
    Result,
    Indicator,
    PeriodicTarget
)


def user_has_basic_or_super_admin(user):
    return (
        user.is_superuser
        or (
            user.tola_user.organization_id == 1
            and user.tola_user.countryaccess_set.filter(
                role='basic_admin'
            ).count() > 0
        )
    )

#wrap a decorator to unify interface between various read/write operations,
#some of which only have a pk and some of which use a program and indicator id
def result_pk_adapter(inner):
    def outer(func):
        wrapped = inner(func)
        def wrapper(request, *args, **kwargs):
            result = get_object_or_404(Result, pk=kwargs.get('pk'))
            indicator_id = result.indicator_id
            program_id = result.indicator.program_id
            kwargs['program'] = program_id
            kwargs['indicator'] = indicator_id
            return wrapped(request, *args, **kwargs)
        return wrapper
    return outer

def indicator_pk_adapter(inner):
    def outer(func):
        wrapped = inner(func)
        def wrapper(request, *args, **kwargs):
            indicator = get_object_or_404(Indicator, pk=kwargs.get('pk'))
            kwargs['program'] = indicator.program_id
            return wrapped(request, *args, **kwargs)
        return wrapper
    return outer

def periodic_target_pk_adapter(inner):
    def outer(func):
        wrapped = inner(func)
        def wrapper(request, *args, **kwargs):
            pt = get_object_or_404(PeriodicTarget, pk=kwargs.get('pk'))
            kwargs['program'] = pt.indicator.program_id
            return wrapped(request, *args, **kwargs)
        return wrapper
    return outer

def indicator_adapter(inner):
    def outer(func):
        wrapped = inner(func)
        def wrapper(request, *args, **kwargs):
            indicator = get_object_or_404(Indicator, pk=kwargs['indicator'])
            kwargs['program'] = indicator.program_id
            return wrapped(request, *args, **kwargs)
        return wrapper
    return outer

def user_has_program_access(user, program):
    return user.is_authenticated and (
        Program.objects.filter(pk=program, user_access=user.tola_user)
        | Program.objects.filter(pk=program, country__in=user.tola_user.countries.all())
        | Program.objects.filter(pk=program, country=user.tola_user.country)
    ).exists()

def user_has_program_roles(user, programs, roles):
    return (user.is_authenticated and
            user.tola_user.programaccess_set.filter(program_id__in=programs, role__in=roles).exists())

def has_iptt_read_access(func):
    def wrapper(request, *args, **kwargs):
        program = kwargs['program']

        if user_has_program_access(request.user, program) or request.user.is_superuser:
            return func(request, *args, **kwargs)
        else:
            raise PermissionDenied
    return wrapper

def user_has_site_access(user, site):
    return user.is_authenticated and (SiteProfile.objects.filter(
        country__in=user.tola_user.available_countries,
        pk=site
    ).exists() or user.is_superuser())

def has_site_create_access(func):
    def wrapper(request, *args, **kwargs):
        request.has_write_access = (request.user.tola_user.programaccess_set.filter(role='high').exists() or
                                    request.user.is_superuser)
        if request.has_write_access:
            return func(request, *args, **kwargs)
        else:
            raise PermissionDenied
    return wrapper

def has_site_delete_access(func):
    def wrapper(request, *args, **kwargs):
        site = SiteProfile.objects.get(pk=kwargs['pk'])
        high_role_programs = request.user.tola_user.programaccess_set.filter(role='high', country=site.country)
        request.has_write_access = Program.objects.filter(
            Q(i_program__in=site.result_set.all())
            | Q(country=site.country),
            id__in=high_role_programs.values('program_id')
        ).exists() or request.user.is_superuser
        if request.has_write_access:
            return func(request, *args, **kwargs)
        else:
            raise PermissionDenied
    return wrapper

def has_site_read_access(func):
    def wrapper(request, *args, **kwargs):
        if user_has_site_access(request.user, kwargs['pk']) or request.user.is_superuser:
            return func(request, *args, **kwargs)
        else:
            raise PermissionDenied
    return wrapper

def has_site_write_access(func):
    def wrapper(request, *args, **kwargs):
        if user_has_site_access(request.user, kwargs['pk']) or request.user.is_superuser:
            site = SiteProfile.objects.get(pk=kwargs['pk'])
            high_role_programs = request.user.tola_user.programaccess_set.filter(role='high', country=site.country)
            request.has_write_access = Program.objects.filter(
                Q(i_program__in=site.result_set.all())
                | Q(country=site.country),
                id__in=high_role_programs.values('program_id')
            ).exists() or request.user.is_superuser
            if request.method == 'GET':
                return func(request, *args, **kwargs)
            elif request.method == 'POST' and request.has_write_access:
                return func(request, *args, **kwargs)
            else:
                raise PermissionDenied
        else:
            raise PermissionDenied
    return wrapper

def has_result_read_access(func):
    def wrapper(request, *args, **kwargs):
        if user_has_program_access(request.user, kwargs['program']) or request.user.is_superuser:
            write_access = (user_has_program_roles(request.user, [kwargs['program']], ['medium', 'high']) or
                            request.user.is_superuser)
            request.has_write_access = write_access
            return func(request, *args, **kwargs)
        else:
            raise PermissionDenied
    return wrapper

def has_result_write_access(func):
    def wrapper(request, *args, **kwargs):
        if user_has_program_access(request.user, kwargs['program']) or request.user.is_superuser:
            write_access = (user_has_program_roles(request.user, [kwargs['program']], ['medium', 'high']) or
                            request.user.is_superuser)
            request.has_write_access = write_access
            if request.method == 'GET':
                return func(request, *args, **kwargs)
            elif request.method == 'POST' and write_access:
                return func(request, *args, **kwargs)
            else:
                raise PermissionDenied
        else:
            raise PermissionDenied
    return wrapper

def has_indicator_read_access(func):
    def wrapper(request, *args, **kwargs):
        if user_has_program_access(request.user, kwargs['program']) or request.user.is_superuser:
            return func(request, *args, **kwargs)
        else:
            raise PermissionDenied
    return wrapper

def has_indicator_write_access(func):
    def wrapper(request, *args, **kwargs):
        if user_has_program_access(request.user, kwargs['program']) or request.user.is_superuser:
            write_access = (user_has_program_roles(request.user, [kwargs['program']], ['high']) or
                            request.user.is_superuser)
            request.has_write_access = write_access
            if request.method == 'GET':
                return func(request, *args, **kwargs)
            elif request.method == 'POST' and write_access:
                return func(request, *args, **kwargs)
            else:
                raise PermissionDenied
        else:
            raise PermissionDenied
    return wrapper

def has_program_write_access(func):
    def wrapper(request, *args, **kwargs):
        if user_has_program_access(request.user, kwargs['pk']) or request.user.is_superuser:
            write_access = (user_has_program_roles(request.user, [kwargs['pk']], ['high']) or
                            request.user.is_superuser)
            request.has_write_access = write_access
            if request.method == 'GET':
                return func(request, *args, **kwargs)
            elif request.method == 'POST' and write_access:
                return func(request, *args, **kwargs)
            else:
                raise PermissionDenied
        else:
            raise PermissionDenied
    return wrapper

def has_program_read_access(func):
    def wrapper(request, *args, **kwargs):
        if user_has_program_access(request.user, kwargs['program']) or request.user.is_superuser:
            write_access = (user_has_program_roles(request.user, [kwargs['program']], ['high']) or
                            request.user.is_superuser)
            request.has_write_access = write_access
            return func(request, *args, **kwargs)
        else:
            raise PermissionDenied
    return wrapper


#
# Program level permission
#


def verify_program_access_level_of_any_program(request, level, country_id=None, super_admin_override=True):
    """
    Determine if a user has a given level or higher of access for any Program

    Raises PermissionDenied if access is not available to the user.

    :param request: Django request
    :param level: PROGRAM_ROLE_CHOICES ('low', 'medium', 'high')
    :param country_id: Only look at program access for a given country, or all countries if None
    :param super_admin_override: If True, the permission check is bypassed if the user is a Super Admin
    :return: None
    """
    # string typing is fun
    assert level in [l[0] for l in PROGRAM_ROLE_CHOICES]

    # none of this makes sense if not logged in
    if not request.user.is_authenticated:
        raise PermissionDenied

    # Let super admins do all the things
    if super_admin_override and request.user.is_superuser:
        return

    tola_user = request.user.tola_user
    user_access_level = None

    # First check for explicit program access - find the highest access level for all programs
    if tola_user.programaccess_set.exists():
        if country_id:
            qs = tola_user.programaccess_set.filter(country_id=country_id)
        else:
            qs = tola_user.programaccess_set.all()
        program_access_obj = max(qs, key=lambda x: PROGRAM_ROLE_INT_MAP.get(x.role, 0))
    else:
        program_access_obj = None

    if program_access_obj:
        user_access_level = program_access_obj.role
    else:
        # Has implicit low level access via country association?
        if country_id:
            implicit_low = (
                tola_user.country_id == country_id or tola_user.countries.filter(country_id=country_id).exists()
                )
        else:
            implicit_low = (Program.objects.filter(country__in=tola_user.countries.all()) |
                            Program.objects.filter(country=tola_user.country)).exists()

        if implicit_low:
            user_access_level = 'low'

    # final check
    if PROGRAM_ROLE_INT_MAP.get(user_access_level, 0) < PROGRAM_ROLE_INT_MAP.get(level):
        raise PermissionDenied


def verify_program_access_level(request, program_id, level, super_admin_override=True):
    """
    Determine if a user has a given level of access or higher to a Program.

    Raises PermissionDenied if access is not available to the user.

    :param request: Django request
    :param level: PROGRAM_ROLE_CHOICES ('low', 'medium', 'high')
    :param super_admin_override: If True, the permission check is bypassed if the user is a Super Admin
    :return: None
    """
    # string typing is fun
    assert level in [l[0] for l in PROGRAM_ROLE_CHOICES]

    # none of this makes sense if not logged in
    if not request.user.is_authenticated:
        raise PermissionDenied

    # Let super admins do all the things
    if super_admin_override and request.user.is_superuser:
        return

    tola_user = request.user.tola_user
    user_access_level = None

    # First check for explicit program access
    program_access_obj = tola_user.programaccess_set.filter(program_id=program_id).first()

    if program_access_obj:
        user_access_level = program_access_obj.role
    else:
        # Has implicit low level access via country association?
        implicit_low = (Program.objects.filter(pk=program_id, country__in=tola_user.countries.all()) |
                        Program.objects.filter(pk=program_id, country=tola_user.country)).exists()

        if implicit_low:
            user_access_level = 'low'

    # final check
    if PROGRAM_ROLE_INT_MAP.get(user_access_level, 0) < PROGRAM_ROLE_INT_MAP.get(level):
        raise PermissionDenied


#
# Tola Admin permissions
#

class HasUserAdminAccess(permissions.BasePermission):
    def has_permission(self, request, view):
        return user_has_basic_or_super_admin(request.user)

    def has_object_permission(self, request, view, obj):
        return user_has_basic_or_super_admin(request.user)


class HasOrganizationAdminAccess(permissions.BasePermission):
    def has_permission(self, request, view):
        return user_has_basic_or_super_admin(request.user)

    def has_object_permission(self, request, view, obj):
        return user_has_basic_or_super_admin(request.user)


class HasProgramAdminAccess(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == 'audit_log' or view.action == 'export_audit_log':
            return request.user.tola_user.available_programs.filter(id=view.kwargs["pk"]).exists()

        return user_has_basic_or_super_admin(request.user)

    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser or request.user.tola_user.managed_programs.filter(id=obj.id).exists()


class HasCountryAdminAccess(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == 'create':
            return request.user.is_superuser
        return user_has_basic_or_super_admin(request.user)

    def has_object_permission(self, request, view, obj):
        tola_user = request.user.tola_user
        return request.user.is_superuser or obj in tola_user.managed_countries


class HasRelatedCountryAdminAccess(permissions.BasePermission):
    def has_permission(self, request, view):
        tola_user = request.user.tola_user
        if view.action == 'create':
            country_id = request.data.get('country')
            return (request.user.is_superuser or
                    Country.objects.get(pk=country_id) in tola_user.managed_countries)
        return user_has_basic_or_super_admin(request.user)

    def has_object_permission(self, request, view, obj):
        tola_user = request.user.tola_user
        return request.user.is_superuser or obj.country in tola_user.managed_countries
