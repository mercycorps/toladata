# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import json
from collections import OrderedDict
from django.core.exceptions import PermissionDenied, ObjectDoesNotExist, SuspiciousOperation
from django.core.serializers.json import DjangoJSONEncoder
from django.core.mail import send_mail
from django.contrib.auth.decorators import login_required
from django.contrib.auth.tokens import default_token_generator
from django.utils.translation import ugettext_lazy as _
from django.template import loader
from django.shortcuts import render
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse
from django.conf import settings
from django.shortcuts import get_object_or_404

from rest_framework.validators import UniqueValidator
from rest_framework.decorators import action
from rest_framework.serializers import (
    Serializer,
    ModelSerializer,
    CharField,
    IntegerField,
    BooleanField,
    DateTimeField,
    EmailField,
    ValidationError
)
from rest_framework.response import Response
from rest_framework import viewsets, pagination, status, permissions

from django.contrib.auth.models import User

from workflow.models import (
    TolaUser,
    Organization,
    Program,
    Country,
    Sector,
    ProgramAccess,
    CountryAccess,
    COUNTRY_ROLE_CHOICES,
    PROGRAM_ROLE_CHOICES
)

from tola_management.models import (
    UserManagementAuditLog,
    OrganizationAdminAuditLog
)

from tola_management.permissions import (
    user_has_basic_or_super_admin,
    HasUserAdminAccess,
    HasOrganizationAdminAccess
)


class Paginator(pagination.PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 50

    def get_paginated_response(self, data):
        response = Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('page_count', self.page.paginator.num_pages),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data),
        ]))
        return response


def requires_basic_or_super_admin(func):
    def wrapper(request, *args, **kwargs):
        if user_has_basic_or_super_admin(request.user):
            return func(request, *args, **kwargs)
        else:
            raise PermissionDenied
    return wrapper


def get_user_page_context(request):
    # json.dumps doesn't seem to respect ordereddicts so we'll sort it on the frontend
    countries = {
        country.id: {
            "id": country.id, "name": country.country,
            "programs": list(country.program_set.all().values_list('id', flat=True))
            } for country in request.user.tola_user.managed_countries.distinct()
    }

    programs = {
        program.id: {"id": program.id, "name": program.name}
        for program in request.user.tola_user.managed_programs.distinct()
    }

    organizations = {
        org.id: {"name": org.name, "id": org.id} for org in Organization.objects.all()
    }

    return {
        "countries": countries,
        "organizations": organizations,
        "programs": programs,
        "users": list(TolaUser.objects.all().values()),
        "access": request.user.tola_user.access_data,
        "is_superuser": request.user.is_superuser,
        "programs_filter": request.GET.getlist('programs[]'),
        "country_filter": request.GET.getlist('countries[]'),
        "organizations_filter": request.GET.getlist('organizations[]'),
        "program_role_choices": PROGRAM_ROLE_CHOICES,
        "country_role_choices": COUNTRY_ROLE_CHOICES,
    }


def get_organization_page_context(request):
    country_filter = request.GET.getlist('countries[]')
    program_filter = request.GET.getlist('programs[]')
    programs = {
        program.id: {"id": program.id, "name": program.name}
        for program in request.user.tola_user.available_programs
    }

    organizations = {}
    for o in Organization.objects.all():
        organizations[o.id] = {"id": o.id, "name": o.name}

    sectors = {}
    for sector in Sector.objects.all():
        sectors[sector.id] = {"id": sector.id, "name": sector.sector}

    countries = {
        country.id: {"name": country.country, "id": country.id}
        for country in Country.objects.all()
    }

    return {
        "programs": programs,
        "organizations": organizations,
        "sectors": sectors,
        "countries": countries,
        "country_filter": country_filter,
        "program_filter": program_filter,
    }


def get_program_page_context(request):
    auth_user = request.user
    tola_user = auth_user.tola_user
    country_filter = request.GET.getlist('countries[]')
    organization_filter = request.GET.getlist('organizations[]')
    users_filter = request.GET.getlist('users[]')

    country_queryset = tola_user.managed_countries
    filtered_countries = {
        country.id: {
            'id': country.id,
            'name': country.country,
        } for country in country_queryset.all()
    }

    all_countries = {
        country.id: {
            'id': country.id,
            'name': country.country,
        } for country in tola_user.managed_countries
    }

    organizations = {
        organization.id: {
            'id': organization.id,
            'name': organization.name,
        } for organization in Organization.objects.all()
    }

    program_queryset = Program.objects.filter(country__in=tola_user.managed_countries)
    programs = [
        {
            'id': program.id,
            'name': program.name,
        } for program in program_queryset.all().distinct()
    ]

    # excluding sectors with no name (sector) set.
    sectors = [
        {
            'id': sector.id,
            'name': sector.sector,
        } for sector in Sector.objects.all() if sector.sector
    ]

    users = {
        user.id: {
            'id': user.id,
            'name': user.name
        } for user in TolaUser.objects.all()
    }

    return {
        'countries': filtered_countries,
        'allCountries': all_countries,
        'organizations': organizations,
        'users': users,
        'programFilterPrograms': programs,
        'sectors': sectors,
        'country_filter': country_filter,
        'organization_filter': organization_filter,
        'users_filter': users_filter,
    }


def get_country_page_context(request):
    auth_user = request.user
    tola_user = auth_user.tola_user

    country_queryset = Country.objects
    if not auth_user.is_superuser:
        country_queryset = tola_user.managed_countries

    countries = [{
        'id': country.id,
        'country': country.country,
    } for country in country_queryset.distinct()]

    organizations = {
        organization.id: {
            'id': organization.id,
            'name': organization.name,
        } for organization in Organization.objects.all()
    }

    program_queryset = Program.objects.all()
    if not auth_user.is_superuser:
        program_queryset = tola_user.managed_programs
    programs = [
        {
            'id': program.id,
            'name': program.name,
        } for program in program_queryset
    ]

    return {
        'is_superuser': request.user.is_superuser,
        'countries': countries,
        'organizations': organizations,
        'programs': programs,
    }


def send_new_user_registration_email(user, request):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    one_time_url = request.build_absolute_uri(
        reverse('password_reset_confirm', kwargs={"uidb64": uid, "token": token})
    )
    gmail_url = request.build_absolute_uri(reverse('social:begin', args=['google-oauth2']))
    c = {'one_time_url': one_time_url, 'user': user, 'gmail_url': gmail_url}
    subject = _('Mercy Corps - Tola New Account Registration')
    html_email_template_name = 'registration/one_time_login_email.html'
    text_email_template_name = 'registration/one_time_login_email.txt'
    html_email = loader.render_to_string(html_email_template_name, c)
    text_email = loader.render_to_string(text_email_template_name, c)

    send_mail(subject=subject, message=text_email, from_email=settings.DEFAULT_FROM_EMAIL,
              recipient_list=[user.email], fail_silently=False, html_message=html_email)


# Create your views here.
@login_required(login_url='/accounts/login/')
@requires_basic_or_super_admin
def app_host_page(request, react_app_page):
    js_context = {}
    page_title = ""
    if react_app_page == 'user':
        js_context = get_user_page_context(request)
        page_title = "User Management"
    elif react_app_page == 'organization':
        js_context = get_organization_page_context(request)
        page_title = "Organization Management"
    elif react_app_page == 'program':
        js_context = get_program_page_context(request)
        page_title = "Program Management"
    elif react_app_page == 'country':
        js_context = get_country_page_context(request)
        page_title = "Country Management"

    json_context = json.dumps(js_context, cls=DjangoJSONEncoder)
    return render(
        request, 'react_app_base.html',
        {"bundle_name": "tola_management_"+react_app_page, "js_context": json_context, "page_title": page_title+" | "}
    )


@login_required(login_url='/accounts/login/')
def audit_log_host_page(request, program_id):
    program = get_object_or_404(Program, pk=program_id)
    js_context = {
        "program_id": program_id,
        "program_name": program.name,
    }
    json_context = json.dumps(js_context, cls=DjangoJSONEncoder)
    if not request.user.tola_user.available_programs.filter(id=program.id).exists():
        raise PermissionDenied
    return render(request, 'react_app_base.html', {"bundle_name": "audit_log", "js_context": json_context, "report_wide": True, "page_title": program.name+" audit log | "})


class AuthUserSerializer(ModelSerializer):
    id = IntegerField(allow_null=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'is_staff', 'is_superuser', 'is_active')


class UserManagementAuditLogSerializer(ModelSerializer):
    id = IntegerField(allow_null=True, required=False)
    admin_user = CharField(source="admin_user.name", max_length=255)
    date = DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = UserManagementAuditLog
        fields = (
            'id',
            'date',
            'admin_user',
            'modified_user',
            'change_type',
            'diff_list',
            'pretty_change_type',
        )


class UserAdminSerializer(ModelSerializer):
    id = IntegerField(allow_null=True, required=False)
    name = CharField(max_length=255, required=False)
    first_name = CharField(source="user.first_name", max_length=100, required=True)
    last_name = CharField(source="user.last_name", max_length=100, required=True)
    username = CharField(source="user.username", max_length=100, required=True)
    organization_id = IntegerField(required=True)
    email = EmailField(source="user.email", max_length=255, required=True)
    user = AuthUserSerializer()

    def validate(self, data):
        # TODO: this was used to enforce uniqueness only on the email field, which is NOT enforced in the backend

        out_data = super(UserAdminSerializer, self).validate(data)

        if self.instance:
            others_username = list(User.objects.filter(username=data['user']['username']))
            others_email = list(User.objects.filter(email=data['user']['email']))
            validation_errors = {}

            if len(others_username) > 1 or (len(others_username) > 0 and others_username[0].id != self.instance.user.id):
                validation_errors.update({"username": _('This field must be unique')})

            if len(others_email) > 1 or (len(others_email) > 0 and others_email[0].id != self.instance.user.id):
                validation_errors.update({"email": _('This field must be unique')})

            if len(validation_errors) > 0:
                raise ValidationError(validation_errors)

        else:
            others_username = list(User.objects.filter(username=data['user']['username']))
            others_email = list(User.objects.filter(email=data['user']['email']))
            validation_errors = {}

            if len(others_username) > 0:
                validation_errors.update({"username": _('This field must be unique')})

            if len(others_email) > 0:
                validation_errors.update({"email": _('This field must be unique')})

            if len(validation_errors) > 0:
                raise ValidationError(validation_errors)

        return out_data

    def create(self, validated_data):
        validated_data["is_active"] = True

        if validated_data["organization_id"] == 1 and not self.context["request"].user.is_superuser:
            raise PermissionDenied(_("Only superusers can create Mercy Corps staff profiles."))

        auth_user_data = validated_data.pop('user')

        # create auth user
        new_django_user = User(
            email=auth_user_data["email"],
            is_active=auth_user_data["is_active"],
            first_name=auth_user_data["first_name"],
            last_name=auth_user_data["last_name"],
            username=auth_user_data["username"],
        )
        new_django_user.save()

        # create tola user
        new_user = TolaUser(
            organization_id=validated_data["organization_id"],
            user=new_django_user,
            mode_of_contact=validated_data["mode_of_contact"],
            phone_number=validated_data["phone_number"],
            title=validated_data["title"]
        )
        new_user.save()

        UserManagementAuditLog.created(
            user=new_user,
            created_by=self.context["request"].user.tola_user,
            entry=new_user.logged_fields
        )

        send_new_user_registration_email(new_django_user, self.context["request"])

        return new_user

    def update(self, instance, validated_data):
        is_superuser = self.context["request"].user.is_superuser

        if (instance.organization_id == 1 or validated_data['organization_id'] == 1) and not is_superuser:
            raise PermissionDenied(_("Only superusers can edit Mercy Corps staff profiles."))

        user = instance

        auth_user_data = validated_data.pop('user')

        previous_entry = user.logged_fields

        user.user.email = auth_user_data["email"]
        user.user.is_active = auth_user_data["is_active"]
        user.user.first_name = auth_user_data["first_name"]
        user.user.last_name = auth_user_data["last_name"]
        user.user.username = auth_user_data["username"]
        user.user.save()

        user.organization_id = validated_data["organization_id"]
        user.mode_of_contact = validated_data["mode_of_contact"]
        user.title = validated_data["title"]
        user.phone_number = validated_data["phone_number"]
        user.save()

        # organization fk obj is not reloaded without this
        user.refresh_from_db()

        UserManagementAuditLog.profile_updated(
            user=user,
            changed_by=self.context["request"].user.tola_user,
            old=previous_entry,
            new=user.logged_fields
        )
        return user

    class Meta:
        model = TolaUser
        fields = (
            'id',
            'user',
            'title',
            'name',
            'first_name',
            'last_name',
            'username',
            'organization_id',
            'mode_of_contact',
            'phone_number',
            'email'
        )


class UserAdminReportSerializer(ModelSerializer):
    id = IntegerField(allow_null=True, required=False)
    organization_name = CharField(
        source="organization.name", max_length=255, allow_null=True, allow_blank=True, required=False)
    organization_id = IntegerField(source="organization.id")
    user_programs = IntegerField(required=False)
    is_active = BooleanField(source="user.is_active")
    is_admin = BooleanField(source="user.is_staff", required=False)
    is_super = BooleanField(source="user.is_superuser", required=False)

    class Meta:
        model = TolaUser
        fields = (
            'id',
            'name',
            'organization_name',
            'organization_id',
            'user_programs',
            'is_active',
            'is_admin',
            'is_super'
        )


class UserAdminViewSet(viewsets.ModelViewSet):
    queryset = TolaUser.objects.all()
    serializer_class = UserAdminSerializer
    pagination_class = Paginator
    permission_classes = [permissions.IsAuthenticated, HasUserAdminAccess]

    def get_list_queryset(self):
        req = self.request

        #theres a bug with django rest framework pagination that prevents this from working
        # queryset = TolaUser.objects.all()

        # countries = req.GET.getlist('countries[]')
        # if countries:
        #     queryset = queryset.filter(Q(countries_id__in=countries) | Q(programaccess_set__country_id__in=countries))

        # base_countries = req.GET.getlist('base_countries[]')
        # if base_countries:
        #     queryset = queryset.filter(base_country_id_in=base_countries)

        # programs = req.GET.getlist('programs[]')
        # if programs:
        #     queryset = queryset.filter(Q(programaccess_set__program_id__in=programs) | Q(countries__program_set__id__in=programs))

        # organizations = req.GET.get('organizations[]')
        # if organizations:
        #     queryset = queryset.filter(organization_id__in=organizations)

        # user_status = req.GET.get('user_status')
        # if user_status:
        #     queryset = queryset.filter(user__is_active=user_status)

        # is_admin = req.GET.get('admin_role')
        # if is_admin:
        #     queryset = queryset.filter(user__is_staff=is_admin)

        # users = req.GET.getlist('users[]')
        # if users:
        #     queryset = queryset.filter(id__in=users)

        # program_counts = (
        #     Program.objects.filter(programaccess__tolauser_id=OuterRef('id'))
        #     | Program.objects.filter(country__in=OuterRef('countries'))
        #     | Program.objects.filter(country=OuterRef('country'))
        # ).distinct().order_by().values('id').annotate(c=Count('*')).values('c')

        # queryset = queryset.annotate(user_programs=Subquery(program_counts))

        # return queryset

        params = []

        country_join = ''
        country_where = ''
        if req.GET.getlist('countries[]'):
            params.extend(req.GET.getlist('countries[]'))
            params.extend(req.GET.getlist('countries[]'))
            params.extend(req.GET.getlist('countries[]'))

            #create placeholders for multiple countries and strip the trailing comma
            in_param_string = ('%s,'*len(req.GET.getlist('countries[]')))[:-1]

            country_join = """
                            LEFT JOIN workflow_tolauser_countries wtuc ON wtuc.tolauser_id = wtu.id
                            LEFT JOIN (
                                SELECT
                                    wc.id AS country_id,
                                    wpua.tolauser_id AS tolauser_id
                                FROM workflow_country wc
                                INNER JOIN workflow_program_country wpc ON wc.id = wpc.country_id
                                INNER JOIN workflow_program_user_access wpua ON wpua.program_id = wpc.program_id
                                GROUP BY wpua.tolauser_id, wc.id
                            ) cz ON cz.tolauser_id = wtu.id
                            """
            country_where = 'AND (wtuc.country_id IN ({}) OR wtu.country_id IN ({}) OR cz.country_id IN ({}))'.format(in_param_string, in_param_string, in_param_string)

        base_country_where = ''
        if req.GET.getlist('base_countries[]'):
            params.extend(req.GET.getlist('base_countries[]'))

            #create placeholders for multiple countries and strip the trailing comma
            in_param_string = ('%s,'*len(req.GET.getlist('base_countries[]')))[:-1]

            base_country_where = 'AND wtu.country_id IN ({})'.format(in_param_string)

        program_join = ''
        program_where = ''
        if req.GET.getlist('programs[]'):
            params.extend(req.GET.getlist('programs[]'))

            #create placeholders for multiple programs and strip the trailing comma
            in_param_string = ('%s,'*len(req.GET.getlist('programs[]')))[:-1]

            program_join = """
                INNER JOIN (
                        SELECT
                            wpua.tolauser_id,
                            wpua.program_id
                        FROM workflow_program_user_access wpua
                    UNION DISTINCT
                        SELECT
                            wtuc.tolauser_id,
                            wpc.program_id
                        FROM workflow_tolauser_countries wtuc
                        INNER JOIN workflow_program_country wpc ON wpc.country_id = wtuc.country_id
                ) pz ON pz.tolauser_id = wtu.id
            """
            program_where = 'AND (pz.program_id IN ({}))'.format(in_param_string)

        organization_where = ''
        if req.GET.get('organizations[]'):
            params.append(req.GET.get('organizations[]'))

            organization_where = 'AND wtu.organization_id = %s'

        user_status_where = ''
        if req.GET.get('user_status'):
            params.append(req.GET.get('user_status'))

            user_status_where = 'AND au.is_active = %s'

        admin_role_where = ''
        if req.GET.get('admin_role'):
            params.append(req.GET.get('admin_role'))

            admin_role_where = 'AND au.is_staff = %s'

        users_where = ''
        if req.GET.getlist('users[]'):
            params.extend(req.GET.getlist('users[]'))

            #create placeholders for multiple countries and strip the trailing comma
            in_param_string = ('%s,'*len(req.GET.getlist('users[]')))[:-1]

            users_where = 'AND wtu.id IN ({})'.format(in_param_string)

        return TolaUser.objects.raw("""
            SELECT
                wtu.id,
                au.is_active AS is_active,
                au.is_staff AS is_admin,
                au.is_superuser AS is_super,
                wtu.name,
                wo.name AS organization_name,
                wo.id AS organization_id,
                COUNT(z.program_id) AS user_programs
            FROM workflow_tolauser wtu
            INNER JOIN auth_user au ON wtu.user_id = au.id
            {country_join}
            LEFT JOIN (
                    SELECT
                        wpua.tolauser_id,
                        wpua.program_id
                    FROM workflow_program_user_access wpua
                UNION DISTINCT
                    SELECT
                        wtuc.tolauser_id,
                        wpc.program_id
                    FROM workflow_tolauser_countries wtuc
                    INNER JOIN workflow_program_country wpc ON wpc.country_id = wtuc.country_id
            ) z ON z.tolauser_id = wtu.id
            {program_join}
            LEFT JOIN workflow_organization wo ON wtu.organization_id = wo.id
            WHERE
                1=1
                {country_where}
                {base_country_where}
                {program_where}
                {organization_where}
                {user_status_where}
                {admin_role_where}
                {users_where}
            GROUP BY wtu.id
            ORDER BY wtu.name
        """.format(
            country_join=country_join,
            country_where=country_where,
            base_country_where=base_country_where,
            program_join=program_join,
            program_where=program_where,
            organization_where=organization_where,
            user_status_where=user_status_where,
            admin_role_where=admin_role_where,
            users_where=users_where
        ), params)

    def list(self, request):
        queryset = self.get_list_queryset()

        #TODO write a more performant paginator, rather than converting the
        #query to a list. For now, we're extremely performant with about 1000
        #rows, so just convert to a list and paginate that way
        page = self.paginate_queryset(list(queryset))
        if page is not None:
            serializer = UserAdminReportSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = UserAdminReportSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def resend_registration_email(self, request, pk=None):
        tola_user = TolaUser.objects.get(pk=pk)
        send_new_user_registration_email(tola_user.user, request)
        return Response({})

    @action(detail=True, methods=['GET'])
    def history(self, request, pk=None):
        user = TolaUser.objects.get(pk=pk)
        queryset = UserManagementAuditLog.objects.filter(modified_user=user).select_related('admin_user').order_by('-date')

        serializer = UserManagementAuditLogSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET', 'PUT'])
    def is_active(self, request, pk=None):
        is_active = request.data['user']['is_active']
        user = get_object_or_404(TolaUser, id=pk)

        previous_entry = user.logged_fields

        user.user.is_active = is_active
        user.user.save()

        UserManagementAuditLog.profile_updated(
            user=user,
            changed_by=request.user.tola_user,
            old=previous_entry,
            new=user.logged_fields
        )
        serializer = UserAdminSerializer(user)
        return Response(serializer.data)

    @action(detail=True, methods=['GET', 'PUT'])
    def program_access(self, request, pk=None):
        user = TolaUser.objects.get(pk=pk)
        admin_user = request.user.tola_user

        if request.method == 'PUT':

            previous_entry = user.logged_program_fields

            #we have the awkward problem of how to tell when to delete
            #an existing country access. The answer is we can't know so we
            #dont
            country_data = request.data["countries"]

            if request.user.is_superuser:
                try:
                    user.countryaccess_set.all().delete()
                    for country_id, access in country_data.items():
                        CountryAccess.objects.update_or_create(
                            tolauser=user,
                            country_id=country_id,
                            defaults={
                                "role": access["role"],
                            }
                        )
                except SuspiciousOperation as e:
                    return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            elif country_data and not request.user.is_superuser:
                raise PermissionDenied

            program_data = request.data["programs"]

            programs_by_id = {str(role["country"])+"_"+str(role["program"]): True for role in program_data}
            managed_countries = {country.id: True for country in admin_user.managed_countries.all()}

            for role in ProgramAccess.objects.filter(tolauser=user):
                if (not programs_by_id.get(str(role.country_id)+"_"+str(role.program_id), False)
                        and role.country_id in managed_countries):
                    role.delete()

            added_programs = []
            for program_role in program_data:
                if managed_countries.get(int(program_role["country"]), False):
                    added_programs.append(program_role)

            for access in added_programs:
                ProgramAccess.objects.update_or_create(
                    tolauser=user,
                    program_id=access["program"],
                    country_id=access["country"],
                    defaults={
                        "role": access["role"],
                    }
                )

            UserManagementAuditLog.programs_updated(
                user=user,
                changed_by=request.user.tola_user,
                old=previous_entry,
                new=user.logged_program_fields
            )

            return Response({}, status=status.HTTP_200_OK)

        elif request.method == 'GET':
            return Response(user.access_data)

    @action(detail=False, methods=['POST'])
    def bulk_update_status(self, request):

        tola_users = TolaUser.objects.filter(pk__in=request.data["user_ids"])
        User.objects.filter(pk__in=[t_user.user_id for t_user in tola_users]).update(is_active=bool(request.data["new_status"]))
        updated = [{
            'id': tu.id,
            'is_active': tu.user.is_active,
        } for tu in tola_users]
        return Response(updated)

    @action(detail=False, methods=['POST'])
    def bulk_add_programs(self, request):
        added_programs = request.data["added_programs"]

        managed_countries = {country.id: True for country in self.request.user.tola_user.managed_countries.all()}

        for role in added_programs:
            if int(role["country"]) in managed_countries:
                for user_id in request.data["user_ids"]:
                    user = TolaUser.objects.get(id=user_id)
                    previous_entry = user.logged_program_fields
                    try:
                        access = ProgramAccess.objects.get(tolauser_id=user_id, country_id=role["country"], program_id=role["program"])
                    except ObjectDoesNotExist:
                        access = ProgramAccess(
                            tolauser_id=user_id,
                            country_id=role["country"],
                            program_id=role["program"],
                            role=role["role"]
                        )
                        access.save()
                    UserManagementAuditLog.programs_updated(
                        user=user,
                        changed_by=request.user.tola_user,
                        old=previous_entry,
                        new=user.logged_program_fields
                    )

        program_counts = {}
        for user_id in request.data["user_ids"]:
            user = TolaUser.objects.get(id=user_id)
            program_counts[user_id] = user.available_programs.count()

        return Response(program_counts)

    @action(detail=False, methods=['POST'])
    def bulk_remove_programs(self, request):
        removed_programs = request.data["removed_programs"]

        managed_countries = {country.id: True for country in self.request.user.tola_user.managed_countries.all()}

        for role in removed_programs:
            if int(role["country"]) in managed_countries:
                for user_id in request.data["user_ids"]:
                    user = TolaUser.objects.get(id=user_id)
                    previous_entry = user.logged_program_fields
                    try:
                        access = ProgramAccess.objects.get(tolauser_id=user_id, country_id=role["country"], program_id=role["program"])
                        access.delete()
                    except ObjectDoesNotExist:
                        pass
                    UserManagementAuditLog.programs_updated(
                        user=user,
                        changed_by=request.user.tola_user,
                        old=previous_entry,
                        new=user.logged_program_fields
                    )

        program_counts = {}
        for user_id in request.data["user_ids"]:
            user = TolaUser.objects.get(id=user_id)
            program_counts[user_id] = user.available_programs.count()

        return Response(program_counts)

    @action(detail=True, methods=['GET'])
    def aggregate_data(self, request, pk=None):
        if not pk:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        result = list(TolaUser.objects.raw("""
            SELECT
                wtu.id,
                COUNT(z.program_id) AS user_programs
            FROM workflow_tolauser wtu
            LEFT JOIN (
                    SELECT
                        wpua.tolauser_id,
                        wpua.program_id
                    FROM workflow_program_user_access wpua
                UNION DISTINCT
                    SELECT
                        wtuc.tolauser_id,
                        wpc.program_id
                    FROM workflow_tolauser_countries wtuc
                    INNER JOIN workflow_program_country wpc ON wpc.country_id = wtuc.country_id
            ) z ON z.tolauser_id = wtu.id
            WHERE
                wtu.id = %s
            GROUP BY wtu.id
        """, [pk]))

        if len(result) < 1:
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "program_count": result[0].user_programs
        })


class OrganizationAdminSerializer(Serializer):
    id = IntegerField(allow_null=True, required=False)
    name = CharField(max_length=100)
    primary_address = CharField(max_length=255)
    primary_contact_name = CharField(max_length=255)
    primary_contact_email = CharField(max_length=255)
    primary_contact_phone = CharField(max_length=255)
    mode_of_contact = CharField(required=False, allow_null=True, allow_blank=True, max_length=255)
    program_count = IntegerField(allow_null=True, required=False)
    user_count = IntegerField(allow_null=True, required=False)
    is_active = BooleanField()

    class Meta:
        fields = (
            'id',
            'name',
            'primary_address',
            'primary_contact_name',
            'primary_contact_email',
            'primary_contact_phone',
            'mode_of_contact',
            'program_count',
            'user_count',
            'is_active',
        )


class SectorSerializer(Serializer):
    def to_representation(self, sector):
        return sector.id

    def to_internal_value(self, data):
        sector = Sector.objects.get(pk=data)
        return sector


class OrganizationSerializer(ModelSerializer):
    id = IntegerField(allow_null=True, required=False)
    name = CharField(required=True, validators=[
        UniqueValidator(queryset=Organization.objects.all())
    ])
    primary_address = CharField(required=True)
    primary_contact_name = CharField(required=True)
    primary_contact_email = CharField(required=True)
    primary_contact_phone = CharField(required=True)
    sectors = SectorSerializer(many=True)

    def update(self, instance, validated_data):
        incoming_sectors = validated_data.pop('sectors')
        original_sectors = instance.sectors.all()
        added_sectors = [x for x in incoming_sectors if x not in original_sectors]
        removed_sectors = [x for x in original_sectors if x not in incoming_sectors]

        old = instance.logged_fields
        instance.sectors.add(*added_sectors)
        instance.sectors.remove(*removed_sectors)
        updated_org = super(OrganizationSerializer, self).update(instance, validated_data)

        OrganizationAdminAuditLog.updated(
            organization=updated_org,
            changed_by=self.context.get('request').user.tola_user,
            old=old,
            new=updated_org.logged_fields
        )

        return updated_org

    def create(self, validated_data):
        sectors = validated_data.pop('sectors')
        org = Organization.objects.create(**validated_data)
        org.sectors.add(*sectors)

        OrganizationAdminAuditLog.created(
            organization=org,
            created_by=self.context.get('request').user.tola_user,
            entry=org.logged_fields
        )

        return org

    class Meta:
        model = Organization
        fields = (
            'id',
            'name',
            'primary_address',
            'primary_contact_name',
            'primary_contact_email',
            'primary_contact_phone',
            'mode_of_contact',
            'is_active',
            'sectors'
        )


class OrganizationAdminAuditLogSerializer(ModelSerializer):
    id = IntegerField(allow_null=True, required=False)
    admin_user = CharField(source="admin_user.name", max_length=255)
    date = DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = OrganizationAdminAuditLog
        fields = (
            'id',
            'date',
            'admin_user',
            'change_type',
            'diff_list',
            'pretty_change_type',
        )


class OrganizationAdminViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()
    pagination_class = Paginator
    permission_classes = [permissions.IsAuthenticated, HasOrganizationAdminAccess]

    def get_listing_queryset(self):
        req = self.request

        params = []

        country_join = ''
        country_where = ''
        if req.GET.getlist('countries[]'):
            params.extend(req.GET.getlist('countries[]'))

            #create placeholders for multiple countries and strip the trailing comma
            in_param_string = ('%s,'*len(req.GET.getlist('countries[]')))[:-1]

            country_where = 'AND wcz.country_id IN ({})'.format(in_param_string)

            country_join = """
                INNER JOIN (
                        SELECT
                            wo.id AS organization_id,
                            wtuc.country_id AS country_id
                        FROM workflow_organization wo
                        INNER JOIN workflow_tolauser wtu ON wtu.organization_id = wo.id
                        INNER JOIN workflow_tolauser_countries wtuc ON wtuc.tolauser_id = wtu.id
                    UNION DISTINCT
                        SELECT
                            wo.id AS organization_id,
                            wpc.country_id AS country_id
                        FROM workflow_organization wo
                        INNER JOIN workflow_tolauser wtu ON wtu.organization_id = wo.id
                        INNER JOIN workflow_program_user_access wpua ON wpua.tolauser_id = wtu.id
                        INNER JOIN workflow_program_country wpc ON wpua.program_id = wpc.program_id
                    UNION DISTINCT
                        SELECT
                            wo.id AS organization_id,
                            wtu.country_id AS country_id
                        FROM workflow_organization wo
                        INNER JOIN workflow_tolauser wtu ON wtu.organization_id = wo.id
                ) wcz ON wcz.organization_id = wo.id
            """.format(country_where=country_where)

        program_where = ''
        program_join = ''
        if req.GET.getlist('programs[]'):
            params.extend(req.GET.getlist('programs[]'))

            #create placeholders for multiple programs and strip the trailing comma
            in_param_string = ('%s,'*len(req.GET.getlist('programs[]')))[:-1]

            program_join = """
                LEFT JOIN (
                    SELECT
                        wo.id AS organization_id,
                        pz.program_id AS program_id
                    FROM workflow_organization wo
                    INNER JOIN workflow_tolauser wtu ON wo.id = wtu.organization_id
                    INNER JOIN (
                            SELECT
                                wpua.tolauser_id AS tolauser_id,
                                wpua.program_id AS program_id
                            FROM workflow_program_user_access wpua
                        UNION DISTINCT
                            SELECT
                                wtuc.tolauser_id AS tolauser_id,
                                wpc.program_id AS program_id
                            FROM workflow_tolauser_countries wtuc
                            INNER JOIN workflow_program_country wpc ON wpc.country_id = wtuc.country_id
                        UNION DISTINCT
                            SELECT
                                wu.id AS tolauser_id,
                                wpc.program_id AS program_id
                            FROM workflow_tolauser wu
                            INNER JOIN workflow_program_country wpc ON wpc.country_id = wu.country_id
                    ) pz ON pz.tolauser_id = wtu.id
                    GROUP BY wo.id, pz.program_id
                ) pzz ON pzz.organization_id = wo.id
            """

            program_where = 'AND (pzz.program_id IN ({}))'.format(in_param_string)

        organization_where = ''
        if req.GET.getlist('organizations[]'):
            params.extend(req.GET.getlist('organizations[]'))

            #create placeholders for multiple programs and strip the trailing comma
            in_param_string = ('%s,'*len(req.GET.getlist('organizations[]')))[:-1]

            organization_where = 'AND (wo.id IN ({}))'.format(in_param_string)

        organization_status_where = ''
        if req.GET.get('organization_status'):
            params.append(req.GET.get('organization_status'))

            organization_status_where = 'AND wo.is_active = %s'

        sector_join = ''
        sector_where = ''
        if req.GET.get('sectors[]'):
            params.extend(req.GET.getlist('sectors[]'))

            #create placeholders for multiple programs and strip the trailing comma
            in_param_string = ('%s,'*len(req.GET.getlist('sectors[]')))[:-1]
            sector_join = 'INNER JOIN workflow_organization_sectors wos ON wos.organization_id = wo.id'

            sector_where = 'AND (wos.sector_id IN ({}))'.format(in_param_string)

        return Organization.objects.raw("""
            SELECT
                wo.id,
                wo.name,
                wo.primary_address,
                wo.primary_contact_name,
                wo.primary_contact_email,
                wo.primary_contact_phone,
                wo.mode_of_contact,
                COUNT(DISTINCT wtu.id) AS user_count,
                COUNT(DISTINCT pz.program_id) AS program_count,
                wo.is_active
            FROM workflow_organization wo
            LEFT JOIN workflow_tolauser wtu ON wtu.organization_id = wo.id
            {country_join}
            LEFT JOIN (
                SELECT
                    wo.id AS organization_id,
                    pz.program_id AS program_id
                FROM workflow_organization wo
                INNER JOIN workflow_tolauser wtu ON wo.id = wtu.organization_id
                INNER JOIN (
                    SELECT MAX(tu_p.tolauser_id) as tolauser_id, tu_p.program_id
                    FROM (
                            SELECT
                                wpua.tolauser_id,
                                wpua.program_id
                            FROM workflow_program_user_access wpua
                        UNION DISTINCT
                            SELECT
                                wtuc.tolauser_id,
                                wpc.program_id
                            FROM workflow_tolauser_countries wtuc
                            INNER JOIN workflow_program_country wpc ON wpc.country_id = wtuc.country_id
                    ) tu_p
                    GROUP BY tu_p.program_id
                ) pz ON pz.tolauser_id = wtu.id
                GROUP BY wo.id, pz.program_id
            ) pz ON pz.organization_id = wo.id
            {program_join}
            {sector_join}
            WHERE
                1=1
                {country_where}
                {program_where}
                {organization_where}
                {organization_status_where}
                {sector_where}
            GROUP BY wo.id
            ORDER BY wo.name
        """.format(
            program_where=program_where,
            program_join=program_join,
            country_where=country_where,
            country_join=country_join,
            organization_where=organization_where,
            organization_status_where=organization_status_where,
            sector_join=sector_join,
            sector_where=sector_where
        ), params)

    def list(self, request):
        queryset = self.get_listing_queryset()

        page = self.paginate_queryset(list(queryset))
        if page is not None:
            serializer = OrganizationAdminSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = OrganizationAdminSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def history(self, request, pk=None):
        org = Organization.objects.get(pk=pk)
        queryset = OrganizationAdminAuditLog.objects.filter(organization=org).select_related('admin_user').order_by('-date')
        serializer = OrganizationAdminAuditLogSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def aggregate_data(self, request, pk=None):
        if not pk:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        result = list(Organization.objects.raw("""
            SELECT
                wo.id,
                COUNT(DISTINCT wtu.id) AS user_count,
                COUNT(DISTINCT pz.program_id) AS program_count
            FROM workflow_organization wo
            LEFT JOIN workflow_tolauser wtu ON wtu.organization_id = wo.id
            LEFT JOIN (
                SELECT
                    wo.id AS organization_id,
                    pz.program_id AS program_id
                FROM workflow_organization wo
                INNER JOIN workflow_tolauser wtu ON wo.id = wtu.organization_id
                INNER JOIN (
                    SELECT MAX(tu_p.tolauser_id) as tolauser_id, tu_p.program_id
                    FROM (
                            SELECT
                                wpua.tolauser_id,
                                wpua.program_id
                            FROM workflow_program_user_access wpua
                        UNION DISTINCT
                            SELECT
                                wtuc.tolauser_id,
                                wpc.program_id
                            FROM workflow_tolauser_countries wtuc
                            INNER JOIN workflow_program_country wpc ON wpc.country_id = wtuc.country_id
                    ) tu_p
                    GROUP BY tu_p.program_id
                ) pz ON pz.tolauser_id = wtu.id
                GROUP BY wo.id, pz.program_id
            ) pz ON pz.organization_id = wo.id
            WHERE
                wo.id = %s
            GROUP BY wo.id
        """, [pk]))

        if len(result) < 1:
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "user_count": result[0].user_count,
            "program_count": result[0].program_count
        })
