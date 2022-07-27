from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from django.db.models.query import QuerySet
from tola import util
from workflow import models
from tola_management.models import ProgramAdminAuditLog
from indicators.models import IDAAOutcomeTheme
import datetime
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

    def __init__(self, idaa_program, msr_country_codes_list, msr_gaitid_list):
        self.idaa_program = idaa_program
        self._validated = False

        self.msr_country_codes_list = msr_country_codes_list
        self.msr_gaitid_list = msr_gaitid_list

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

    def get_tola_country(self, idaa_country, country_codes_list):
        """
        Attempts to find a matching Tola country for the idaa country
        """
        additional_countries = [
            {
                'idaa_name': 'HQ',
                'country_code': 'HQ'
            },
            {
                'idaa_name': 'Mercy Corps NW',
                'country_code': 'US'
            }
        ]

        for country in additional_countries:
            if idaa_country == country['idaa_name']:
                return models.Country.objects.get(code=country['country_code'])

        country_codes = self.get_country_code(idaa_country, country_codes_list)

        for index, country_code in enumerate(country_codes):
            try:
                return models.Country.objects.get(code=country_code)
            except models.Country.DoesNotExist:
                if index == len(country_codes) - 1:
                    logger.exception(f'IDAA country {idaa_country} not found.')

        return None

    def compressed_idaa_gaitids(self):
        return [clean_idaa_gaitid(gaitid['LookupValue']) for gaitid in self.idaa_program['GaitIDs']]

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

        if missing_fields:
            return False

        valid_gaitids = self.valid_gaitids()
        matching_countries = self.matching_countries()

        return not missing_fields and valid_gaitids and matching_countries

    def matching_dates(self):
        """
        Checks that the values between required fields are the same between Tola and IDAA
        """
        fields = [
            {'idaa': 'ProgramStartDate', 'tola': 'start_date'},
            {'idaa': 'ProgramEndDate', 'tola': 'end_date'}
        ]
        matching = True

        for field in fields:
            tola_value = getattr(self.tola_program, field['tola'])
            idaa_value = convert_date(self.idaa_program[field['idaa']])

            if not str(tola_value) == idaa_value:
                self.add_discrepancy(field['tola'])
                matching = False

        return matching

    def matching_countries(self):
        """
        Checks if the IDAA and Tola programs have the same countries
        """
        tola_program_country_codes = []
        idaa_countries = [country['LookupValue'] for country in self.idaa_program['Country']]
        discrepancy = 'countries' if self.tola_program_exists else 'Country'
        matching = True

        if self.tola_program_exists:
            tola_program_country_codes = [country.code for country in self.tola_program.country.all()]

        if len(tola_program_country_codes) == 0 and self.tola_program_exists:
            self.add_discrepancy(discrepancy)
            matching = False
        else:
            for idaa_country in idaa_countries:
                tola_country_obj = self.get_tola_country(idaa_country, self.msr_country_codes_list)

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
        - program fields match
        - countires match
        """
        matching_fields = self.matching_dates()
        matching_countries = self.matching_countries()

        return matching_fields and matching_countries

    def is_valid(self):
        """
        Method for checking if the program upload is valid. Checks the IDAA program and if possible the Tola program aswell.
        """
        if not self.program_is_funded():
            # Non funded programs shouldn't show up in the discrepancy report.
            # There is a case when a non-funded program can already have discrepancies at this point.
            # Clear all discrepancies just in case.
            self.clear_discrepancies()
            return False

        # These discrepancies can come up while trying to retrieve the Tola program
        if self.has_discrepancy('multiple_programs') or self.has_discrepancy('gaitid'):
            return False

        valid_idaa_program = self.valid_idaa_program()

        # Validate the Tola program if one exists
        if self.tola_program_exists:
            valid_tola_program = self.valid_tola_program()

            self._validated = valid_idaa_program and valid_tola_program

            return valid_idaa_program and valid_tola_program

        self._validated = valid_idaa_program

        return valid_idaa_program


class ProgramUpload(ProgramValidation):

    def __init__(self, idaa_program, msr_country_codes_list, msr_gaitid_list):
        self.idaa_program = idaa_program

        self.msr_country_codes_list = msr_country_codes_list
        self.msr_gaitid_list = msr_gaitid_list

        super().__init__(idaa_program, msr_country_codes_list=msr_country_codes_list, msr_gaitid_list=msr_gaitid_list)

        self.tola_program = self.get_tola_programs()
        self.program_updated = False

    @property
    def new_upload(self):
        return not self.tola_program_exists

    def get_tola_programs(self):
        """
        Queries the Program table for Tola programs that have the IDAA program gait ids
        """
        gaitids = self.compressed_idaa_gaitids()
        try:
            program = models.Program.objects.filter(gaitid__gaitid__in=gaitids).distinct()

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

    def get_idaa_user(self):
        try:
            return models.TolaUser.objects.get(name='IDAA')
        except models.TolaUser.DoesNotExist:
            logger.exception('Could not find IDAA TolaUser')
            return None

    @transaction.atomic
    def update(self):
        """
        Updates an existing Tola program with data from IDAA
        """
        program_updated = False
        program_fields = [
            {'idaa': 'ProgramName', 'tola': 'name'},
            {'idaa': 'id', 'tola': 'external_program_id'},
            {'idaa': 'ProgramStatus', 'tola': 'funding_status'},
            {'idaa': 'ProgramStartDate', 'tola': 'start_date'},
            {'idaa': 'ProgramEndDate', 'tola': 'end_date'}
        ]
        idaa_gaitids = self.compressed_idaa_gaitids()
        # complete_idaa_gaitids = utils.AccessMSR().gaitid_list()
        program_before_update = self.tola_program.idaa_logged_fields

        for program_field in program_fields:
            idaa_value = self.idaa_program[program_field['idaa']]

            if program_field['idaa'] == 'ProgramStartDate' or program_field['idaa'] == 'ProgramEndDate':
                idaa_value = convert_date(idaa_value)

            tola_value = getattr(self.tola_program, program_field['tola'])

            if str(tola_value) != str(idaa_value):
                setattr(self.tola_program, program_field['tola'], idaa_value)
                program_updated = True

                self.tola_program.save()

        if 'Sector' in self.idaa_program:
            idaa_sectors = [sector['LookupValue'] for sector in self.idaa_program['Sector']]

            # Get or create sectors then add to tola program
            for sector in idaa_sectors:
                sector_obj, _ = models.IDAASector.objects.get_or_create(sector=sector)

                if sector_obj not in self.tola_program.idaa_sector.all():
                    self.tola_program.idaa_sector.add(sector_obj.id)
                    program_updated = True

            # Tola program has more sectors than the idaa program. Need to delete the extra from the Tola program
            if self.tola_program.idaa_sector.all().count() > len(idaa_sectors):
                for tola_sector in self.tola_program.idaa_sector.all():
                    if tola_sector.sector not in idaa_sectors:
                        tola_sector.delete()
                        program_updated = True

        if '_x0032_030OutcomeTheme' in self.idaa_program:
            idaa_outcome_themes = self.idaa_program['_x0032_030OutcomeTheme']

            for outcome_theme in idaa_outcome_themes:
                outcome_theme_obj, _ = IDAAOutcomeTheme.objects.get_or_create(name=outcome_theme)

                if outcome_theme_obj not in self.tola_program.idaa_outcome_theme.all():
                    self.tola_program.idaa_outcome_theme.add(outcome_theme_obj.id)
                    program_updated = True

            tola_outcome_themes = self.tola_program.idaa_outcome_theme.all()

            # Tola program has more outcome themes than the idaa program. Need to delete the extra from the Tola program
            if tola_outcome_themes.count() > len(idaa_outcome_themes):
                for tola_outcome_theme in tola_outcome_themes:
                    if tola_outcome_theme.name not in idaa_outcome_themes:
                        tola_outcome_theme.delete()
                        program_updated = True

        idaa_countries = [country['LookupValue'] for country in self.idaa_program['Country']]

        for idaa_country in idaa_countries:
            country = self.get_tola_country(idaa_country, self.msr_country_codes_list)

            if country and country not in self.tola_program.country.all():
                self.tola_program.country.add(country)
                program_updated = True

        for idaa_gaitid in idaa_gaitids:
            gaitid_details = get_gaitid_details(idaa_gaitid, self.msr_gaitid_list)

            gaitid_obj, created = models.GaitID.objects.get_or_create(gaitid=idaa_gaitid, program=self.tola_program)

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

        # Compare gaitids between Tola and IDAA
        for tola_gaitid in self.tola_program.gaitid.all():
            # Tola gaitid is not in idaa_gaitids delete the tola gaitid
            if str(tola_gaitid.gaitid) not in idaa_gaitids:
                # Need to delete gaitid
                tola_gaitid.delete()
                program_updated = True

        program_discrepancies = self.get_program_discrepancies()

        if program_discrepancies:
            program_discrepancies.delete()

        if program_updated:
            idaa_user = self.get_idaa_user()
            ProgramAdminAuditLog.updated(self.tola_program, idaa_user, program_before_update, self.tola_program.idaa_logged_fields)

        self.program_updated = program_updated

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
            country = self.get_tola_country(idaa_country, self.msr_country_codes_list)

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

        idaa_user = self.get_idaa_user()
        ProgramAdminAuditLog.created(new_tola_program, idaa_user, new_tola_program.idaa_logged_fields)

    def upload(self):
        # TODO: Before creating or updating need to clean fields
        if not self.validated:
            raise Exception(f"Can not upload program. {self.idaa_program['ProgramName']} is either invalid or the method is_valid() has not been called yet.")

        if self.new_upload:
            self.create()
        else:
            self.update()
