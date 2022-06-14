from django.core.exceptions import ValidationError


def validate_fund_code(value):
    fund_code_ranges = [range(30000, 39999), range(70000, 79000), range(90000, 99999)]

    for fund_code_range in fund_code_ranges:
        if value in fund_code_range:
            return True

    # Not sure if this error should be translated. With the automatic program creation this error would only be present on the backend.
    raise ValidationError('Received invalid fund code')