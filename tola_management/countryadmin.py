from collections import OrderedDict
import json
from django.db import transaction, models
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status

from rest_framework import serializers
from rest_framework import permissions
from rest_framework import pagination
from rest_framework.decorators import action


from workflow.models import (
    Country,
    Organization,
    Program,
    TolaUser,
    ProgramAccess,
    CountryAccess
)
from indicators.models import (
    StrategicObjective,
    DisaggregationType,
    DisaggregationLabel,
)

from tola_management.models import CountryAdminAuditLog

from tola_management.permissions import (
    HasCountryAdminAccess,
    HasRelatedCountryAdminAccess,
)


class Paginator(pagination.PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 50

    def get_paginated_response(self , data):
        response = Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('page_count', self.page.paginator.num_pages),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data),
        ]))
        return response


class CountryAdminSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(allow_null=True, required=False)
    country = serializers.CharField(required=True, max_length=255)
    description = serializers.CharField(allow_blank=True, required=False)
    code = serializers.CharField(max_length=4, allow_blank=True, required=False)
    programs_count = serializers.IntegerField(read_only=True)
    users_count = serializers.SerializerMethodField()
    organizations_count = serializers.SerializerMethodField()

    class Meta:
        model = Country
        fields = (
            'id',
            'country',
            'description',
            'code',
            'programs_count',
            'users_count',
            'organizations_count'
        )

    def get_users_count(self, country):
        """These are prefetched so it isn't DB-expensive, but math done in Python to avoid bad join counts"""
        return len(set(
            [ca.tolauser_id for ca in country.country_users] + [pa.tolauser_id for pa in country.program_users]
        )) + country.su_count

    def get_organizations_count(self, country):
        """As above: prefetched rows are counted in python to avoid join-math issues"""
        org_ids = set(
            [ca.tolauser.organization_id for ca in country.country_users] +
            [pa.tolauser.organization_id for pa in country.program_users] +
            # if there are any superusers, then Mercy Corps is included in the count:
            ([Organization.MERCY_CORPS_ID] if country.su_count else [])
        )
        return len(org_ids)


class CountryAdminViewSet(viewsets.ModelViewSet):
    serializer_class = CountryAdminSerializer
    pagination_class = Paginator
    permission_classes = [permissions.IsAuthenticated, HasCountryAdminAccess]

    @staticmethod
    def annotate_queryset(queryset):
        """Annotates a queryset of Countries with program count and prefetches to calculate user count"""
        su_count = TolaUser.objects.filter(user__is_superuser=True).count()
        queryset = queryset.annotate(
            programs_count=models.Count('program', distinct=True),
            su_count=models.Value(su_count, output_field=models.IntegerField())
        )
        queryset = queryset.prefetch_related(
            models.Prefetch(
                'countryaccess_set',
                queryset=CountryAccess.objects.filter(
                    tolauser__user__is_superuser=False
                ).select_related('tolauser'),
                to_attr='country_users'
            ),
            models.Prefetch(
                'programaccess_set',
                queryset=ProgramAccess.objects.filter(
                    tolauser__user__is_superuser=False
                    ).select_related('tolauser'),
                to_attr='program_users'
            )
        )
        return queryset

    def get_queryset(self):
        """Select countries user can manage, annotate queryset with counts, filter based on provided params"""
        auth_user = self.request.user
        tola_user = auth_user.tola_user
        params = self.request.query_params

        queryset = Country.objects.all()
        if not auth_user.is_superuser:
            queryset = tola_user.managed_countries
        queryset = self.annotate_queryset(queryset)

        countryFilter = params.getlist('countries[]')
        if countryFilter:
            queryset = queryset.filter(pk__in=countryFilter)

        programParam = params.getlist('programs[]')
        if programParam:
            queryset = queryset.filter(program__in=programParam)


        organizationFilter = params.getlist('organizations[]')
        if organizationFilter:
            program_access = ProgramAccess.objects.filter(
                tolauser__organization_id__in=organizationFilter
            ).values_list('country_id', flat=True)
            country_access = CountryAccess.objects.filter(
                tolauser__organization_id__in=organizationFilter
            ).values_list('country_id', flat=True)
            queryset = queryset.filter(
                id__in=set(list(program_access) + list(country_access))
            )

        return queryset.distinct()

    @action(detail=True, methods=['GET'])
    def history(self, request, pk=None):
        country = Country.objects.get(pk=pk)
        queryset = CountryAdminAuditLog.objects.filter(
            country=country).select_related("admin_user", "disaggregation_type").order_by('-date')
        serializer = CountryAdminAuditLogSerializer(queryset, many=True)
        return Response(serializer.data)


class CountryObjectiveSerializer(serializers.ModelSerializer):
    country = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all())
    name = serializers.CharField(required=True, allow_blank=False, max_length=135)
    description = serializers.CharField(max_length=765, allow_blank=True, required=False)
    status = serializers.CharField(max_length=255, allow_blank=True, required=False)

    class Meta:
        model = StrategicObjective
        fields = (
            'id',
            'country',
            'name',
            'description',
            'status',
        )

    def create(self, validated_data):
        objective = super(CountryObjectiveSerializer, self).create(validated_data)
        return objective


class CountryObjectiveViewset(viewsets.ModelViewSet):
    serializer_class = CountryObjectiveSerializer
    permission_classes = [permissions.IsAuthenticated, HasRelatedCountryAdminAccess]

    def get_queryset(self):
        params = self.request.query_params
        queryset = StrategicObjective.objects.all()

        countryFilter = params.get('country')
        if countryFilter:
            queryset = queryset.filter(country__pk=countryFilter)
        return queryset.distinct()


class NestedDisaggregationLabelSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    label = serializers.CharField(required=True)
    customsort = serializers.IntegerField(required=True)
    class Meta:
        model = DisaggregationLabel
        fields = (
            'id',
            'label',
            'customsort'
        )

    def to_representation(self, disaggregation_label):
        ret = super(NestedDisaggregationLabelSerializer, self).to_representation(disaggregation_label)
        ret['in_use'] = disaggregation_label.disaggregatedvalue_set.filter(value__gt=0).exists()
        return ret

    def to_internal_value(self, data):
        if data.get("id") == "new":
            data.pop('id')
        validated_data = super(NestedDisaggregationLabelSerializer, self).to_internal_value(data)
        instance = None
        if validated_data.get('id'):
            instance = DisaggregationLabel.objects.get(pk=validated_data.pop('id'))
            for field, value in validated_data.items():
                setattr(instance, field, value)
        else:
            instance = DisaggregationLabel(**validated_data)
        return instance


class CountryDisaggregationSerializer(serializers.ModelSerializer):
    disaggregation_type = serializers.CharField(required=True)
    labels = NestedDisaggregationLabelSerializer(
        source="disaggregationlabel_set",
        required=False,
        many=True,
    )
    has_indicators = serializers.BooleanField(read_only=True)
    is_archived = serializers.BooleanField(required=False)

    class Meta:
        model = DisaggregationType
        fields = (
            'id',
            'country',
            'disaggregation_type',
            'labels',
            'has_indicators',
            'is_archived',
            'selected_by_default'
        )

    @transaction.atomic
    def update(self, instance, validated_data):
        previous_entry = instance.logged_fields
        change_type = "country_disaggregation_updated"
        if previous_entry['is_archived'] and not validated_data['is_archived']:
            change_type = "country_disaggregation_unarchived"
        updated_label_data = validated_data.pop('disaggregationlabel_set', None)
        if not self.partial or updated_label_data is not None:
            current_labels = [label for label in instance.disaggregationlabel_set.all()]
            removed_labels = [label for label in current_labels if label not in updated_label_data]
            new_labels = [label for label in updated_label_data if label not in current_labels]
            for label in new_labels:
                label.disaggregation_type = instance
                label.save()
            for label in updated_label_data:
                label.save()
            for label in removed_labels:
                label.delete()
        updated_instance = super(CountryDisaggregationSerializer, self).update(instance, validated_data)

        if updated_instance.logged_fields != previous_entry:
            CountryAdminAuditLog.objects.create(
                admin_user=self.context['tola_user'],
                country = instance.country,
                disaggregation_type=instance,
                change_type=change_type,
                previous_entry=json.dumps(previous_entry),
                new_entry=json.dumps(updated_instance.logged_fields),
            )

        return updated_instance

    @transaction.atomic
    def create(self, validated_data):

        labels = validated_data.pop('disaggregationlabel_set')
        instance = super(CountryDisaggregationSerializer, self).create(validated_data)
        for label in labels:
            label.disaggregation_type = instance
            label.save()

        CountryAdminAuditLog.objects.create(
            admin_user=self.context['tola_user'],
            country = instance.country,
            disaggregation_type=instance,
            change_type="country_disaggregation_created",
            previous_entry={},
            new_entry=json.dumps(instance.logged_fields),
        )

        return instance

class CountryDisaggregationViewSet(viewsets.ModelViewSet):
    serializer_class = CountryDisaggregationSerializer
    permission_classes = [permissions.IsAuthenticated, HasRelatedCountryAdminAccess]

    def get_queryset(self):
        params = self.request.query_params
        queryset = DisaggregationType.objects.all()

        countryFilter = params.get('country')
        if countryFilter:
            queryset = queryset.filter(country__pk=countryFilter)

        return queryset

    def destroy(self, request, pk=None):
        disaggregation = DisaggregationType.objects.get(pk=pk)
        previous_entry = disaggregation.logged_fields
        previous_country = disaggregation.country
        if disaggregation.has_indicators:
            disaggregation.is_archived = True
            disaggregation.save()
            # TODO: try catch here in case of bad model / unarchivable?  Test whether archive is the right action?
            CountryAdminAuditLog.objects.create(
                admin_user=self.request.user.tola_user,
                country=disaggregation.country,
                disaggregation_type=disaggregation,
                change_type="country_disaggregation_archived",
                previous_entry=json.dumps(previous_entry),
                new_entry=json.dumps(disaggregation.logged_fields),
            )
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            destroyed = super().destroy(request, pk)
            CountryAdminAuditLog.objects.create(
                admin_user=self.request.user.tola_user,
                country=previous_country,
                disaggregation_type=None,
                change_type="country_disaggregation_deleted",
                previous_entry=json.dumps(previous_entry),
                new_entry={},
            )

            return destroyed

    def get_serializer_context(self):
        context = super(CountryDisaggregationViewSet, self).get_serializer_context()
        context['tola_user'] = self.request.user.tola_user
        return context


class CountryAdminAuditLogSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    admin_user = serializers.CharField(source="admin_user.name")
    disaggregation_type = serializers.SerializerMethodField()
    disaggregation_type_name = serializers.SerializerMethodField()

    class Meta:
        model = CountryAdminAuditLog
        fields = [
            "id",
            "date",
            "admin_user",
            "disaggregation_type",
            "disaggregation_type_name",
            "pretty_change_type",
            "diff_list"
        ]

    def get_disaggregation_type(self, obj):
        if obj.disaggregation_type:
            return obj.disaggregation_type.pk
        else:
            return ""

    def get_disaggregation_type_name(self, obj):
        if obj.disaggregation_type:
            return obj.disaggregation_type.disaggregation_type
        else:
            return ""
