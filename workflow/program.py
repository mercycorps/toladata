from django.db.models.query import QuerySet
from workflow import models
import datetime
import re


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

    if date == '':
        return ''

    if readable:
        try:
            return datetime.datetime.strptime(date, idaa_format).strftime(readable_format)
        except ValueError:
            return datetime.datetime.strptime(date, django_format).strftime(readable_format)

    return datetime.datetime.strptime(date, idaa_format).strftime(django_format)


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

    def create_discrepancies(self):
        """
        Adds the discrepancies to the database
        """
        if self.discrepancy_count > 0:
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

    def __init__(self, idaa_program):
        self.idaa_program = idaa_program
        self._validated = False

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
        return [str(gaitid['LookupValue']).rstrip('.0') for gaitid in self.idaa_program['GaitIDs']]

    def program_is_funded(self):
        """
        Checks that the IDAA program is funded
        """
        funded = self.idaa_program['ProgramStatus'] == self.funded_str

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

        return missing

    def valid_idaa_program(self):
        """
        Validation for idaa programs
        - program has valid gaitid
        - program has no missing fields
        """
        missing_fields = self.missing_fields()
        valid_gaitids = self.valid_gaitids()

        return not missing_fields and valid_gaitids

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
        tola_countries = [country.name for country in self.tola_program.country.all()]
        idaa_countries = set(country.strip() for country in re.split(',|;', self.idaa_program['Country']))
        matching = True

        if len(tola_countries) == 0:
            self.add_discrepancy('countries')
            matching = False
        else:
            for idaa_country in idaa_countries:
                if idaa_country in tola_countries:
                    # Countries matched, remove from tola_countries
                    tola_countries.remove(idaa_country)
                else:
                    self.add_discrepancy('countries')
                    matching = False

        # If tola_countries still has items, then the countries did not fully match
        if len(tola_countries) > 0:
            self.add_discrepancy('countries')
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
            # Non funded programs should'nt show up in the discrepancy report.
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

    def __init__(self, idaa_program, execute=False):
        self.idaa_program = idaa_program
        self.execute = execute

        super().__init__(idaa_program)

        self.tola_program = self.get_tola_programs()

    @property
    def new_upload(self):
        return not self.tola_program_exists

    def get_tola_programs(self):
        """
        Queries the Program table for Tola programs that have the IDAA program gait ids
        """
        gaitids = self.compressed_idaa_gaitids()
        try:
            return models.Program.objects.get(gaitid__gaitid__in=gaitids)
        except models.Program.DoesNotExist:
            # Program does not exist in Tola - this is a new upload
            return None
        except models.Program.MultipleObjectsReturned:
            # Multiple Tola programs returned. Add the multiple_programs discrepancy since it would be impossible to know which Tola program needs validated
            self.add_discrepancy('multiple_programs')
            return models.Program.objects.filter(gaitid__gaitid__in=gaitids)
        except ValueError:
            # IDAA gait id is invalid (not an int)
            self.add_discrepancy('gaitid')
        except KeyError:
            # IDAA's json response did not include a gait id
            self.add_discrepancy('gaitid')

    def update(self):
        pass

    def create(self):
        pass

    def upload(self):
        # TODO: Before creating or updating need to clean fields
        if not self.validated:
            raise Exception(f"Can not upload program. {self.idaa_program['ProgramName']} is either invalid or the method is_valid() has not been called yet.")

        if self.new_upload:
            self.create()
        else:
            self.update()
