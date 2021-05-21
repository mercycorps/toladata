
import openpyxl
import string
import re
import os
import json
from datetime import datetime
from openpyxl.styles import PatternFill, Alignment, Protection, Font, NamedStyle
from openpyxl.worksheet.datavalidation import DataValidation
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin, AccessMixin
from django.utils.translation import gettext
from django.http import HttpResponse, JsonResponse
from django.views import View
from django.views.decorators.http import require_POST, require_GET

from indicators.models import Indicator, Level, Sector, BulkIndicatorImportFile
from workflow.models import Program
from workflow.serializers_new import BulkImportSerializer, BulkImportIndicatorSerializer

from tola_management.permissions import user_has_program_roles

VALIDATION_KEY_UOM_TYPE = 'uom_type_validation'
VALIDATION_KEY_DIR_CHANGE = 'dir_change_validation'
VALIDATION_KEY_TARGET_FREQ = 'target_frequency_validation'
VALIDATION_KEY_SECTOR = 'sector_validation'

COLUMNS = [
    {'name': 'Level', 'required': True, 'field_name': 'level'},
    {'name': 'No.', 'required': True, 'field_name': 'number'},
    {'name': 'Indicator', 'required': True, 'field_name': 'name'},
    {'name': 'Sector', 'required': False, 'field_name': 'sector',
     'validation': VALIDATION_KEY_SECTOR},
    {'name': 'Source', 'required': False, 'field_name': 'source'},
    {'name': 'Definition', 'required': False, 'field_name': 'definition'},
    {'name': 'Rationale or justification for indicator', 'required': False, 'field_name': 'rationale'},
    {'name': 'Unit of measure', 'required': True, 'field_name': 'unit_of_measure'},
    {'name': 'Number (#) or percentage (%)', 'required': True, 'field_name': 'unit_of_measure_type',
     'validation': VALIDATION_KEY_UOM_TYPE},
    {'name': 'Rationale for target', 'required': False, 'field_name': 'rationale_for_target'},
    {'name': 'Baseline', 'required': True, 'field_name': 'baseline'},
    {'name': 'Direction of change', 'required': False, 'field_name': 'direction_of_change',
     'validation': VALIDATION_KEY_DIR_CHANGE},
    {'name': 'Target frequency', 'required': True, 'field_name': 'target_frequency',
     'validation': VALIDATION_KEY_TARGET_FREQ},
    {'name': 'Means of verification / data source', 'required': False, 'field_name': 'means_of_verification'},
    {'name': 'Data collection method', 'required': False, 'field_name': 'data_collection_method'},
    {'name': 'Data points', 'required': False, 'field_name': 'data_points'},
    {'name': 'Responsible person(s) and team', 'required': False, 'field_name': 'responsible_person'},
    {'name': 'Method of analysis', 'required': False, 'field_name': 'method_of_analysis'},
    {'name': 'Information use', 'required': False, 'field_name': 'information_use'},
    {'name': 'Data quality assurance details', 'required': False, 'field_name': 'quality_assurance'},
    {'name': 'Data issues', 'required': False, 'field_name': 'data_issues'},
    {'name': 'Comments', 'required': False, 'field_name': 'comments'}
]

BASE_TEMPLATE_NAME = 'BulkImportTemplate.xlsx'
TEMPLATE_SHEET_NAME = 'Template'
HIDDEN_SHEET_NAME = 'Hidden'

FIRST_USED_COLUMN = 2
DATA_START_ROW = 7
PROGRAM_NAME_ROW = 2

ERROR_MISMATCHED_PROGRAM = 100
ERROR_NO_NEW_INDICATORS = 101
ERROR_UNDETERMINED_LEVEL = 102
ERROR_TEMPLATE_NOT_FOUND = 103
ERROR_MISMATCHED_TIERS = 104
ERROR_INDICATOR_DATA_NOT_FOUND = 105
ERROR_INVALID_LEVEL_HEADER = 200
ERROR_MALFORMED_INDICATOR = 201

EMPTY_CHOICE = '---------'


class BulkImportIndicatorsView(LoginRequiredMixin, UserPassesTestMixin, AccessMixin, View):
    """Returns bulk import .xlsx file"""
    redirect_field_name = None

    first_used_column = FIRST_USED_COLUMN
    data_start_row = DATA_START_ROW
    program_name_row = PROGRAM_NAME_ROW

    reverse_field_name_map = {'unit_of_measure_type': {str(name): value for value, name in Indicator.UNIT_OF_MEASURE_TYPES}}
    reverse_field_name_map['direction_of_change'] = {str(name): value for value, name in Indicator.DIRECTION_OF_CHANGE}
    reverse_field_name_map['target_frequency'] = {str(name): value for value, name in Indicator.TARGET_FREQUENCIES}

    title_style = NamedStyle('title_style')
    title_style.font = Font(name='Calibri', size=18)
    title_style.protection = Protection(locked=True)

    required_header_style = NamedStyle('required_header_style')
    required_header_style.font = Font(name='Calibri', size=11, color='FFFFFFFF')
    required_header_style.fill = PatternFill('solid', fgColor='00000000')
    required_header_style.protection = Protection(locked=True)

    optional_header_style = NamedStyle('optional_header_style')
    optional_header_style.font = Font(name='Calibri', size=11, color='00000000')
    optional_header_style.fill = PatternFill('solid', fgColor='FFF5F5F5')
    optional_header_style.protection = Protection(locked=False)

    level_header_style = NamedStyle('level_header_style')
    level_header_style.fill = PatternFill('solid', fgColor='FFDBDCDE')
    level_header_style.font = Font(name='Calibri', size=11)
    level_header_style.protection = Protection(locked=True)

    protected_indicator_style = NamedStyle('protected_indicator_style')
    protected_indicator_style.font = Font(name='Calibri', size=11)
    protected_indicator_style.alignment = Alignment(vertical='top')
    protected_indicator_style.protection = Protection(locked=True)

    unprotected_indicator_style = NamedStyle('unprotected_indicator_style')
    unprotected_indicator_style.font = Font(name='Calibri', size=11)
    unprotected_indicator_style.alignment = Alignment(vertical='top')
    unprotected_indicator_style.protection = Protection(locked=False)

    def test_func(self):
        program_id = self.request.resolver_match.kwargs.get('program_id')
        return user_has_program_roles(self.request.user, [program_id], ['high']) \
            or self.request.user.is_superuser is True

    def _row_is_empty(self, ws, row_index):
        # Don't test the first two columns (level and number) because they are pre-filled in a blank template
        return not any([ws.cell(row_index, self.first_used_column + 2 + col).value
                        for col in range(len(COLUMNS) - 2)])

    def get(self, request, *args, **kwargs):
        program_id = kwargs['program_id']
        try:
            program = Program.objects.get(pk=program_id)
        except Program.DoesNotExist:
            return JsonResponse({'error_code': ERROR_MISMATCHED_PROGRAM}, status=404)

        levels = Level.objects.filter(program=program).select_related().prefetch_related(
            'indicator_set', 'program', 'parent__program__level_tiers')
        serialized_levels = sorted(BulkImportSerializer(levels, many=True).data, key=lambda level: level['ontology'])

        serialized_leveltier_names = sorted(list(set(level['tier_name'] for level in serialized_levels)))
        request_leveltier_names = sorted(request.GET.keys())
        if serialized_leveltier_names != request_leveltier_names:
            return JsonResponse({'error_code': ERROR_MISMATCHED_TIERS}, status=400)

        wb = openpyxl.load_workbook(filename=BulkIndicatorImportFile.get_file_path(BASE_TEMPLATE_NAME))
        ws = wb.worksheets[0]
        hidden_ws = wb.get_sheet_by_name('Hidden')

        # Handle the edge case where a user submits "0" rows for all tiers.  Not only does the  dropdown creation Data validation is only put on cells that are empty, so if there are no empty rows, we can skip the
        # creation of dropdowns entirely.
        validation_map = {}
        uom_type_options = list(self.reverse_field_name_map['unit_of_measure_type'].keys())
        uom_type_validation = DataValidation(
            type="list", formula1=f'"{",".join(uom_type_options)}"', allow_blank=False)
        validation_map[VALIDATION_KEY_UOM_TYPE] = uom_type_validation

        dir_change_options = list(self.reverse_field_name_map['direction_of_change'].keys())
        dir_change_validation = DataValidation(
            type="list", formula1=f'"{",".join(dir_change_options)}"', allow_blank=True)
        validation_map[VALIDATION_KEY_DIR_CHANGE] = dir_change_validation

        target_freq_options = list(self.reverse_field_name_map['target_frequency'].keys())
        target_freq_validation = DataValidation(
            type="list", formula1=f'"{",".join(target_freq_options)}"', allow_blank=False)
        validation_map[VALIDATION_KEY_TARGET_FREQ] = target_freq_validation

        # Can't do sector the same way as the others because there are too many.  There is a 256 char limit
        # on putting options directly into the validation config.  Instead, the options will be referenced
        # from a hidden sheet.
        sector_options = [EMPTY_CHOICE] + [gettext(sector.sector) for sector in Sector.objects.order_by('sector')]
        sectors_col = 'A'
        sectors_start_row = 2
        sectors_end_row = sectors_start_row + len(sector_options) - 1
        for i, sector in enumerate(sector_options):
            hidden_ws[f'{sectors_col}{i+2}'].value = sector
        sector_range = f'${sectors_col}${sectors_start_row}:${sectors_col}${sectors_end_row}'
        sector_validation = DataValidation(
            type="list", formula1=f'{HIDDEN_SHEET_NAME}!{sector_range}', allow_blank=True)
        validation_map[VALIDATION_KEY_SECTOR] = sector_validation

        for dv in validation_map.values():
            # Translators: Error message shown to a user when they have entered a value that is not in a list of approved values
            dv.error = gettext('Your entry is not in the list')
            # Translators:  Title of a popup box that informs the user they have entered an invalid value
            dv.errorTitle = gettext('Invalid Entry')

        # Spreadsheet loads as corrupted when validation is added to a sheet but no cells are assigned to the
        # validation.
        if sum(int(row_count) for row_count in request.GET.values()) > 0:
            ws.add_data_validation(uom_type_validation)
            ws.add_data_validation(dir_change_validation)
            ws.add_data_validation(target_freq_validation)
            ws.add_data_validation(sector_validation)


        wb.add_named_style(self.title_style)
        wb.add_named_style(self.level_header_style)
        wb.add_named_style(self.protected_indicator_style)
        wb.add_named_style(self.unprotected_indicator_style)
        wb.add_named_style(self.optional_header_style)
        wb.add_named_style(self.required_header_style)

        last_used_column = self.first_used_column + len(COLUMNS) - 1
        # Translators: Heading placed in the cell of a spreadsheet that allows users to upload Indicators in bulk
        ws.cell(1, self.first_used_column).value = gettext("Import indicators")
        ws.cell(self.program_name_row, self.first_used_column).value = program.name
        ws.cell(2, self.first_used_column).style = 'title_style'
        # Translators: Instructions provided as part of an Excel template that allows users to upload Indicators
        ws.cell(4, self.first_used_column).value = gettext(
            "INSTRUCTIONS\n"
            "1. Indicator rows are provided for each result level. You can delete indicator rows you do not need. You can also leave them empty and they will be ignored.\n"
            "2. Required columns are highlighted with a dark background and an asterisk (*) in the header row. Unrequired columns can be left empty but cannot be deleted.\n"
            "3. When you are done, upload the template to the results framework or program page."
        )

        # Translators: Section header of an Excel template that allows users to upload Indicators.  This section is where users will add their own information.
        ws.cell(5, self.first_used_column).value = gettext("Enter indicators")

        for i, header in enumerate(COLUMNS):
            header_cell = ws.cell(6, i+2)
            if header['required']:
                header_cell.value = gettext(header['name']) + "*"
                header_cell.style = 'required_header_style'
            else:
                header_cell.value = gettext(header['name'])
                header_cell.style = 'optional_header_style'

        current_row_index = self.data_start_row
        for level in serialized_levels:
            ws.cell(current_row_index, self.first_used_column)\
                .value = f'{level["tier_name"]}: {level["level_name"]} ({level["ontology"]})'
            ws.merge_cells(
                start_row=current_row_index,
                start_column=self.first_used_column,
                end_row=current_row_index,
                end_column=last_used_column)
            ws.cell(current_row_index, self.first_used_column).style = 'level_header_style'
            current_row_index += 1

            for indicator in level['indicator_set']:
                current_column_index = self.first_used_column
                first_indicator_cell = ws.cell(current_row_index, current_column_index)
                first_indicator_cell.value = level['tier_name']
                first_indicator_cell.style = 'protected_indicator_style'
                first_indicator_cell.font = Font(bold=True)

                current_column_index += 1
                ws.row_dimensions[current_row_index].height = 16
                for column in COLUMNS[1:]:
                    active_cell = ws.cell(current_row_index, current_column_index)
                    # TODO: this will need to accommodate manually numbered fields
                    if column['field_name'] == 'number':
                        active_cell.value = \
                            level['display_ontology'] + indicator['display_ontology_letter']
                        active_cell.style = 'protected_indicator_style'
                        active_cell.font = Font(bold=True)
                    else:
                        raw_value = indicator.get(column['field_name'], None)
                        # These are potentially translated objects that need to be resolved, but converting None
                        # to a string does results in a cell value of "None" rather than an empty cell.
                        active_cell.value = raw_value if raw_value is None else str(raw_value)
                        active_cell.style = 'protected_indicator_style'
                    current_column_index += 1
                current_row_index += 1

            letter_index = len(level['indicator_set'])
            empty_row_count = int(request.GET[level['tier_name']])
            for i in range(empty_row_count):
                ws.row_dimensions[current_row_index].height = 16
                letter_index += 1
                i_letter = ''
                if letter_index < 26:
                    i_letter = string.ascii_lowercase[letter_index]
                elif letter_index >= 26:
                    i_letter = string.ascii_lowercase[
                        letter_index // 26 - 1] + string.ascii_lowercase[letter_index % 26]

                ws.cell(current_row_index, self.first_used_column).value = level['tier_name']
                ws.cell(current_row_index, self.first_used_column + 1).value = level['display_ontology'] + i_letter
                for col_n, column in enumerate(COLUMNS):
                    active_cell = ws.cell(current_row_index, self.first_used_column + col_n)
                    active_cell.style = 'unprotected_indicator_style'
                    if 'validation' in column:
                        validator = validation_map[column['validation']]
                        validator.add(active_cell)
                current_row_index += 1
            current_row_index += 1

        ws.protection.enable()
        filename = "BulkIndicatorImport.xlsx"
        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(filename)
        wb.save(response)
        return response

    def post(self, request, *args, **kwargs):
        program_id = kwargs['program_id']
        program = Program.objects.get(pk=program_id)
        wb = openpyxl.load_workbook(request.FILES['file'])
        ws = wb.get_sheet_by_name('Template')

        if ws.cell(self.program_name_row, self.first_used_column).value != program.name:
            return JsonResponse({'error_code': ERROR_MISMATCHED_PROGRAM}, status=400)

        workbook_errors = []
        level_refs = {}
        for level in program.levels.all():
            level_refs[level.name] = level
        current_level = None
        new_indicators_data = []

        for current_row_index in range(self.data_start_row, ws.max_row):
            first_cell = ws.cell(current_row_index, self.first_used_column)

            # If this is a level header row, parse the level name out of the header string
            # TODO: do we need to compare the ontology to the name?
            if first_cell.style == 'level_header_style':
                matches = re.match(r'^[^:]+:?\s?(.*)\((\d(?:\.\d)+)', first_cell.value)
                if not matches or matches.group(1).strip() not in level_refs:
                    workbook_errors.append({'error_code': ERROR_INVALID_LEVEL_HEADER, 'row': current_row_index})
                    continue
                else:
                    current_level = level_refs[matches.group(1).strip()]

            if self._row_is_empty(ws, current_row_index):
                continue

            # skip indicators that are already in the system
            if ws.cell(current_row_index, self.first_used_column).style == 'protected_indicator_style':
                continue

            # Getting to this point (which shouldn't happen) without a parsed level header means
            # something has gone wrong
            if not current_level:
                workbook_errors.append({'error_code': ERROR_UNDETERMINED_LEVEL})
                continue

            indicator_data = {}
            for i, column in enumerate(COLUMNS[1:]):
                cell_value = ws.cell(current_row_index, self.first_used_column + i + 1).value
                # Get None values out of the way first so we don't have to test for them in the dropdown fields
                if cell_value is None:
                    indicator_data[column['field_name']] = cell_value
                elif column['field_name'] == 'number':
                    if not program.auto_number_indicators:
                        indicator_data[column['field_name']] = cell_value
                # Convert dropdown text into numerical value
                elif column['field_name'] in self.reverse_field_name_map.keys():
                    indicator_data[column['field_name']] =\
                        self.reverse_field_name_map[column['field_name']][cell_value]
                # Convert text in dropdown to sector pk
                elif column['field_name'] == 'sector':
                    if cell_value is None or cell_value in [EMPTY_CHOICE, '', 'None']:
                        indicator_data['sector'] = None
                        continue
                    # TODO: Write Unit Test to see if this works with a bad sector
                    try:
                        sector = Sector.objects.get(sector=cell_value)
                        indicator_data['sector'] = sector.pk
                    except Sector.DoesNotExist:
                        # Set a value that will fail upon deserialization, so the error is attached to the
                        # indicator itself, rather than the workbook
                        indicator_data['sector'] = -1
                else:
                    indicator_data[column['field_name']] = cell_value
            indicator_data['level'] = current_level.id

            new_indicators_data.append(indicator_data)

        if len(new_indicators_data) == 0:
            return JsonResponse({'error_code': ERROR_NO_NEW_INDICATORS}, status=400)

        if len(workbook_errors) > 0:
            return JsonResponse({'errors': workbook_errors}, status=400)

        deserialized_indicators = BulkImportIndicatorSerializer(data=new_indicators_data, many=True)
        deserialized_indicators.is_valid()
        error_count = sum([len(error_dict) for error_dict in deserialized_indicators.errors])

        if error_count > 0:
            try:
                old_file_obj = BulkIndicatorImportFile.objects.get(
                    user=request.user.tola_user,
                    program=program,
                    file_type=BulkIndicatorImportFile.INDICATOR_DATA_TYPE)
                os.remove(old_file_obj.file_path)
                old_file_obj.delete()
            except BulkIndicatorImportFile.DoesNotExist:
                pass

            file_name = f'{datetime.strftime(datetime.now(), "%Y%m%d-%H%M%S")}-{request.user.id}-{program.pk}.xlsx'
            file_obj = BulkIndicatorImportFile.objects.create(
                user=request.user.tola_user,
                program=program,
                file_name=file_name,
                file_type=BulkIndicatorImportFile.INDICATOR_TEMPLATE_TYPE)
            with open(file_obj.file_path, 'w') as fh:
                wb.save(file_obj.file_path)
            return JsonResponse({
                'invalid': error_count,
                'valid': len(deserialized_indicators.errors) - error_count,
                'error_code': ERROR_MALFORMED_INDICATOR
            }, status=400)
        else:
            try:
                old_file_obj = BulkIndicatorImportFile.objects.get(
                    user=request.user.tola_user,
                    program=program,
                    file_type=BulkIndicatorImportFile.INDICATOR_DATA_TYPE)
                os.remove(old_file_obj.file_path)
                old_file_obj.delete()
            except BulkIndicatorImportFile.DoesNotExist:
                pass

            file_name = f'{datetime.strftime(datetime.now(), "%Y%m%d-%H%M%S")}-{request.user.id}-{program.pk}.json'
            file_obj = BulkIndicatorImportFile.objects.create(
                user=request.user.tola_user,
                program=program,
                file_name=file_name,
                file_type=BulkIndicatorImportFile.INDICATOR_DATA_TYPE)
            with open(file_obj.file_path, 'w') as fh:
                fh.write(json.dumps(new_indicators_data))
            return JsonResponse({'message': 'success', 'valid': len(new_indicators_data), 'invalid': 0}, status=200)


@login_required()
@require_POST
def save_bulk_import_data(request, *args, **kwargs):
    try:
        file_entry = BulkIndicatorImportFile.objects.get(
            user=request.user.tola_user,
            program_id=kwargs['program_id'],
            file_type=BulkIndicatorImportFile.INDICATOR_DATA_TYPE)
    except BulkIndicatorImportFile.DoesNotExist:
        return JsonResponse({'error_code': ERROR_INDICATOR_DATA_NOT_FOUND})

    with open(file_entry.file_path, 'r') as fh:
        indicator_data = json.loads(fh.read())

    deserialized_entries = BulkImportIndicatorSerializer(data=indicator_data, many=True)
    validated_flag = deserialized_entries.is_valid()
    if not validated_flag:
        # This shouldn't really happen since the entries have just been validated, but we should check anyway
        return JsonResponse({'error_code': ERROR_INDICATOR_DATA_NOT_FOUND})
    deserialized_entries.save()
    return JsonResponse({'message': 'success'}, status=200)


@login_required()
@require_GET
def get_feedback_bulk_import_template(request, *args, **kwargs):
    try:
        file_entry = BulkIndicatorImportFile.objects.get(
            user=request.user.tola_user,
            program_id=kwargs['program_id'],
            file_type=BulkIndicatorImportFile.INDICATOR_TEMPLATE_TYPE)
    except BulkIndicatorImportFile.DoesNotExist:
        return JsonResponse({'error_code': ERROR_TEMPLATE_NOT_FOUND}, status=400)

    with open(file_entry.file_path, 'rb') as fh:
        template_file = fh.read()
    response = HttpResponse(template_file, content_type='application/ms-excel')
    response['Content-Disposition'] = 'attachment; filename="{}"'.format('Marked-up-template.xlsx')
    return response