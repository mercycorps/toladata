
import openpyxl
import string
import re
import os
import json
from datetime import datetime
from openpyxl.comments import Comment
from openpyxl.styles import PatternFill, Alignment, Protection, Font, NamedStyle, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin, AccessMixin
from django.utils.translation import gettext
from django.http import HttpResponse, JsonResponse
from django.views import View
from django.views.decorators.http import require_POST, require_GET

from indicators.models import Indicator, Level, LevelTier, Sector, BulkIndicatorImportFile
from workflow.models import Program
from workflow.serializers_new import BulkImportSerializer, BulkImportIndicatorSerializer
from tola.l10n_utils import str_without_diacritics
from tola_management.permissions import user_has_program_roles

VALIDATION_KEY_UOM_TYPE = 'uom_type_validation'
VALIDATION_KEY_DIR_CHANGE = 'dir_change_validation'
VALIDATION_KEY_TARGET_FREQ = 'target_frequency_validation'
VALIDATION_KEY_SECTOR = 'sector_validation'

COLUMNS = [
    {'name': 'Level', 'required': True, 'field_name': 'level'},
    {'name': 'No.', 'required': False, 'field_name': 'number'},
    {'name': 'Indicator', 'required': True, 'field_name': 'name'},
    {'name': 'Sector', 'required': False, 'field_name': 'sector',
     'validation': VALIDATION_KEY_SECTOR},
    {'name': 'Source', 'required': False, 'field_name': 'source'},
    {'name': 'Definition', 'required': False, 'field_name': 'definition'},
    {'name': 'Rationale or justification for indicator', 'required': False, 'field_name': 'justification'},
    {'name': 'Unit of measure', 'required': True, 'field_name': 'unit_of_measure'},
    # Note:  this lone string is being translated here because it's not the standard name for the field.
    # Translators:  Column header for the column that specifies whether the data in the row is expressed
    # as a number or a percent
    {'name': gettext('Number (#) or percentage (%)'), 'required': True, 'field_name': 'unit_of_measure_type',
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
TEMPLATE_SHEET_NAME = 'Import indicators'
HIDDEN_SHEET_NAME = 'Hidden'

FIRST_USED_COLUMN = 2
DATA_START_ROW = 7
PROGRAM_NAME_ROW = 2

ERROR_MISMATCHED_PROGRAM = 100
ERROR_NO_NEW_INDICATORS = 101
ERROR_UNDETERMINED_LEVEL = 102  # When the first level header row is missing and the level hasnt' been set
ERROR_TEMPLATE_NOT_FOUND = 103
ERROR_MISMATCHED_TIERS = 104
ERROR_INDICATOR_DATA_NOT_FOUND = 105
ERROR_INVALID_LEVEL_HEADER = 200  # When the level header doesn't contain an identifiable level
ERROR_MALFORMED_INDICATOR = 201

EMPTY_CHOICE = '---------'

TITLE_STYLE = 'title_style'
REQUIRED_HEADER_STYLE = 'required_header_style'
OPTIONAL_HEADER_STYLE = 'optional_header_style'
LEVEL_HEADER_STYLE = 'level_header_style'
PROTECTED_INDICATOR_STYLE = 'protected_indicator_style'
UNPROTECTED_INDICATOR_STYLE = 'unprotected_indicator_style'


class BulkImportIndicatorsView(LoginRequiredMixin, UserPassesTestMixin, AccessMixin, View):
    """Returns bulk import .xlsx file"""
    redirect_field_name = None

    first_used_column = FIRST_USED_COLUMN
    data_start_row = DATA_START_ROW
    program_name_row = PROGRAM_NAME_ROW

    GRAY_LIGHTEST = 'FFF5F5F5'
    GRAY_LIGHTER = 'FFDBDCDE'
    GRAY_DARK = 'FF54585A'

    default_border = Side(border_style='thin', color=GRAY_LIGHTER)

    title_style = NamedStyle(TITLE_STYLE)
    title_style.font = Font(name='Calibri', size=18)
    title_style.protection = Protection(locked=True)

    required_header_style = NamedStyle(REQUIRED_HEADER_STYLE)
    required_header_style.font = Font(name='Calibri', size=11, color='FFFFFFFF')
    required_header_style.fill = PatternFill('solid', fgColor='00000000')
    required_header_style.protection = Protection(locked=True)
    required_header_style.border = Border(
        left=default_border, right=default_border, top=default_border, bottom=default_border)

    optional_header_style = NamedStyle(OPTIONAL_HEADER_STYLE)
    optional_header_style.font = Font(name='Calibri', size=11, color='00000000')
    optional_header_style.fill = PatternFill('solid', fgColor=GRAY_LIGHTEST)
    optional_header_style.protection = Protection(locked=False)
    optional_header_style.border = Border(
        left=default_border, right=default_border, top=default_border, bottom=default_border)

    level_header_style = NamedStyle(LEVEL_HEADER_STYLE)
    level_header_style.fill = PatternFill('solid', fgColor=GRAY_LIGHTER)
    level_header_style.font = Font(name='Calibri', size=11)
    level_header_style.protection = Protection(locked=True)

    protected_indicator_style = NamedStyle(PROTECTED_INDICATOR_STYLE)
    protected_indicator_style.fill = PatternFill('solid', fgColor=GRAY_LIGHTEST)
    protected_indicator_style.font = Font(name='Calibri', size=11, color=GRAY_DARK)
    protected_indicator_style.border = Border(
        left=default_border, right=default_border, top=default_border, bottom=default_border)
    protected_indicator_style.alignment = Alignment(vertical='top', wrap_text=True)
    protected_indicator_style.protection = Protection(locked=True)

    unprotected_indicator_style = NamedStyle(UNPROTECTED_INDICATOR_STYLE)
    unprotected_indicator_style.font = Font(name='Calibri', size=11)
    unprotected_indicator_style.alignment = Alignment(vertical='top', wrap_text=True)
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

        leveltiers_in_db = sorted([gettext(tier.name) for tier in LevelTier.objects.filter(program=program)])
        request_leveltier_names = sorted(request.GET.keys())
        if leveltiers_in_db != request_leveltier_names:
            return JsonResponse({'error_code': ERROR_MISMATCHED_TIERS}, status=400)

        wb = openpyxl.load_workbook(filename=BulkIndicatorImportFile.get_file_path(BASE_TEMPLATE_NAME))
        ws = wb.worksheets[0]
        hidden_ws = wb.get_sheet_by_name('Hidden')

        # Create data validations
        reverse_field_name_map = {
            'unit_of_measure_type': {str(name): value for value, name in Indicator.UNIT_OF_MEASURE_TYPES},
            'direction_of_change':  {str(name): value for value, name in Indicator.DIRECTION_OF_CHANGE},
            'target_frequency': {str(name): value for value, name in Indicator.TARGET_FREQUENCIES}
        }

        validation_map = {}
        uom_type_options = list(reverse_field_name_map['unit_of_measure_type'].keys())
        uom_type_validation = DataValidation(
            type="list", formula1=f'"{",".join(uom_type_options)}"', allow_blank=False)
        validation_map[VALIDATION_KEY_UOM_TYPE] = uom_type_validation

        dir_change_options = list(reverse_field_name_map['direction_of_change'].keys())
        dir_change_validation = DataValidation(
            type="list", formula1=f'"{",".join(dir_change_options)}"', allow_blank=True)
        validation_map[VALIDATION_KEY_DIR_CHANGE] = dir_change_validation

        target_freq_options = list(reverse_field_name_map['target_frequency'].keys())
        target_freq_validation = DataValidation(
            type="list", formula1=f'"{",".join(target_freq_options)}"', allow_blank=False)
        validation_map[VALIDATION_KEY_TARGET_FREQ] = target_freq_validation

        # Can't do sector the same way as the others because there are too many.  There is a 256 char limit
        # on putting options directly into the validation config.  Instead, the options will be referenced
        # from a hidden sheet.
        sector_options = [EMPTY_CHOICE] + sorted(
            [gettext(sector.sector) for sector in Sector.objects.all()],
            key=lambda choice: str_without_diacritics(choice))
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
        ws.cell(2, self.first_used_column).style = TITLE_STYLE
        # Translators: Instructions provided as part of an Excel template that allows users to upload Indicators
        instructions = gettext(
            "INSTRUCTIONS\n"
            "1. Indicator rows are provided for each result level. You can delete indicator rows you do not need. You can also leave them empty and they will be ignored.\n"
            "2. Required columns are highlighted with a dark background and an asterisk (*) in the header row. Unrequired columns can be left empty but cannot be deleted.\n"
            "3. When you are done, upload the template to the results framework or program page."
        )

        ws.cell(4, self.first_used_column).value = instructions
        ws.cell(4, self.first_used_column).fill = PatternFill('solid', fgColor=self.GRAY_LIGHTER)
        # Translators: Section header of an Excel template that allows users to upload Indicators.  This section is where users will add their own information.
        ws.cell(5, self.first_used_column).value = gettext("Enter indicators")

        for i, header in enumerate(COLUMNS):
            column_index = i+2
            header_cell = ws.cell(6, column_index)
            if header['required']:
                header_cell.value = gettext(header['name']) + "*"
                header_cell.style = REQUIRED_HEADER_STYLE
            else:
                header_cell.value = gettext(header['name'])
                header_cell.style = OPTIONAL_HEADER_STYLE

            # Add notes to header row cells
            if header['field_name'] != 'comments':
                if header['field_name'] == 'number' and not program.auto_number_indicators:
                    # Translators: This is help text for a form field that gets filled in automatically
                    help_text = gettext('This number is automatically generated through the results framework.')
                elif header['field_name'] == 'baseline':
                    # Translators: This is help text for a form field
                    help_text = gettext('Enter a numeric value for the baseline. If a baseline is not yet known '
                                        'or not applicable, enter a zero or type "N/A". The baseline can always '
                                        'be updated at a later point in time.')
                else:
                    help_text = Indicator._meta.get_field(header['field_name']).help_text
                comment = Comment(help_text, '')
                comment.width = 300
                comment.height = 15 + len(help_text) * .5
                header_cell.comment = comment

            if header['field_name'] == 'sector':
                col_width = max(len(option) for option in sector_options)
                ws.column_dimensions[get_column_letter(column_index)].width = col_width
            elif header['field_name'] == 'rationale_for_target':
                ws.column_dimensions[get_column_letter(column_index)].width = 30
            elif 7 < column_index < 15:
                col_width = len(header_cell.value)
                ws.column_dimensions[get_column_letter(column_index)].width = col_width
            elif column_index >= 15:
                col_width = max(len(option) for option in target_freq_options)
                ws.column_dimensions[get_column_letter(column_index)].width = col_width

        # Need to make sure the instructions are covered by merged cells and that cell widths are cacluated
        # after the individual header cells have been styled
        max_line_width = max([len(line) for line in instructions.split('\n')])
        required_width = .8 * max_line_width
        merged_width = 0
        max_merge_col_index = 2
        while merged_width < required_width:
            merged_width += ws.column_dimensions[get_column_letter(max_merge_col_index)].width
            max_merge_col_index += 1
        ws.merge_cells(start_row=4, start_column=2, end_row=4, end_column=max_merge_col_index - 1)

        current_row_index = self.data_start_row
        for level in serialized_levels:
            ws.cell(current_row_index, self.first_used_column)\
                .value = f'{gettext(level["tier_name"])}: {level["level_name"]} ({level["ontology"]})'
            ws.merge_cells(
                start_row=current_row_index,
                start_column=self.first_used_column,
                end_row=current_row_index,
                end_column=last_used_column)
            ws.cell(current_row_index, self.first_used_column).style = LEVEL_HEADER_STYLE
            current_row_index += 1

            for indicator in level['indicator_set']:
                current_column_index = self.first_used_column
                first_indicator_cell = ws.cell(current_row_index, current_column_index)
                first_indicator_cell.value = gettext(level['tier_name'])
                first_indicator_cell.style = PROTECTED_INDICATOR_STYLE
                first_indicator_cell.border = Border(
                    left=None, right=self.default_border, top=self.default_border, bottom=self.default_border)

                current_column_index += 1
                ws.row_dimensions[current_row_index].height = 16
                for column in COLUMNS[1:]:
                    active_cell = ws.cell(current_row_index, current_column_index)
                    if column['field_name'] == 'number':
                        if program.auto_number_indicators:
                            active_cell.value = \
                                level['display_ontology'] + indicator['display_ontology_letter']
                        else:
                            active_cell.value = indicator['number']
                    else:
                        raw_value = indicator.get(column['field_name'], None)
                        # These are potentially translated objects that need to be resolved, but converting None
                        # to a string does results in a cell value of "None" rather than an empty cell.
                        active_cell.value = raw_value if raw_value is None else str(raw_value)
                    active_cell.style = PROTECTED_INDICATOR_STYLE
                    current_column_index += 1
                current_row_index += 1

            letter_index = len(level['indicator_set']) - 1
            empty_row_count = int(request.GET[gettext(level['tier_name'])])
            for i in range(empty_row_count):
                ws.row_dimensions[current_row_index].height = 16
                ws.cell(current_row_index, self.first_used_column).value = gettext(level['tier_name'])
                if program.auto_number_indicators:
                    letter_index += 1
                    i_letter = ''
                    if letter_index < 26:
                        i_letter = string.ascii_lowercase[letter_index]
                    elif letter_index >= 26:
                        i_letter = string.ascii_lowercase[
                            letter_index // 26 - 1] + string.ascii_lowercase[letter_index % 26]
                    ws.cell(current_row_index, self.first_used_column + 1).value = level['display_ontology'] + i_letter

                for col_n, column in enumerate(COLUMNS):
                    active_cell = ws.cell(current_row_index, self.first_used_column + col_n)
                    active_cell.style = UNPROTECTED_INDICATOR_STYLE
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
        ws = wb.get_sheet_by_name(TEMPLATE_SHEET_NAME)

        if ws.cell(self.program_name_row, self.first_used_column).value != program.name:
            return JsonResponse({'error_code': ERROR_MISMATCHED_PROGRAM}, status=400)

        workbook_errors = []
        level_refs = {}
        for level in program.levels.all():
            level_refs[level.name] = level
        current_level = None
        new_indicators_data = []

        reverse_field_name_map = {
            'unit_of_measure_type': {str(name): value for value, name in Indicator.UNIT_OF_MEASURE_TYPES},
            'direction_of_change': {str(name): value for value, name in Indicator.DIRECTION_OF_CHANGE},
            'target_frequency': {str(name): value for value, name in Indicator.TARGET_FREQUENCIES}
        }

        for current_row_index in range(self.data_start_row, ws.max_row):
            first_cell = ws.cell(current_row_index, self.first_used_column)

            # If this is a level header row, parse the level name out of the header string
            # TODO: do we need to compare the ontology to the name?
            # TODO: do we need to check the number if auto-number is on but they use bad or badly sorted numbers?
            # TODO: Check column names and order
            # TODO: if level can't be parsed, highlight level as an error along with it's indicators
            if first_cell.style == LEVEL_HEADER_STYLE:
                matches = re.match(r'^[^:]+:?\s?(.*)\((\d(?:\.\d)+)', first_cell.value)
                if not matches or matches.group(1).strip() not in level_refs:
                    workbook_errors.append({'error_code': ERROR_INVALID_LEVEL_HEADER, 'row': current_row_index})
                    continue
                else:
                    current_level = level_refs[matches.group(1).strip()]

            if self._row_is_empty(ws, current_row_index):
                continue

            # skip indicators that are already in the system
            if ws.cell(current_row_index, self.first_used_column).style == PROTECTED_INDICATOR_STYLE:
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
                elif column['field_name'] in reverse_field_name_map.keys():
                    indicator_data[column['field_name']] =\
                        reverse_field_name_map[column['field_name']][cell_value]
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
