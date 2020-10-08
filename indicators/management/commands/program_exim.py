"""
Provides a way to export and import program data
"""
import sys
import json

from django.core.management.base import BaseCommand
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

from rest_framework import serializers

from workflow.models import Program, Sector, Country, SiteProfile, TolaUser, ProfileType
from indicators.models import PeriodicTarget, Indicator, Result, IndicatorType, Level, Objective, \
    DataCollectionFrequency, StrategicObjective, ReportingFrequency, ExternalService


class Command(BaseCommand):
    help = """
        Provides a way to export and import program data.
        """

    def add_arguments(self, parser):
        parser.add_argument('--program_id', help="The id of the program you wish to export")
        parser.add_argument('--json_filepath', help="The JSON file you wish to imoport")

    def handle(self, *args, **options):
        if not options['program_id'] and not options['json_filepath']:
            print("You need to provide either --program_id or --filepath parameters.  Exiting")
            sys.exit()

        if options['program_id']:
            program = Program.objects.get(id=options['program_id'])

            serialized = ProgramSerializer(program).data

            with open('program_export.json', 'w') as fh:
                fh.write(json.dumps(serialized))
        else:
            with open(options['json_filepath'], 'r') as fh:
                imported_json = json.load(fh)

            self.save_program(imported_json)

    # This is just stub code for when multiple DB objects are found when searching for a name.
    # The intent is to ask the user which object to use for the related field.  Because this hasn't
    # been needed yet, it hasn't really been tested or even tried, so more development work will be required.
    def chooseFromMulti(self, choices, fields):
        print 'Select the number of the option you want and hit enter'
        for index, choice in enumerate(choices):
            choice_labels = []
            for field in fields:
                choice_labels.append('%s: %s' % (field, unicode(getattr(choice, field))))
            print '%s. %s' % (index + 1, ' - '.join(choice_labels))
        selection = raw_input("Number: ")
        return choices[int(selection)-1]

    def save_program(self, program_json):
        # TODO: ensure ecoding working properly
        indicators_json = program_json.pop('indicator_set')
        objectives_json = program_json.pop('objective_set')

        program_json['sector'] = self.replace_names_with_values(program_json['sector'], Sector, 'sector', ['sector'])
        program_json['country'] = self.replace_names_with_values(
            program_json['country'], Country, 'country', ['country'])
        sectors = program_json.pop('sector')
        countries = program_json.pop('country')
        program = Program(**program_json)
        program.save()

        for objective_data in objectives_json:
            program.objective_set.add(Objective(**objective_data), bulk=False)

        program.fund_code.add(*fund_codes)
        program.sector.add(*sectors)
        program.country.add(*countries)

        program.save()

        self.save_indicators(indicators_json, program)

    def save_indicators(self, indicators_json, program):
        for indicator_data in indicators_json:

            # Pop off the ones that will need extensive processing
            unassigned_results_json = indicator_data.pop('result_set')
            periodic_targets_json = indicator_data.pop('periodictargets')

            # Pop off the many-to-many fields that will be added after the indicator is saved
            indicator_types = indicator_data.pop('indicator_type')
            objectives = indicator_data.pop('objectives')
            strategic_objectives = indicator_data.pop('strategic_objectives')
            # TODO: disaggregation types should be handled
            disaggregations = indicator_data.pop('disaggregation')

            # First do the foreign keys and save the indicator
            indicator_data['level'] = self.replace_names_with_values(
                indicator_data['level'], Level, 'name', ['name'])
            indicator_data['data_collection_frequency'] = self.replace_names_with_values(
                indicator_data['data_collection_frequency'], DataCollectionFrequency, 'frequency',
                ['frequency'])
            indicator_data['reporting_frequency'] = self.replace_names_with_values(
                indicator_data['reporting_frequency'], ReportingFrequency, 'frequency', ['frequency'])
            indicator_data['sector'] = self.replace_names_with_values(
                indicator_data['sector'], Sector, 'sector', ['sector'])
            indicator_data['external_service_record'] = self.replace_names_with_values(
                indicator_data['external_service_record'], ExternalService, 'name', ['name'])

            indicator = Indicator(**indicator_data)
            indicator.program = program
            indicator.save()

            indicator_types = self.replace_names_with_values(
                indicator_types, IndicatorType, 'indicator_type', ['indicator_type'])
            objectives = self.replace_names_with_values(
                objectives, Objective, 'name', ['name', 'program_id'])
            strategic_objectives = self.replace_names_with_values(
                strategic_objectives, StrategicObjective, 'name', ['name'])

            indicator.indicator_type.add(*indicator_types)
            indicator.objectives.add(*objectives)
            indicator.strategic_objectives.add(*strategic_objectives)
            indicator.save()

            self.save_periodic_targets(periodic_targets_json, indicator)
            self.save_results(unassigned_results_json, indicator)

    def save_periodic_targets(self, periodic_targets_json, indicator):
        for pt_data in periodic_targets_json:
            result_set = pt_data.pop('result_set')

            pt = PeriodicTarget(**pt_data)
            pt.indicator = indicator
            pt.save()

            self.save_results(result_set, indicator, pt)

    def save_results(self, results_json, indicator, pt=None):
        for result_data in results_json:
            sites = result_data.pop('site')
            # TODO: disaggregation should be handled
            disaggregation_values = result_data.pop('disaggregation_value')

            result = Result(**result_data)
            result.indicator = indicator
            result.program = indicator.program
            result.periodic_target = pt
            result.save()

            self.save_sites(sites, result)

    def save_sites(self, sites_json, result):
        for site_data in sites_json:
            site_data['type'] = self.replace_names_with_values(
                site_data['type'], ProfileType, 'profile', ['profile', 'siteprofile'])
            site_data['country'] = self.replace_names_with_values(
                site_data['country'], Country, 'country', ['country'])

            try:
                site = SiteProfile.objects.get(**site_data)
            except ObjectDoesNotExist:
                site = SiteProfile(**site_data)
                site.program = result.indicator.program
                site.save()

            site.result_set.add(result)
            # site = SiteProfile(**site_data)
            # site.save()


    def replace_names_with_values(self, target_object, *args, **kwargs):
        # Return the same target object if it's falsey (empty list, None value, etc...)
        if not target_object:
            return target_object

        if isinstance(target_object, list):
            return_list = []
            for target_name in target_object:
                return_list.append(self.replace_name_with_value(target_name, *args, **kwargs))
            return return_list
        else:
            return self.replace_name_with_value(target_object, *args, **kwargs)

    def replace_name_with_value(self, target_name, target_model, name_field, label_fields, return_obj=True):
        try:
            model_obj = target_model.objects.get(**{name_field: target_name})
        except ObjectDoesNotExist:
            print 'Could not find a {} named {}.  Skipping.'.format(target_model, target_name)
            return
        except MultipleObjectsReturned:
            # TODO: finish working on this interactive element
            # The intent is to ask the user which object to use for the related field.  Because this hasn't
            # been needed yet, it hasn't really been tested or even tried, so more development work will be required.
            print 'There were multiple {}s with the name `{}`'.format(target_model, target_name.encode('utf-8'))
            model_obj = self.chooseFromMulti(target_model.objects.filter(**{name_field: target_name}), label_fields)
        if return_obj:
            return model_obj
        else:
            return model_obj.id


class IndicatorTypeNameSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.indicator_type


class NameSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.name


class FrequencyNameSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.frequency


class SectorNameSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.sector


class CountryNameSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.country


class ProfileNameSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.profile


class SiteSerializer(serializers.ModelSerializer):
    type = ProfileNameSerializer(queryset=ProfileType.objects.all)
    country = CountryNameSerializer(queryset=Country.objects.all)

    class Meta:
        model = SiteProfile
        fields = '__all__'


class ResultNameSerializer(serializers.ModelSerializer):
    # TODO: implement disaggregation serializier
    site = SiteSerializer(many=True)

    class Meta:

        model = Result
        all_fields = set([f.name for f in Result._meta.get_fields()])
        skipped_fields = {
            'agreeement', 'complete', 'approved_by', 'tola_table', 'indicator',
            'update_count_tola_table', 'agreement', 'complete', 'approved_by', 'id',
            'periodic_target', 'program', 'evidence',
        }
        extra_fields = ['site']
        fields = list(all_fields - skipped_fields) + extra_fields


class PeriodicTargetNameSerializer(serializers.ModelSerializer):
    result_set = ResultNameSerializer(many=True)

    class Meta:
        model = PeriodicTarget

        all_fields = set([f.name for f in model._meta.get_fields()])
        skipped_fields = {'indicator', 'result', 'id'}
        extra_fields = ['result_set']
        fields = list(all_fields - skipped_fields) + extra_fields


class ObjectiveSerializer (serializers.ModelSerializer):

    class Meta:
        model = Objective
        fields = ['name', 'description', 'create_date', 'edit_date']


class IndicatorNameSerializer(serializers.ModelSerializer):
    # TODO: include disaggregations
    periodictargets = PeriodicTargetNameSerializer(many=True)
    indicator_type = IndicatorTypeNameSerializer(queryset=IndicatorType.objects.all, many=True)
    level = NameSerializer(queryset=Level.objects.all)
    objectives = NameSerializer(queryset=Objective.objects.all, many=True)
    strategic_objectives = NameSerializer(queryset=StrategicObjective.objects.all, many=True)
    data_collection_frequency = FrequencyNameSerializer(queryset=DataCollectionFrequency.objects.all)
    reporting_frequency = FrequencyNameSerializer(queryset=ReportingFrequency.objects.all)
    sector = SectorNameSerializer(queryset=Sector.objects.all)
    external_service_record = NameSerializer(queryset=ExternalService.objects.all)
    result_set = serializers.SerializerMethodField()
    approved_by = NameSerializer(queryset=TolaUser.objects.all)
    approval_submitted_by = NameSerializer(queryset=TolaUser.objects.all)

    class Meta:
        model = Indicator

        all_fields = set([f.name for f in Indicator._meta.get_fields()])
        skipped_fields = {'result', 'id', 'program', 'indicator_changes'}
        extra_fields = ['periodictargets', 'result_set']
        fields = list(all_fields - skipped_fields) + extra_fields

    def get_result_set(self, obj):
        results = Result.objects.filter(periodic_target_id__isnull=True, indicator=obj.id)
        return ResultNameSerializer(instance=results, many=True).data


class ProgramSerializer(serializers.ModelSerializer):
    sector = SectorNameSerializer(queryset=Sector.objects.all, many=True)
    country = CountryNameSerializer(queryset=Country.objects.all, many=True)
    indicator_set = IndicatorNameSerializer(many=True)
    objective_set = ObjectiveSerializer(many=True)


    class Meta:
        model = Program
        # have to list individually because adding both overrides and related fields
        all_fields = set([f.name for f in Program._meta.get_fields()])
        skipped_fields = {
            'indicator', 'complete', 'agreement', 'country', 'public_dashboard', 'user_access', 'audit_logs',
            'beneficiary', 'programaccess', 'documentation', 'distribution', 'objective', 'trainingattendance',
            'i_program', 'pinned_reports', 'id',
        }
        extra_fields = ['sector', 'country', 'fund_code', 'indicator_set', 'objective_set']
        fields = list(all_fields - skipped_fields) + extra_fields
