
# Program Period Modal Readme

## Fields

- Indicator tracking start date
- Indicator tracking end date

## Validations

### Front end error messages

- You must enter values for the indicator tracking period start date before saving.
- You must enter values for the indicator tracking period end date before saving.
- The end date must come after the start date.
- The indicator tracking start date must be later than or equal to the IDAA start date.
- The indicator tracking end date must be earlier than or equal to the IDAA end date.

### Back end error messages

- Reason for change is required
- Reporting period must start on the first of the month
- Reporting period start date cannot be changed while time-aware periodic targets are in place
- Reporting period must end on the last day of the month
- Reporting period must end after the start of the last target period
- Reporting period must start before reporting period ends
- You must select a reporting period end date

### Actions
- Save changes
- Cancel changes