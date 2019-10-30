from collections import OrderedDict
from django.db import transaction
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status

from rest_framework import serializers
from rest_framework import permissions
from rest_framework import pagination


from workflow.models import (
    Country,
    Organization,
    Program,
    TolaUser,
)
from indicators.models import (
    StrategicObjective,
    DisaggregationType,
    DisaggregationLabel,
)

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

    class Meta:
        model = Country
        fields = (
            'id',
            'country',
            'description',
            'code',
        )

    def to_representation(self, country, with_aggregates=True):
        ret = super(CountryAdminSerializer, self).to_representation(country)
        if not with_aggregates:
            return ret

        # users to country by way of program access
        country_users = (
            TolaUser.objects.filter(programaccess__country_id=country.id).select_related('organization')
            | TolaUser.objects.filter(countries__id=country.id).select_related('organization')
            | TolaUser.objects.filter(country__id=country.id).select_related('organization')
        ).distinct()

        organizations = set([tu.organization_id for tu in country_users if tu.organization_id])

        # This would be user directly associated with the country (base country users)
        #user_count = TolaUser.objects.filter(country=country).count()

        program_ids = [program.id for program in Program.objects.filter(country__pk=country.id)]
        program_count = len(program_ids)
        ret['programCount'] = program_count
        ret['user_count'] = len(country_users)
        ret['organizations'] = organizations
        return ret


class CountryAdminViewSet(viewsets.ModelViewSet):
    serializer_class = CountryAdminSerializer
    pagination_class = Paginator
    permission_classes = [permissions.IsAuthenticated, HasCountryAdminAccess]

    def get_queryset(self):
        auth_user = self.request.user
        tola_user = auth_user.tola_user
        params = self.request.query_params

        queryset = Country.objects.all()

        if not auth_user.is_superuser:
            queryset = tola_user.managed_countries

        countryFilter = params.getlist('countries[]')
        if countryFilter:
            queryset = queryset.filter(pk__in=countryFilter)

        programParam = params.getlist('programs[]')
        if programParam:
            queryset = queryset.filter(program__in=programParam)


        organizationFilter = params.getlist('organizations[]')
        if organizationFilter:
            queryset = queryset.filter(
                Q(program__user_access__organization__in=organizationFilter) | Q(users__organization__in=organizationFilter)
            )

        return queryset.distinct()


class CountryObjectiveSerializer(serializers.ModelSerializer):
    #id = serializers.IntegerField(allow_null=True, required=False)
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
    class Meta:
        model = DisaggregationLabel
        fields = (
            'id',
            'label',
        )

    def to_representation(self, disaggregation_label):
        ret = super(NestedDisaggregationLabelSerializer, self).to_representation(disaggregation_label)
        ret['in_use'] = disaggregation_label.disaggregationvalue_set.exists()
        return ret

    def to_internal_value(self, data):
        if data.get("id") == "new":
            data.pop('id')
        validated_data = super(NestedDisaggregationLabelSerializer, self).to_internal_value(data)
        instance = None
        if validated_data.get(id):
            instance = DisaggregationLabel.objects.get(pk=validated_data.id)
            instance.update(**validated_data)
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
            'is_archived'
        )

    @transaction.atomic
    def update(self, instance, validated_data):
        updated_label_data = validated_data.pop('disaggregationlabel_set', None)
        if not self.partial or updated_label_data is not None:
            current_labels = [label for label in instance.disaggregationlabel_set.all()]
            removed_labels = [label for label in current_labels if label not in updated_label_data]
            new_labels = [label for label in updated_label_data if label not in current_labels]
            for label in new_labels:
                label.disaggregation_type = instance
                label.save()
            for label in removed_labels:
                label.delete()
        updated_instance = super(CountryDisaggregationSerializer, self).update(instance, validated_data)
        return updated_instance

    @transaction.atomic
    def create(self, validated_data):
        labels = validated_data.pop('disaggregationlabel_set')
        instance = super(CountryDisaggregationSerializer, self).create(validated_data)
        for label in labels:
            label.disaggregation_type = instance
            label.save()
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
        if disaggregation.has_indicators:
            disaggregation.is_archived = True
            disaggregation.save()
            # TODO: try catch here in case of bad model / unarchivable?  Test whether archive is the right action?
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return super().destroy(request, pk)
