from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from django.db.models.query import QuerySet
from django.template import loader
from tola import util
from workflow import models
from tola_management.models import ProgramAdminAuditLog, CountryAdminAuditLog
from indicators.models import IDAAOutcomeTheme
from django.core.mail import send_mail
from smtplib import SMTPException, SMTPRecipientsRefused
from django.conf import settings
import datetime
import calendar
import re
import logging


logger = logging.getLogger(__name__)

def convert_date(date, readable=False):
    """
    Converts date to either a readable format or to django's format

    params:
        date - date to be formatted
        readable - boolean should the date be converted to a readable format

    returns formatted date string
    """
    idaa_format = '%Y-%m-%dT%H:%M:%SZ'
    django_format = '%Y-%m-%d'
    readable_format = '%m/%d/%Y'

    if date == '' or date is None or date == 'None':
        return ''

    if readable:
        try:
            return datetime.datetime.strptime(date, idaa_format).strftime(readable_format)
        except ValueError:
            return datetime.datetime.strptime(date, django_format).strftime(readable_format)

    return datetime.datetime.strptime(date, idaa_format).strftime(django_format)

def clean_idaa_gaitid(gaitid):
    return str(gaitid).split('.')[0]

def get_gaitid_details(gaitid, complete_gaitid_details):
    """
    Returns details for a given gaitid

    params
        gaitid: idaa gaitid to get details for
        complete_gaitid_details: The full gaitid list returned from utils.AccessMSR.gaitid_list

    returns a dictionary of details for the given gaitid or None if the gaitid is not found in complete_gaitid_details
    """
    for gaitid_detail in complete_gaitid_details:
        if gaitid == clean_idaa_gaitid(gaitid_detail['fields']['GaitID']):
            return gaitid_detail['fields']

    return None


class ProgramDiscrepancies:

    def __init__(self):
        self._discrepancies = set()

    @property
    def discrepancies(self):
        """
        Returns a list of discrepancies
        """
        return list(self._discrepancies)

    @property
    def discrepancy_reasons(self):
        """
        Returns a list of discrepancy reasons for the program
        """
        return self._get_discrepancy_reasons()

    @property
    def discrepancy_count(self):
        """
        Returns the number of discrepancies for the program
        """
        return len(self._discrepancies)

    def clear_discrepancies(self):
        """
        Clears all discrepancies for the program
        """
        self._discrepancies = set()

    def has_discrepancy(self, discrepancy):
        """
        Returns True or False if the program has a certain discrepancy
        """
        return discrepancy in self._discrepancies

    def _get_discrepancy_reasons(self):
        """
        Returns a list of discrepancy reasons
        """
        reasons = []

        for discrepancy in self._discrepancies:
            reasons.append(models.ProgramDiscrepancy.DISCREPANCY_REASONS[discrepancy])

        return reasons

    def add_discrepancy(self, discrepancy):
        """
        Add a discrepancy to the objects set
        """
        # Programs with the discrepancy mulitple_programs should not have any other discrepancies attached
        if not self.has_discrepancy('multiple_programs'):
            self._discrepancies.add(discrepancy)

    def get_program_discrepancies(self):
        """
        Returns the record from the ProgramDiscrepancy table or False if one does not exist
        """
        try:
            return models.ProgramDiscrepancy.objects.get(idaa_json__id=self.idaa_program['id'])
        except models.ProgramDiscrepancy.DoesNotExist:
            return False

    def create_discrepancies(self):
        """
        Adds the discrepancies to the database
        """
        if self.discrepancy_count > 0:
            program_discrepancies = self.get_program_discrepancies()

            if program_discrepancies:
                program_discrepancies.discrepancies = self.discrepancies
                program_discrepancies.idaa_json = self.idaa_program

                program_discrepancies.save()

                discrepancy = program_discrepancies
            else:
                discrepancy = models.ProgramDiscrepancy(
                    idaa_json=self.idaa_program,
                    discrepancies=self.discrepancies
                )

                discrepancy.save()

            # self.tola_program will be type QuerySet when there are multiple programs
            if isinstance(self.tola_program, QuerySet):
                for tola_program in self.tola_program:
                    discrepancy.program.add(tola_program)
            else:
                discrepancy.program.add(self.tola_program)


class ProgramValidation(ProgramDiscrepancies):
    funded_str = 'Funded'

    def __init__(self, idaa_program, msr_country_codes_list, msr_gaitid_list, duplicated_gaitids):
        self.idaa_program = idaa_program
        self._validated = False

        self.msr_country_codes_list = msr_country_codes_list
        self.msr_gaitid_list = msr_gaitid_list

        self.duplicated_gaitids = [clean_idaa_gaitid(gaitid) for gaitid in duplicated_gaitids]

        super().__init__()

    @property
    def tola_program_exists(self):
        return not self.tola_program is None

    @property
    def validated(self):
        """
        Property to check that is_valid was called
        """
        return self._validated

    def compressed_idaa_gaitids(self):
        try:
            return [clean_idaa_gaitid(gaitid['LookupValue']) for gaitid in self.idaa_program['GaitIDs']]
        except KeyError:
            return []

    def program_is_funded(self):
        """
        Checks that the IDAA program is funded
        """
        try:
            funded = self.idaa_program['ProgramStatus'] == self.funded_str
        except KeyError:
            funded = False

        return funded

    def valid_gaitids(self):
        """
        Loops through IDAA gait ids and checks that each one is valid
        """
        valid = True
        gaitids = self.compressed_idaa_gaitids()

        if len(gaitids) == 0:
            valid = False
        else:
            for gaitid in gaitids:
                if gaitid == 0:
                    valid = False
                else:
                    try:
                        int(gaitid)
                    except ValueError:
                        valid = False

        if not valid:
            self.add_discrepancy('gaitid')

        return valid

    def has_duplicated_gaitids(self):
        """
        Returns True if the program has a gaitid shared with another IDAA program else False
        """
        has_duplicates = False
        gaitids = self.compressed_idaa_gaitids()

        for gaitid in gaitids:
            if gaitid in self.duplicated_gaitids:
                self.add_discrepancy('duplicate_gaitid')
                has_duplicates = True

        return has_duplicates

    def missing_fields(self):
        """
        Checks that idaa_program is not missing any fields
        """
        fields = ["id", "ProgramName", "ProgramStartDate", "ProgramEndDate", "ProgramStatus", "Country"]
        missing = False

        for field in fields:
            if field not in self.idaa_program or self.idaa_program[field] == '' or self.idaa_program[field] is None:
                self.add_discrepancy(field)
                missing = True
            elif type(self.idaa_program[field]) is list and len(self.idaa_program[field]) == 0:
                self.add_discrepancy(field)
                missing = True

        return missing

    def valid_idaa_program(self):
        """
        Validation for idaa programs
        - program has valid gaitid
        - program has no missing fields
        """
        missing_fields = self.missing_fields()

        valid_gaitids = self.valid_gaitids()
        # Check duplicated gaitids
        if valid_gaitids:
            has_duplicates = self.has_duplicated_gaitids()
        
        self.matching_countries()

        return not missing_fields and valid_gaitids and not has_duplicates and not self.has_discrepancy('Country')

    def matching_countries(self):
        """
        Checks if the IDAA and Tola programs have the same countries
        """
        tola_program_country_codes = []
        idaa_countries = [country['LookupValue'] for country in self.idaa_program['Country']]
        discrepancy = 'countries' if self.tola_program_exists else 'Country'
        matching = True

        if self.tola_program_exists:
            if isinstance(self.tola_program, QuerySet):
                tola_program_country_codes = []
                for tola_program in self.tola_program:
                    tola_program_country_codes.extend([country.code for country in tola_program.country.all()])
            else:
                tola_program_country_codes = [country.code for country in self.tola_program.country.all()]

            # Convert to a set to remove duplicated codes in the cases of mulitple_programs
            tola_program_country_codes = set(tola_program_country_codes)

        if len(tola_program_country_codes) == 0 and self.tola_program_exists:
            self.add_discrepancy(discrepancy)
            matching = False
        else:
            for idaa_country in idaa_countries:
                tola_country_obj = self.get_tola_country(idaa_country)
                if tola_country_obj:
                    if self.tola_program_exists:
                        if tola_country_obj.code in tola_program_country_codes:
                            # Countries matched, remove from tola_program_country_codes
                            tola_program_country_codes.remove(tola_country_obj.code)
                        else:
                            self.add_discrepancy(discrepancy)
                            matching = False

                else:
                    # Could not find a matching tola_country_obj add a discrepancy
                    self.add_discrepancy(discrepancy)
                    matching = False

        # If tola_program_country_codes still has items, then the countries did not fully match
        if len(tola_program_country_codes) > 0:
            self.add_discrepancy(discrepancy)
            matching = False

        return matching

    def valid_tola_program(self):
        """
        Validation for tola programs
        - countries match
        """
        self.matching_countries()

    def valid_tracking_dates(self, tola_program):
        """
        Called from update in the case of a Tola program updating the start and or end dates.
        Checks if the programs editable dates (reporting_period_) falls in the range of the uneditable dates
        """
        valid = False
        first_day = 1
        last_day = calendar.monthrange(tola_program.end_date.year, tola_program.end_date.month)[1]
        first_of_month = datetime.date(tola_program.start_date.year, tola_program.start_date.month, first_day)
        last_of_month = datetime.date(tola_program.end_date.year, tola_program.end_date.month, last_day)

        try:
            if (first_of_month <= tola_program.reporting_period_start <= last_of_month) \
                and (first_of_month <= tola_program.reporting_period_end <= last_of_month):

                valid = True
        except TypeError:
            valid = False

        if not valid:
            self.add_discrepancy('out_of_bounds_tracking_dates')
            self.create_discrepancies()

        return valid

    def is_valid(self):
        """
        Method for checking if the program upload is valid. Checks the IDAA program and if possible the Tola program aswell.
        """
        if not self.program_is_funded():
            # Non funded programs shouldn't show up in the discrepancy report.
            # There is a case when a non-funded program can already have discrepancies at this point.
            # Clear all discrepancies just in case.
            self.clear_discrepancies()
            self.has_duplicated_gaitids()
            return False

        # These discrepancies can come up while trying to retrieve the Tola program
        if self.has_discrepancy('gaitid'):
            self.has_duplicated_gaitids()

        valid_idaa_program = self.valid_idaa_program()

        # Validate the Tola program if one exists
        if self.tola_program_exists:
            self.valid_tola_program()

            self._validated = valid_idaa_program

            return valid_idaa_program

        self._validated = valid_idaa_program

        return valid_idaa_program


class ProgramUpload(ProgramValidation):

    def __init__(self, idaa_program, msr_country_codes_list, msr_gaitid_list, duplicated_gaitids=None):
        self.idaa_program = idaa_program

        self.msr_country_codes_list = msr_country_codes_list
        self.msr_gaitid_list = msr_gaitid_list

        self.duplicated_gaitids = duplicated_gaitids

        super().__init__(
            idaa_program, msr_country_codes_list=msr_country_codes_list, msr_gaitid_list=msr_gaitid_list, 
            duplicated_gaitids=duplicated_gaitids
        )

        self.tola_program = self.get_tola_programs()
        self.program_updated = False
        self._created_countries = set()

    @property
    def new_upload(self):
        return not self.tola_program_exists

    @property
    def multiple_tola_programs(self):
        return isinstance(self.tola_program, QuerySet)

    @property
    def created_countries(self):
        return self._created_countries

    def get_region(self, idaa_region_numeric):
        """
        Returns the matching TolaData Region based on the IDAA RegionNumeric

        Params:
            idaa_region_numeric: The RegionNumeric value from self.msr_country_codes_list

        Returns:
            Either None if a matching Region was not found else the Region object
        """
        no_region_assigned_id = 0

        if idaa_region_numeric == no_region_assigned_id:
            return None

        try:
            return models.Region.objects.get(gait_region_id=idaa_region_numeric)
        except models.Region.DoesNotExist:
            logger.exception(f'Could not find matching Region in TolaData. IDAA RegionID={idaa_region_numeric}')

        return None

    def create_tola_country(self, country_name, country_code, idaa_region_numeric):
        """
        Creates the country in TolaData after creating the country log the country in CountryAdminAuditLog

        Params:
            country_name: country name as string
            country_code: Alpha 2 country code
            idaa_region_numeric: The RegionNumeric value from self.msr_country_codes_list

        Returns:
            None if the country was not created else the country object
        """
        region_object = self.get_region(idaa_region_numeric)

        if not region_object:
            return None

        country = models.Country(country=country_name, region=region_object, code=country_code, organization_id=models.Organization.MERCY_CORPS_ID)
        country.save()

        idaa_user = self.get_idaa_user()

        CountryAdminAuditLog.created(created_by=idaa_user, country=country)

        self._created_countries.add(country)

        return country

    def get_tola_country(self, idaa_country):
        """
        Attempts to find a matching Tola country for the idaa country.
        If a matching country was not found then calls self.create_tola_country
        """
        additional_countries = [
            {
                'idaa_name': 'HQ',
                'country_code': 'HQ'
            },
            {
                'idaa_name': 'Mercy Corps NW',
                'country_code': 'US'
            },
            {
                'idaa_name': 'United Kingdom of Great Britain and Northern Ireland (the)',
                'country_code': 'UK'
            }
        ]

        for country in additional_countries:
            if idaa_country == country['idaa_name']:
                return models.Country.objects.get(code=country['country_code'])

        idaa_country_object = self.get_idaa_country_object(idaa_country)

        if idaa_country_object is None:
            return None

        country_code = idaa_country_object['field_2']

        try:
            return models.Country.objects.get(code=country_code)
        except models.Country.DoesNotExist:
            region_id = int(idaa_country_object['RegionNumeric'])
            return self.create_tola_country(idaa_country, country_code, region_id)

    def get_country_admin_emails(self, program):
        """
        Returns a list of emails for each country admin for the tola_program

        Excludes: mel admins and superusers
        """
        # TODO: This can possibly be removed with the MEL Admin role introduced in Manticore
        mel_admins = [
            'atran@mercycorps.org', 'fhaddad@mercycorps.org', 'hcamp@mercycorps.org', 'mghorkhmazyan@mercycorps.org', 'tscialfa@mercycorps.org',
            'ajoce@mercycorps.org'
        ]
        admin_emails = []
        for country in program.country.all():
            country_admin_emails = models.CountryAccess.objects.filter(country=country, role='basic_admin').exclude(tolauser__user__is_superuser=True).exclude(tolauser__user__email__in=mel_admins).values_list('tolauser__user__email', flat=True)
            admin_emails.extend(country_admin_emails)

        return admin_emails


    def get_tola_programs(self):
        """
        Queries the Program table for Tola programs that have the IDAA program gait ids
        """
        gaitids = self.compressed_idaa_gaitids()
        # Exclude programs in the Countries TolaLand and Xanadu
        excluded_country_codes = ['TT', 'XU']
        try:
            program = models.Program.objects.filter(gaitid__gaitid__in=gaitids).exclude(country__code__in=excluded_country_codes).distinct()

            if len(gaitids) == 0:
                self.add_discrepancy('gaitid')

            if program.count() == 0:
                return None
            elif program.count() > 1:
                self.add_discrepancy('multiple_programs')
                return program

            return program.first()
        except ValueError:
            # IDAA gait id is invalid (not an int)
            self.add_discrepancy('gaitid')
        except KeyError:
            # IDAA's json response did not include a gait id
            self.add_discrepancy('gaitid')

    def get_country_code(self, country, countrycodes_list):
        for entry in countrycodes_list:
            if entry['fields']['CountryDisplay'] == country or entry['fields']['field_1'] == country:
                country_code_2 = entry['fields']['field_2']
                country_code_3 = entry['fields']['field_3']
                return country_code_2, country_code_3
        return None, None

    def get_idaa_country_object(self, country):
        """
        Returns the IDAA country object from self.msr_country_codes_list

        Params
            country: IDAA country name as a string
        """
        for entry in self.msr_country_codes_list:
            if entry['fields']['CountryDisplay'] == country or entry['fields']['field_1'] == country:
                return entry['fields']
        return None

    def get_idaa_user(self):
        try:
            return models.TolaUser.objects.get(name='IDAA')
        except models.TolaUser.DoesNotExist:
            logger.exception('Could not find IDAA TolaUser')
            return None

    @transaction.atomic
    def update(self, tola_program):
        """
        Updates an existing Tola program with data from IDAA
        """
        program_fields = [
            {'idaa': 'ProgramName', 'tola': 'name'},
            {'idaa': 'id', 'tola': 'external_program_id'},
            {'idaa': 'ProgramStatus', 'tola': 'funding_status'},
            {'idaa': 'ProgramStartDate', 'tola': 'start_date'},
            {'idaa': 'ProgramEndDate', 'tola': 'end_date'}
        ]
        idaa_gaitids = self.compressed_idaa_gaitids()
        program_before_update = tola_program.idaa_logged_fields
        # Boolean to track if the program in TolaData had updates to either the start_date or end_date
        updated_dates = False
        program_updated = False

        for program_field in program_fields:
            idaa_value = self.idaa_program[program_field['idaa']]

            if program_field['idaa'] == 'ProgramStartDate' or program_field['idaa'] == 'ProgramEndDate':
                idaa_value = datetime.datetime.strptime(idaa_value, '%Y-%m-%dT%H:%M:%SZ').date()
            elif program_field['idaa'] == 'ProgramName' and self.multiple_tola_programs:
                # In the case of 1 IDAA program to multiple TolaData programs we do not want to update the program name in TolaData
                continue

            tola_value = getattr(tola_program, program_field['tola'])

            if str(tola_value) != str(idaa_value):
                setattr(tola_program, program_field['tola'], idaa_value)
                program_updated = True

                tola_program.save()

                if isinstance(tola_value, datetime.date):
                    updated_dates = True

        if updated_dates:
            self.valid_tracking_dates(tola_program)

        if 'Sector' in self.idaa_program:
            idaa_sectors = [sector['LookupValue'] for sector in self.idaa_program['Sector']]

            # Get or create sectors then add to tola program
            for sector in idaa_sectors:
                sector_obj, _ = models.IDAASector.objects.get_or_create(sector=sector)

                if sector_obj not in tola_program.idaa_sector.all():
                    tola_program.idaa_sector.add(sector_obj.id)
                    program_updated = True

            # Tola program has more sectors than the idaa program. Need to delete the extra from the Tola program
            if tola_program.idaa_sector.all().count() > len(idaa_sectors):
                for tola_sector in tola_program.idaa_sector.all():
                    if tola_sector.sector not in idaa_sectors:
                        tola_sector.delete()
                        program_updated = True

        if '_x0032_030OutcomeTheme' in self.idaa_program:
            idaa_outcome_themes = self.idaa_program['_x0032_030OutcomeTheme']

            for outcome_theme in idaa_outcome_themes:
                outcome_theme_obj, _ = IDAAOutcomeTheme.objects.get_or_create(name=outcome_theme)

                if outcome_theme_obj not in tola_program.idaa_outcome_theme.all():
                    tola_program.idaa_outcome_theme.add(outcome_theme_obj.id)
                    program_updated = True

            tola_outcome_themes = tola_program.idaa_outcome_theme.all()

            # Tola program has more outcome themes than the idaa program. Need to delete the extra from the Tola program
            if tola_outcome_themes.count() > len(idaa_outcome_themes):
                for tola_outcome_theme in tola_outcome_themes:
                    if tola_outcome_theme.name not in idaa_outcome_themes:
                        tola_outcome_theme.delete()
                        program_updated = True

        for idaa_gaitid in idaa_gaitids:
            gaitid_details = get_gaitid_details(idaa_gaitid, self.msr_gaitid_list)

            gaitid_obj, created = models.GaitID.objects.get_or_create(gaitid=idaa_gaitid, program=tola_program)

            if created:
                program_updated = True

            if 'Donor' in gaitid_details and gaitid_obj.donor != gaitid_details['Donor']:
                gaitid_obj.donor = gaitid_details['Donor']
                program_updated = True

            if 'DonorDept' in gaitid_details and gaitid_obj.donor_dept != gaitid_details['DonorDept']:
                gaitid_obj.donor_dept = gaitid_details['DonorDept']
                program_updated = True

            gaitid_obj.save()

            if 'FundCode' in gaitid_details:
                fund_codes = gaitid_details['FundCode'].split(',')
                for fund_code in fund_codes:
                    try:
                        fundcode_obj, created = models.FundCode.objects.get_or_create(fund_code=fund_code, gaitid=gaitid_obj)

                        if created:
                            program_updated = True
                    except ValueError:
                        logger.exception(f'Recieved invalid fundcode {fund_code}. IDAA program id {self.idaa_program["id"]}')

            else:
                # If FundCode is not in gaitid_details delete any fundcodes attached to the gaitid in TolaData
                for tola_fund_code in gaitid_obj.fundcode_set.all():
                    tola_fund_code.delete()
                    program_updated = True

        # Compare gaitids between Tola and IDAA
        for tola_gaitid in tola_program.gaitid.all():
            # Tola gaitid is not in idaa_gaitids delete the tola gaitid
            if str(tola_gaitid.gaitid) not in idaa_gaitids:
                # Need to delete gaitid
                tola_gaitid.delete()
                program_updated = True

        program_discrepancies = self.get_program_discrepancies()

        # Check valid_tracking_dates for cases where the program has the discrepancy, but the tracking dates were manually updated
        if program_discrepancies and self.valid_tracking_dates(tola_program):
            program_discrepancies.delete()

        if updated_dates:
            subject_line = "Attention: Official program dates were updated in TolaData - Attention: Les dates officielles du programme ont été mises à jour dans TolaData - Atención: Las fechas oficiales del programa fueron actualizadas en TolaData"
            # plain_message shows if the browser/email client does not support html
            plain_message = (
                "Dear TolaData Country Administrator,\n"
                f"The official program dates of {tola_program.name} were updated based on new information from the Identification Assignment Assistant (IDAA). As a result, the Indicator Tracking Period may need to be updated too. Please coordinate with the program team members to review and update the Indicator Tracking Period, if necessary.\n"
                "For instructions on how to perform Country Administrator functions, please visit the TolaData User Guide. https://mercycorpsemea.sharepoint.com/sites/TolaDataUserGuide \n\n"
                "Cher administrateur de pays TolaData,\n"
                f"Les dates officielles du programme {tola_program.name} ont été mises à jour sur la base de nouvelles informations provenant de l'Assistant pour l'Attribution de l'Identification (IDAA). Par conséquent, il se peut que la Période de Suivi des Indicateurs doive également être mise à jour. Veuillez vous coordonner avec les membres de l'équipe du programme pour revoir et mettre à jour la Période de Suivi des Indicateurs, si nécessaire.\n"
                "Pour obtenir des instructions sur la façon d'exécuter les fonctions de l'administrateur de pays, veuillez consulter le Guide de l'Utilisateur de TolaData. https://mercycorpsemea.sharepoint.com/sites/TolaDataUserGuide \n\n"
                "Estimado Administrador de País de TolaData,\n"
                f"Las fechas oficiales del programa {tola_program.name} fueron actualizadas en base a la nueva información del Asistente de Asignación de Identificación (IDAA). Como resultado, el Período de Seguimiento del Indicador puede necesitar ser actualizado también. Por favor, coordine con los miembros del equipo del programa para revisar y actualizar el Período de Seguimiento del Indicador, si es necesario.\n"
                "Para obtener instrucciones sobre cómo realizar las funciones de Administrador del País, por favor visite la Guía del Usuario de TolaData. https://mercycorpsemea.sharepoint.com/sites/TolaDataUserGuide"
            )
            html_message = (
                "<p>Dear TolaData Country Administrator,</p>"
                f"<p>The official program dates of {tola_program.name} were updated based on new information from the Identification Assignment Assistant (IDAA). As a result, the Indicator Tracking Period may need to be updated too. Please coordinate with the program team members to review and update the Indicator Tracking Period, if necessary.</p>"
                "<p>For instructions on how to perform Country Administrator functions, please visit the <a href='https://mercycorpsemea.sharepoint.com/sites/TolaDataUserGuide'>TolaData User Guide.</a></p>"
                "<p style='margin-top:36px'>Cher administrateur de pays TolaData,</p>"
                f"<p>Les dates officielles du programme {tola_program.name} ont été mises à jour sur la base de nouvelles informations provenant de l'Assistant pour l'Attribution de l'Identification (IDAA). Par conséquent, il se peut que la Période de Suivi des Indicateurs doive également être mise à jour. Veuillez vous coordonner avec les membres de l'équipe du programme pour revoir et mettre à jour la Période de Suivi des Indicateurs, si nécessaire.</p>"
                "<p>Pour obtenir des instructions sur la façon d'exécuter les fonctions de l'administrateur de pays, veuillez consulter <a href='https://mercycorpsemea.sharepoint.com/sites/TolaDataUserGuide'>le Guide de l'Utilisateur de TolaData.</a></p>"
                "<p style='margin-top:36px'>Estimado Administrador de País de TolaData,</p>"
                f"<p>Las fechas oficiales del programa {tola_program.name} fueron actualizadas en base a la nueva información del Asistente de Asignación de Identificación (IDAA). Como resultado, el Período de Seguimiento del Indicador puede necesitar ser actualizado también. Por favor, coordine con los miembros del equipo del programa para revisar y actualizar el Período de Seguimiento del Indicador, si es necesario.</p>"
                "<p>Para obtener instrucciones sobre cómo realizar las funciones de Administrador del País, por favor visite <a href='https://mercycorpsemea.sharepoint.com/sites/TolaDataUserGuide'>la Guía del Usuario de TolaData.</a></p>"
            )
            admin_emails = self.get_country_admin_emails(tola_program)
            if len(admin_emails) > 0:
                try:
                    if not settings.SKIP_USER_EMAILS:
                        send_mail(subject_line, plain_message, settings.DEFAULT_FROM_EMAIL, admin_emails, html_message=html_message, fail_silently=False)
                    else:
                        # For QA log the email
                        logger.info(f"To:{admin_emails}\n{subject_line}\n{plain_message}")
                except SMTPException as e:
                    logger.exception(f"Unknown Error When Sending Email for Updated Dates.\nTolaData Program ID: {tola_program.id}\nReciepent List: {admin_emails}\nException: {e}")
            else:
                logger.exception(f"{subject_line}\n{plain_message}\nNo Basic Administrators are assigned to {tola_program.countries}. Please assign a Basic Administrator(s) to this country.")

        if program_updated:
            idaa_user = self.get_idaa_user()
            ProgramAdminAuditLog.updated(tola_program, idaa_user, program_before_update, tola_program.idaa_logged_fields)

        if not self.program_updated:
            self.program_updated = program_updated

    def bulk_update(self):
        for tola_program in self.tola_program:
            self.update(tola_program)

    @transaction.atomic
    def create(self):
        """
        Creates a new program for each JSON program object from IDAA with the following parameters:
        external_program_id, name, funding_status, start_date and end_date.

        Calls method to create reporting_period_start and reporting_period_end.

        Adds sectors and outcome themes to newly created program if present in IDAA.

        Adds country to newly created program:
            Gets list of countries from IDAA ProgramProjectID
            Retrieves the country codes from IDAA CountryCodes
            Finds country in Tola db and adds it to program

        Adds GaitID to Tola GaitID table:
            Retrieves GaitIDs from IDAA ProgramProjectID and creates or retrieves a GaitID in Tola
            Retrieves GaitID entries from IDAA GaitID list
                Retrieves fund codes and donor information from this IDAA GaitID list (if existent)
                    Adds donor information to GaitID in Tola
                    Add fund codes in Tola

        """
        program = self.idaa_program

        # Get IDAA data and create new program
        external_program_id = program['id']
        name = program['ProgramName']
        funding_status = 'Funded'
        start_date = datetime.datetime.strptime(program['ProgramStartDate'], '%Y-%m-%dT%H:%M:%SZ').date()
        end_date = datetime.datetime.strptime(program['ProgramEndDate'], '%Y-%m-%dT%H:%M:%SZ').date()
        new_tola_program, created = models.Program.objects.get_or_create(external_program_id=external_program_id, name=name,
                                                           funding_status=funding_status, start_date=start_date,
                                                           end_date=end_date)

        # Get default reporting dates and add them to newly created program
        reporting_dates = util.get_reporting_dates(new_tola_program)
        new_tola_program.reporting_period_start = reporting_dates['reporting_period_start']
        new_tola_program.reporting_period_end = reporting_dates['reporting_period_end']

        # Get IDAA sectors and add them to programs
        if program['Sector']:
            sectors = [item['LookupValue'] for item in program['Sector']]
            for sector in sectors:
                idaa_sector, _ = models.IDAASector.objects.get_or_create(sector=sector)

                new_tola_program.idaa_sector.add(idaa_sector)

        # Get outcome themes and add them to program
        if '_x0032_030OutcomeTheme' in program:
            outcome_themes = program['_x0032_030OutcomeTheme']
            for outcome_theme in outcome_themes:
                idaa_outcome_theme, _ = IDAAOutcomeTheme.objects.get_or_create(name=outcome_theme)

                new_tola_program.idaa_outcome_theme.add(idaa_outcome_theme)

        # Get IDAA country code from CountryCodes list
        idaa_countries = [country['LookupValue'] for country in self.idaa_program['Country']]
        # Try and find country in Tola
        for idaa_country in idaa_countries:
            country = self.get_tola_country(idaa_country)

            if country:
                new_tola_program.country.add(country)

        new_tola_program.save()

        # Get or create GaitID objects for this program
        idaa_gaitids = self.compressed_idaa_gaitids()

        # Save gaitIDs in GaitID table
        for gaitid in idaa_gaitids:
            gid, created = models.GaitID.objects.get_or_create(gaitid=int(gaitid), program=new_tola_program)
            # Get or create FundCode objects for individual GaitIDs
            for entry in self.msr_gaitid_list:
                if int(str(entry['fields']['GaitID']).split('.')[0]) == int(gaitid):
                    if 'FundCode' in entry['fields']:
                        fundcodes = entry['fields']['FundCode'].split(',')
                        for fundcode in fundcodes:
                            try:
                                fund_code = int(fundcode)
                                models.FundCode.objects.get_or_create(fund_code=fund_code, gaitid=gid)
                            except ValueError:
                                logger.exception(f"Fund code for {name} with gaitid {int(gaitid)} "
                                                 f"has the wrong format: {fundcode}")
                    donor = entry['fields']['Donor'] if 'Donor' in entry['fields'] else None
                    donor_dept = entry['fields']['DonorDept'] if 'DonorDept' in entry['fields'] else None
                    if donor:
                        gid.donor = donor
                    if donor_dept:
                        gid.donor_dept = donor_dept
                    gid.save()

        program_discrepancies = self.get_program_discrepancies()
        
        if program_discrepancies:
            program_discrepancies.delete()

        idaa_user = self.get_idaa_user()
        ProgramAdminAuditLog.created(new_tola_program, idaa_user, new_tola_program.idaa_logged_fields)

        # Email notification
        subject_line = "Attention: A new program was added to TolaData - Attention: Un nouveau programme a été ajouté à TolaData - Atención: Se ha añadido un nuevo programa a TolaData"
        countries = ", ".join(country.country for country in new_tola_program.country.all())
        gaitids = ", ".join(gid for gid in idaa_gaitids)
        fundcode_list = []
        fundcodes = None
        for gid in idaa_gaitids:
            for entry in self.msr_gaitid_list:
                if int(str(entry['fields']['GaitID']).split('.')[0]) == int(gid):
                    if 'FundCode' in entry['fields']:
                        fcs = entry['fields']['FundCode'].split(',')
                        for fc in fcs:
                            fundcode_list.append(fc)
                        fundcodes = ", ".join(f for f in fundcode_list)
                    donor = entry['fields']['Donor'] if 'Donor' in entry['fields'] else ''
                    donor_dept = entry['fields']['DonorDept'] if 'DonorDept' in entry['fields'] else ''
                    if donor and donor_dept:
                        donors = donor + ", " + donor_dept
                    else:
                        donors = donor + "" + donor_dept
        c = {'program_name': name, 'program_start_date': start_date, 'program_end_date': end_date, 'Countries': countries, 'gaitids': gaitids, 'fundcodes': fundcodes, 'donors': donors}
        text_email_template_name = 'workflow/new_program_email_notification.txt'
        html_email_template_name = 'workflow/new_program_email_notification.html'
        text_email = loader.render_to_string(text_email_template_name, c)
        html_email = loader.render_to_string(html_email_template_name, c)
        admin_emails = self.get_country_admin_emails(new_tola_program)
        if len(admin_emails) > 0:
            try:
                if not settings.SKIP_USER_EMAILS:
                    send_mail(subject=subject_line, message=text_email, from_email=settings.DEFAULT_FROM_EMAIL,
                              recipient_list=admin_emails, fail_silently=False, html_message=html_email)
                else:
                    # For QA log the email
                    logger.info(f"To:{admin_emails}\n{subject_line}\n{text_email}")
            except SMTPException as e:
                logger.exception(
                    f"Unknown Error When Sending Email new program creation.\nTolaData Program ID: {new_tola_program.id}\nRecipient List: {admin_emails}\nException: {e}")
        else:
            c['no_basic_admin'] = f"No Basic Administrators are assigned to {countries}. Please assign a Basic Administrator(s) to this country."
            text_email = loader.render_to_string(text_email_template_name, c)
            logger.exception(
                f"{subject_line}\n{text_email}")


    def upload(self):
        # TODO: Before creating or updating need to clean fields
        if not self.validated:
            raise Exception(f"Can not upload program. {self.idaa_program['ProgramName']} is either invalid or the method is_valid() has not been called yet.")

        if self.new_upload:
            self.create()
        else:
            if self.multiple_tola_programs:
                self.bulk_update()
            else:
                self.update(self.tola_program)
