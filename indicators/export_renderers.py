# -*- coding: utf-8 -*-
import openpyxl
import operator
from django.utils.translation import ugettext
from django.http import HttpResponse

from tola_management.programadmin import get_audit_log_workbook
from workflow.models import Program
from indicators.models import Indicator

EM_DASH = u'–'



class ExcelRendererBase:
    """Set of utility functions for rendering a serialized IPTT into an Excel export"""

    TITLE_START_COLUMN = 3 # 2 rows currently hidden at start, title starts at column C
    TITLE_FONT = openpyxl.styles.Font(size=18)
    HEADER_FONT = openpyxl.styles.Font(bold=True)
    LEVEL_ROW_FONT = openpyxl.styles.Font(bold=True)
    HEADER_FILL = openpyxl.styles.PatternFill('solid', 'EEEEEE')
    LEVEL_ROW_FILL = openpyxl.styles.PatternFill('solid', 'CCCCCC')
    CENTER_ALIGN = openpyxl.styles.Alignment(horizontal='center', vertical='bottom')
    RIGHT_ALIGN = openpyxl.styles.Alignment(horizontal='right', vertical='bottom')
    LEFT_ALIGN_WRAP = openpyxl.styles.Alignment(wrap_text=True)
    INDICATOR_NAME = openpyxl.styles.NamedStyle(
        name="indicator_name",
        font=openpyxl.styles.Font(underline='single'),
        alignment=openpyxl.styles.Alignment(wrap_text=True)
    )
    DISAGGREGATION_CELL = openpyxl.styles.NamedStyle(
        name='disaggregation_cell',
        font=openpyxl.styles.Font(bold=True),
        alignment=openpyxl.styles.Alignment(horizontal='left', vertical='top', wrap_text=True)
    )
    DISAGGREGATION_CATEGORY = openpyxl.styles.NamedStyle(
        name='category_cell',
        alignment=openpyxl.styles.Alignment(horizontal='right', wrap_text=True)
    )

    def create_workbook(self):
        wb = openpyxl.Workbook()
        wb.remove(wb.active)
        title_style = openpyxl.styles.NamedStyle(name='title')
        title_style.font = openpyxl.styles.Font(size=18)
        wb.add_named_style(title_style)
        header_style = openpyxl.styles.NamedStyle(name='header')
        header_style.font = openpyxl.styles.Font(bold=True)
        header_style.alignment = self.CENTER_ALIGN
        header_style.fill = openpyxl.styles.PatternFill('solid', 'EEEEEE')
        wb.add_named_style(header_style)
        level_row_style = openpyxl.styles.NamedStyle(name='level_row')
        level_row_style.font = openpyxl.styles.Font(bold=True)
        level_row_style.fill = openpyxl.styles.PatternFill('solid', 'CCCCCC')
        wb.add_named_style(level_row_style)
        self.wb = wb
        

    @property
    def header_columns(self):
        """accurate list of headers for non-report (non period) data (name and description)"""
        headers = [
            ugettext('Program ID'),
            ugettext('Indicator ID'),
            # Translators: "No." as in abbreviation for Number
            ugettext('No.'),
            ugettext('Indicator')
        ]
        if self.level_column:
            headers += [
                ugettext('Level')
            ]
        if self.uom_column:
            headers += [
                ugettext('Unit of measure'),    
            ]
        if self.change_column:
            headers += [
                # Translators: this is short for "Direction of Change" as in + or -
                ugettext('Change'),
            ]
        if self.cnc_column:
            headers += [
                # Translators: 'C' as in Cumulative and 'NC' as in Non Cumulative
                ugettext('C / NC'),
            ]
        if self.uom_type_column:
            headers += [
                u'# / %',
            ]
        if self.baseline_column:
            headers += [
                ugettext('Baseline')
            ]
        return headers

    def _get_name(self):
        name = {
            1: ugettext('Life of Program (LoP) only'),
            2: ugettext('Midline and endline'),
            3: ugettext('Annual'),
            4: ugettext('Semi-annual'),
            5: ugettext('Tri-annual'),
            # Translators: this is the measure of time (3 months)
            6: ugettext('Quarterly'),
            7: ugettext('Monthly')
        }[self.frequency]
        if name and len(name) > 30:
            name = name[:26] + u'...'
        return name
        
    def add_sheet(self):
        level_rows = self.serializer['level_rows'][self.frequency]
        try:
            level_row = next(level_rows)
        except StopIteration:
            return None
        sheet = self.wb.create_sheet(self._get_name())
        self.add_headers(sheet)
        current_row = 5
        while True:
            current_row = self.add_level_row(level_row, sheet, current_row)
            try:
                level_row = next(level_rows)
            except StopIteration:
                self.set_column_widths(sheet)
                return sheet

    def add_headers(self, sheet):
        current_row = 1
        for title in [self.serializer['report_title'], self.serializer['report_date_range'], self.serializer['program_name']]:
            sheet.merge_cells(
                start_row=current_row, start_column=self.TITLE_START_COLUMN,
                end_row=current_row, end_column=len(self.header_columns)
                )
            cell = sheet.cell(row=current_row, column=self.TITLE_START_COLUMN)
            cell.value = str(title)
            cell.style = 'title'
            current_row += 1
        current_column = 1
        for header in self.header_columns:
            cell = sheet.cell(row=current_row, column=current_column)
            cell.value = str(header)
            cell.style = 'header'
            current_column += 1
        current_column = self.add_period_header(sheet, current_column, self.serializer['lop_period'])
        for period in self.serializer['periods'][self.frequency]:
            current_column = self.add_period_header(
                sheet, current_column, period
            )

    def add_period_header(self, sheet, col, period):
        for header, row in [
                (period.header, 2),
                (period.subheader, 3)
            ]:
            if header:
                if period.tva:
                    sheet.merge_cells(start_row=row, start_column=col, end_row=row, end_column=col+2)
                cell = sheet.cell(row=row, column=col)
                cell.value = str(header)
                cell.font = self.HEADER_FONT
                cell.alignment = self.CENTER_ALIGN
        columns = [
            ugettext('Target'), ugettext('Actual'), str(ugettext('% Met')).title()
        ] if period.tva else [ugettext('Actual'),]
        for col_no, col_header in enumerate(columns):
            cell = sheet.cell(row=4, column=col+col_no)
            cell.value = str(col_header)
            cell.font = self.HEADER_FONT
            cell.fill = self.HEADER_FILL
            cell.alignment = self.RIGHT_ALIGN
        return col + len(columns)

    def add_level_row(self, level_row, sheet, current_row):
        if level_row['level']:
            sheet.cell(row=current_row, column=1).fill = self.LEVEL_ROW_FILL
            sheet.cell(row=current_row, column=2).fill = self.LEVEL_ROW_FILL
            sheet.merge_cells(start_row=current_row, start_column=3, end_row=current_row, end_column=self.column_count)
            cell = sheet.cell(row=current_row, column=3)
            cell.value = str(level_row['level']['name'])
            cell.style = 'level_row'
            current_row += 1
        for indicator in level_row['indicators']:
            current_row = self.add_indicator_data(indicator, sheet, current_row)
        return current_row
        
    def int_cell(self, value):
        if not value and value != 0:
            return None, 'General'
        return int(value), '0'

    def float_cell(self, value):
        if not value and value != 0:
            return None, 'General'
        value = round(float(value), 2)
        if value == int(value):
            return int(value), '0'
        elif value == round(value, 1):
            return round(value, 1), '0.0'
        return value, '0.00'

    def percent_cell(self, value):
        if not value and value != 0:
            return None, 'General'
        value = round(float(value), 4)
        if value == round(value, 2):
            return round(value, 2), '0%'
        elif value == round(value, 3):
            return round(value, 3), '0.0%'
        return value, '0.00%'

    def percent_value_cell(self, value):
        if not value and value != 0:
            return None, 'General'
        value = round(float(value), 2)
        if value == int(value):
            return value/100, '0%'
        else:
            return value/100, '0.00%'

    def str_cell(self, value):
        if not value:
            return None, 'General'
        value = str(value)
        return value, 'General'

    def add_indicator_data(self, indicator, sheet, current_row):
        if indicator['unit_of_measure_type'] == '%':
            values_func = self.percent_value_cell
        else:
            values_func = self.float_cell
        indicator_columns = [
            (indicator['program_pk'], self.int_cell, self.RIGHT_ALIGN, None),
            (indicator['pk'], self.int_cell, self.RIGHT_ALIGN, None),
            (indicator['number'], self.str_cell, self.LEFT_ALIGN_WRAP, None),
            (indicator['name'], self.str_cell, None, self.INDICATOR_NAME)
        ]
        if self.level_column:
            indicator_columns.append(
                (indicator['old_level_name'], self.str_cell, None, None)
            )
        if self.uom_column:
            indicator_columns += [
                (indicator['unit_of_measure'], self.str_cell, None, None),
            ]
        if self.change_column:
            indicator_columns += [
                (indicator['direction_of_change'], self.str_cell, self.CENTER_ALIGN, 'empty_blank'),
            ]
        if self.cnc_column:
            col_value = ugettext("Cumulative") if indicator['is_cumulative'] else ugettext("Not cumulative")
            indicator_columns += [
                (col_value, self.str_cell, None, None),
            ]
        if self.uom_type_column:
            indicator_columns += [
                (indicator['unit_of_measure_type'], self.str_cell, self.CENTER_ALIGN, 'empty_blank'),
            ]
        if self.baseline_column:
            indicator_columns += [
                (indicator['baseline'], values_func, None, None),
                ]
        indicator_columns += [
            (indicator['report_data']['lop_period']['target'], values_func, None, None),
            (indicator['report_data']['lop_period']['actual'], values_func, None, None),
            (indicator['report_data']['lop_period']['met'], self.percent_cell, None, None),
        ]
        for period_header, period_data in zip(self.serializer['periods'][self.frequency],
                                              indicator['report_data']['periods']):
            assert period_header.count == period_data['count']
            if period_header.tva:
                indicator_columns.append(
                    (period_data['target'], values_func, None, None)
                )
            indicator_columns.append(
                (period_data['actual'], values_func, None, None)
            )
            if period_header.tva:
                indicator_columns.append(
                    (period_data['met'], self.percent_cell, None, None)
                )
        for column, (value, format_func, alignment, style) in enumerate(indicator_columns):
            number_format = None
            cell = sheet.cell(row=current_row, column=column+1)
            if style == 'empty_blank':
                style = None
                empty_blank = True
            else:
                empty_blank = False
            try:
                if value is None:
                    value, number_format = None, None
                else:
                    value, number_format = format_func(value)
            except (AttributeError, TypeError, ValueError) as e:
                cell.value = None
                cell.comment = openpyxl.comments.Comment(
                    'error {} with attribute {} on indicator pk {}'.format(
                        e, value, indicator['pk']
                        ), 'Tola System')
                print("comment {}".format(cell.comment))
            else:
                if value is None:
                    value = '' if empty_blank else EM_DASH
                    alignment = self.CENTER_ALIGN
                cell.value = value
                if alignment is not None:
                    cell.alignment = alignment
                if style is not None:
                    cell.style = style
                if number_format is not None:
                    cell.number_format = number_format
        current_row += 1
        for disaggregation in indicator.get('disaggregations', []):
            top_row = current_row
            for label in disaggregation['labels']:
                current_column = len(self.header_columns)+2
                # BASELINE, LOP TARGET, LOP % MET:
                for column in [current_column-2, current_column-1, current_column+1]:
                    sheet.cell(row=current_row, column=column).value = EM_DASH
                    sheet.alignment = self.CENTER_ALIGN
                def label_value_func(cell, period, empty_blank=False):
                    alignment = None
                    value, number_format = values_func(
                        period.get('disaggregations', {}).get(label['pk'], {}).get('actual', None)
                    )
                    if value is None:
                        cell.value = '' if empty_blank else EM_DASH
                        cell.alignment = self.CENTER_ALIGN
                    else:                        
                        cell.value = value
                        if number_format is not None:
                            cell.number_format = number_format
                sheet.merge_cells(start_row=current_row, start_column=4, end_row=current_row, end_column=6)
                cell = sheet.cell(row=current_row, column=4)
                cell.value = label['name']
                cell.style = self.DISAGGREGATION_CATEGORY
                label_value_func(
                    sheet.cell(row=current_row, column=current_column), indicator['report_data']['lop_period']
                )
                current_column += 2
                for period_header, period_data in zip(self.serializer['periods'][self.frequency],
                                                      indicator['report_data']['periods']):
                    if period_header.tva:
                        cell = sheet.cell(row=current_row, column=current_column)
                        cell.value = EM_DASH
                        cell.alignment = self.CENTER_ALIGN
                        current_column += 1
                    label_value_func(sheet.cell(row=current_row, column=current_column), period_data)
                    current_column += 1
                    if period_header.tva:
                        cell = sheet.cell(row=current_row, column=current_column)
                        cell.value = EM_DASH
                        cell.alignment = self.CENTER_ALIGN
                        current_column += 1
                current_row += 1
            sheet.merge_cells(start_row=top_row, start_column=3, end_row=current_row-1, end_column=3)
            cell = sheet.cell(row=top_row, column=3)
            cell.value = disaggregation['name']
            cell.style = self.DISAGGREGATION_CELL
            if not self.disaggregations:
                for row in range(top_row, current_row):
                    sheet.row_dimensions[row].hidden = True
        return current_row

    def set_column_widths(self, sheet):
        widths = [10, 10, 17, 100]
        if self.level_column:
            widths.append(12)
        if self.uom_column:
            widths.append(30)
        if self.change_column:
            widths.append(12)
        if self.cnc_column:
            widths.append(15)
        if self.uom_type_column:
            widths.append(8)
        if self.baseline_column:
            widths.append(20)
        widths += [12]*3
        for period in self.serializer['periods'][self.frequency]:
            widths += [12]*3 if period.tva else [12,]
        for col_no, width in enumerate(widths):
            sheet.column_dimensions[openpyxl.utils.get_column_letter(col_no + 1)].width = width
        sheet.column_dimensions['A'].hidden = True
        sheet.column_dimensions['B'].hidden = True


    def render_to_response(self):
        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = u'attachment; filename="{}"'.format(self.filename)
        self.wb.save(response)
        return response

    @property
    def column_count(self):
        return len(self.header_columns) + 3 + sum(
            [3 if period.tva else 1 for period in self.serializer['periods'][self.frequency]]
            )

    def add_change_log(self, program_pk):
        sheet = self.wb.create_sheet(ugettext('Change log'))
        program = Program.rf_aware_objects.get(pk=program_pk)
        get_audit_log_workbook(sheet, program)


class IPTTExcelRenderer(ExcelRendererBase):
    def __init__(self, serializer, params={}):
        self.filename = serializer.filename
        self.serializer = serializer.data
        self.create_workbook()
        self.columns = params.get('columns', [])
        self.disaggregations = params.get('disaggregations', False)
        has_sheets = False
        for frequency in self.serializer['frequencies']:
            self.frequency = frequency
            if self.add_sheet() is not None:
                has_sheets = True
        if not has_sheets:
            self.add_blank_sheet()

    def add_blank_sheet(self):
        sheet = self.wb.create_sheet(ugettext('No data'))
        sheet['A1'].value = "No data matched the criteria"

    @property
    def level_column(self):
        return not self.serializer['results_framework']

    @property
    def uom_column(self):    
        return 0 not in self.columns

    @property
    def change_column(self):    
        return 1 not in self.columns

    @property
    def cnc_column(self):    
        return 2 not in self.columns

    @property
    def uom_type_column(self):    
        return 3 not in self.columns

    @property
    def baseline_column(self):    
        return 4 not in self.columns

    @property
    def optional_columns_length(self):
        return sum([
            (1 if self.uom_column else 0),
            (1 if self.change_column else 0),
            (1 if self.cnc_column else 0),
            (1 if self.uom_type_column else 0),
            (1 if self.baseline_column else 0),
        ])

class FullReportExcelRenderer(ExcelRendererBase):
    pass

class OneSheetExcelRenderer(ExcelRendererBase):
    pass