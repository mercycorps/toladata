from workflow.models import ProgramDiscrepancy
from openpyxl.styles.borders import Border, Side
from openpyxl.styles import Alignment, Font
from workflow.program import convert_date
from openpyxl.utils import get_column_letter
from openpyxl import workbook
from datetime import date
from os import path


class DiscrepancyReportTab:
    discrepancies = []
    columns = []
    title = ''
    discrepancy_to_columns = []
    wide_cell_width = 60
    standard_cell_width = 25
    small_cell_width = 15
    column_font = Font(bold=True, size='12')

    @staticmethod
    def comma_separate_list(separate_list):
        try:
            if type(separate_list[0]) is int:
                # Need to convert int to str to use .join
                separate_list = [str(x) for x in separate_list]
        except IndexError:
            pass

        return ','.join(separate_list)

    def format_worksheet(self, worksheet, wide_cells=None, small_cells=None):
        """
        Method for formatting the worksheet
        """
        if wide_cells is None:
            wide_cells = [0, 2]

        if small_cells is None:
            small_cells = [1]

        for index in range(len(self.columns)):
            if index in wide_cells:
                width = self.wide_cell_width
            elif index in small_cells:
                width = self.small_cell_width
            else:
                width = self.standard_cell_width
            
            column_letter = get_column_letter(index + 1)
            worksheet.column_dimensions[column_letter].width = width

        # Add custom font to column headers
        for column in worksheet["1:1"]:
            column.font = self.column_font

    def after_populate_format(self, worksheet):
        """
        Some cells can't be formatted until data is inserted. Override this method in the tab that needs special formatting
        """
        pass

    def create_worksheet(self, wb):
        worksheet = wb.create_sheet(self.title)
        worksheet.title = self.title
        worksheet.append(self.columns)

        self.format_worksheet(worksheet)

    def populate(self, program_discrepancy, worksheet_discrepancies, *args, **kwargs):
        """
        Returns a list to be appended to the worksheet
        """
        idaa_json = program_discrepancy.idaa_json
        reasons = ','.join([ProgramDiscrepancy.DISCREPANCY_REASONS[discrepancy] for discrepancy in worksheet_discrepancies])
        idaa_gaitids = [str(gaitid['LookupValue']).split('.')[0] for gaitid in idaa_json['GaitIDs']]

        if len(idaa_json['Country']) == 0:
            country = ""
        else:
            country = idaa_json['Country']

        try:
            return [
                reasons, idaa_json['id'], idaa_json['ProgramName'], self.comma_separate_list(idaa_gaitids), 
                country, convert_date(idaa_json['ProgramStartDate'], readable=True), convert_date(idaa_json['ProgramEndDate'], readable=True), 
                idaa_json['ProgramStatus']
            ]
        except KeyError:
            # One of the fields to display on the tab is missing from the program
            id = 0

            if 'id' in idaa_json:
                id = idaa_json['id']

            return [f'Error adding program to the report. Discrepancy reasons: {reasons} discrepancy id {program_discrepancy.id}', id]


class IDAAInvalidFieldsTab(DiscrepancyReportTab):
    discrepancies = ["ProgramName", "id", "ProgramStartDate", "ProgramEndDate", "Country", "ProgramStatus", "funded", "gaitid"]
    columns = [
        "Discrepancy Reasons", "IDAA Program ID", "IDAA Program Name", "IDAA Gait IDs", "IDAA Countries", "IDAA Start Date", "IDAA End Date",
        "IDAA Program Status", "Notes"
    ]
    title = "IDAA Program Has Missing Data"
    discrepancy_to_columns = [
        {"discrepancy": "funded", "columns": ['IDAA Program Status']},
        {"discrepancy": "gaitid", "columns": ['IDAA Gait IDs']},
        {"discrepancy": "ProgramName", "columns": ['IDAA Program Name']},
        {"discrepancy": "ID", "columns": ["IDAA Program ID"]},
        {"discrepancy": "ProgramStartDate", "columns": ['IDAA Start Date']},
        {"discrepancy": "ProgramEndDate", "columns": ['IDAA End Date']},
        {"discrepancy": "Country", "columns": ["IDAA Countries"]},
        {"discrepancy": "ProgramStatus", "columns": ['IDAA Program Status']}
    ] 

    def after_populate_format(self, worksheet):
        last_row = worksheet.max_row
        coord = f"A{last_row}"

        worksheet[coord].alignment = Alignment(wrap_text=True)


class MismatchingFieldsTab(DiscrepancyReportTab):
    discrepancies = ["funding_status", "end_date", "start_date", "countries"]
    columns = [
        "Discrepancy Reasons", "IDAA Program ID", "IDAA Program Name", "IDAA Gait IDs", "IDAA Countries", "IDAA Start Date", "IDAA End Date",
        "IDAA Program Status", "Tola Program Name", "Tola Gait IDs", "Tola Countries", "Tola Start Date", "Tola End Date", 
        "Tola Funding Status", "Notes"
    ]
    title = "MisMatching Fields"
    discrepancy_to_columns = [
        {"discrepancy": "funding_status", "columns": ['IDAA Program Status', 'Tola Funding Status']},
        {"discrepancy": "end_date", "columns": ['IDAA End Date', 'Tola End Date']},
        {"discrepancy": "start_date", "columns": ['IDAA Start Date', 'Tola Start Date']},
        {"discrepancy": "countries", "columns": ['IDAA Countries', 'Tola Countries']}
    ]

    def format_worksheet(self, worksheet):
        wide_cells = [0, 2, 8]

        super().format_worksheet(worksheet, wide_cells)

    def after_populate_format(self, worksheet):
        last_row = worksheet.max_row
        coord = f"A{last_row}"

        worksheet[coord].alignment = Alignment(wrap_text=True)

    def populate(self, program_discrepancy, worksheet_discrepancies):
        row = super().populate(program_discrepancy, worksheet_discrepancies)
        tola_program = program_discrepancy.program.first()

        row.extend([
            tola_program.name, self.comma_separate_list(tola_program.gaitids), tola_program.countries, 
            convert_date(str(tola_program.start_date), readable=True), convert_date(str(tola_program.end_date), readable=True), 
            tola_program.funding_status, ''
        ])

        return row


class MultipleProgramsTab(DiscrepancyReportTab):
    discrepancies = ["multiple_programs"]
    columns = ["Tola Program Name", "Tola Gait IDs", "Tola Countries", "IDAA Program Name", "IDAA Program ID", "Notes"]
    title = "IDAA Program to Multiple Tola"

    def format_worksheet(self, worksheet):
        wide_cells = [0, 3]
        small_cells = [4]

        super().format_worksheet(worksheet, wide_cells, small_cells)

    def populate(self, idaa_json, tola_program):
        return [
            tola_program.name, self.comma_separate_list(tola_program.gaitids), tola_program.countries, idaa_json['ProgramName'],
            idaa_json['id'], ''
        ]


class OverviewTab(DiscrepancyReportTab):
    columns = [
        "Tola Program Name", "IDAA Program Name", "IDAA Program ID", "Discrepancies Count", "Worksheets"
    ]
    title = "Discrepancy Report Overview"

    def format_worksheet(self, worksheet):
        wide_cells = [0, 1, 4]
        small_cells = [2, 3]

        super().format_worksheet(worksheet, wide_cells, small_cells)

    def after_populate_format(self, worksheet):
        last_row = worksheet.max_row
        coord = f"E{last_row}"

        worksheet[coord].alignment = Alignment(wrap_text=True)

    def populate(self, program_discrepancy, used_worksheets):
        return [
            program_discrepancy.program.first().name if program_discrepancy.program.count() >= 1 else 'N/A',
            program_discrepancy.idaa_json['ProgramName'], program_discrepancy.idaa_json['id'],
            len(program_discrepancy.discrepancies), self.comma_separate_list(used_worksheets)
        ]


class GenerateDiscrepancyReport:
    file_path = path.join(path.dirname(path.abspath(__file__)), f'discrepancy_report_{date.today().isoformat()}.xlsx')
    _worksheet_mapper = [
        OverviewTab, MultipleProgramsTab, MismatchingFieldsTab, IDAAInvalidFieldsTab
    ]
    discrepancy_highlight = '40 % - Accent2'
    discrepancy_border = Border(left=Side(style='thin', color='fff00000'), 
                                right=Side(style='thin', color='fff00000'), 
                                top=Side(style='thin', color='fff00000'), 
                                bottom=Side(style='thin', color='fff00000'))
    
    def __init__(self):
        self.wb = workbook.Workbook()

        self._create_worksheets()

    def _create_worksheets(self):
        # Delete the default worksheet
        del self.wb['Sheet']

        for worksheet_object in self._worksheet_mapper:
            worksheet_object().create_worksheet(self.wb)

    def discrepancies_to_worksheets(self, discrepancies):
        """
        returns a list of worksheets that a list of discrepancies are shown in
        """
        used_worksheets = set()

        for worksheet_object in self._worksheet_mapper:
            for discrepancy in discrepancies:
                if discrepancy in worksheet_object.discrepancies:
                    used_worksheets.add(worksheet_object.title)

        return list(used_worksheets)


    def get_discrepancy_column_number(self, discrepancies, worksheet_object):
        """
        Returns the column number a discrepancy is located at
        """
        highlight_indexes = []

        for discrepancy in discrepancies:
            for discrepancy_column in worksheet_object.discrepancy_to_columns:
                if discrepancy_column['discrepancy'] == discrepancy:
                    for column in discrepancy_column['columns']:
                        highlight_indexes.append(
                            worksheet_object.columns.index(column) + 1  # Excel coords are not zero indexed
                        )
        
        return highlight_indexes

    def highlight_discrepancies(self, worksheet, discrepancies, worksheet_object):
        """
        Highlights discrepancies on the worksheet
        """
        last_row = worksheet.max_row
        column_indexes = self.get_discrepancy_column_number(discrepancies, worksheet_object)
        
        for column_index in column_indexes:
            column_letter = get_column_letter(column_index)
            coord = f"{column_letter}{last_row}"
            worksheet[coord].style = self.discrepancy_highlight
            worksheet[coord].border = self.discrepancy_border

    def generate(self):
        """
        Method to generate the discrepancy report
        """
        program_discrepancies = ProgramDiscrepancy.objects.all()
        overview_tab = OverviewTab()

        for program_discrepancy in program_discrepancies:
            for worksheet_object in self._worksheet_mapper:
                worksheet_discrepancies = []
                worksheet = self.wb[worksheet_object.title]

                for discrepancy in program_discrepancy.discrepancies:
                    if discrepancy in worksheet_object.discrepancies:
                        worksheet_discrepancies.append(discrepancy)

                if len(worksheet_discrepancies) == 0:
                    continue

                worksheet_tab = worksheet_object()

                if worksheet_object is MultipleProgramsTab:
                    for tola_program in program_discrepancy.program.all():
                        row = worksheet_tab.populate(program_discrepancy.idaa_json, tola_program)

                        worksheet.append(row)
                else:
                    row = worksheet_tab.populate(program_discrepancy, worksheet_discrepancies)

                    worksheet.append(row)

                    self.highlight_discrepancies(worksheet, worksheet_discrepancies, worksheet_object)

                worksheet_tab.after_populate_format(worksheet)

            used_worksheets = self.discrepancies_to_worksheets(program_discrepancy.discrepancies)
            row = overview_tab.populate(program_discrepancy, used_worksheets)
            self.wb[overview_tab.title].append(row)

        self.wb.save(self.file_path)
