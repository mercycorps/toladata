import re
import os
from decimal import Decimal
from django.core.management.base import BaseCommand
from datetime import date
import copy


'''
DO NOT DELETE THIS FILE!!!!  CHANGE THIS FILE WITH CAUTION!!!
Technically this can be run as a management command but really it's run through a migration.  If you delete this
file, the migration will break and you will be sad.  

The general idea is to convert the text values in the lop_target field into Decimal values, while preserving
the old text value in the rationale field if it can't be converted.  The extensive output is to document 
what was modified and to confirm that the categories of things beore and after the conversion line up the 
way they are expected to.   

If you run this as a management command you will need both Indicator.lop_target and Indicator.lop_target_old
defined as part of the model.  Technically, you can change any of the code related to the management command
itself, just not any of the code in run_conversion or anything run_conversion calls.    
'''


def run_conversion(apps_obj, schema_editor_obj):
    if apps_obj:
        Indicator = apps_obj.get_model('indicators', model_name='Indicator')
    else:
        from indicators.models import Indicator
    na_values = ['n/a', 'N/A', 'NA', 'None', 'Not define', '-']

    cwd = os.path.abspath(os.path.dirname(__file__))
    filepath = os.path.join(cwd, 'log_convert_lop_to_numeric')
    outfile = open(filepath, 'w')

    # Print the starting profil of all the LoP target values

    pre_categories, post_categories = munge_lops(Indicator.objects.all(), na_values)
    outfile.write('\n==================== Pre-execution counts ===========================\n\n')
    print_categories(pre_categories, na_values, Indicator, outfile)
    outfile.write('\n==================== Post-execution counts ===========================\n\n')
    print_categories(post_categories, na_values, Indicator, outfile, verbose=False)

    # Calculate what the expected final number of integer values should be
    int_should_be = \
        len(pre_categories['int']['values']) + \
        len(pre_categories['has_separator']['values'])
    if len(post_categories['int']['values']) == int_should_be:
        outfile.write('Integer/float counts are as expected\n')
    else:
        outfile.write('Integer/float counts are off!  Exepected final database value of {} (sum of int, percent, has_separator counts) but final value is {}\n' \
            .format(int_should_be, len(post_categories['int']['values'])))

    # Calculate what the expected final number of null values should be
    null_should_be = \
        len(pre_categories['empty_string']['values']) + \
        len(pre_categories['null']['values']) + \
        len(pre_categories['N/A']['values']) + \
        len(pre_categories['other']['values']) + \
        len(pre_categories['small']['values']) + \
        len(pre_categories['zero']['values'])
    if len(post_categories['null']['values']) == null_should_be:
        outfile.write('Null counts are as expected\n')
    else:
        outfile.write('Null counts are off!  Expected final database value of {} (sum of null, N/A, empty strings, and none-of-the-above counts) but final value is {}\n'
            .format(null_should_be, len(post_categories['null']['values'])))

    outfile.close()
# Categorize the lop_target field values and covert to a Decimal field if possible.
def munge_lops(queryset, na_values):

    old_categories = {
        'empty_string': {'values': [], 'label': 'Empty String'},
        'zero': {'values': [], 'label': 'Zero'},
        'null': {'values': [], 'label': 'Null in DB'},
        'N/A': {'values': [], 'label': 'Entered N/A'},
        'int': {'values': [], 'label': 'Integer'},
        'float': {'values': [], 'label': 'Float'},
        'rounded': {'values': [], 'label': 'Rounded'},
        'small': {'values': [], 'label': '<.01'},
        'percent': {'values': [], 'label': 'Percent'},
        'has_separator': {'values': [], 'label': 'Number with comma/space'},
        'other': {'values': [], 'label': 'Other'},
    }
    new_categories = copy.deepcopy(old_categories)

    for indicator in queryset:
        try:
            old_target = indicator.lop_target_old.strip()
        except AttributeError:
            if indicator.lop_target_old is None:
                old_categories['null']['values'].append(indicator.lop_target_old)
                new_categories['null']['values'].append(indicator.lop_target_old)
                continue
            else:
                raise

        # Set the generic text for when a value's text representation is preserved in the rationale field.
        # If rationale text already exists, preserve it.
        rationale_text = '{} UPDATE:  TolaActivity no longer accepts non-numeric or zero values in the Life of Program (LOP) target field.  The original LoP target value was: {}.' \
            .format(date.today(), old_target.encode('utf-8'))
        if indicator.rationale_for_target:
            rationale_text = '[' + rationale_text + '] {}'.format(indicator.rationale_for_target.encode('utf-8'))

        if old_target == '0':
            old_categories['zero']['values'].append(old_target)
            new_categories['null']['values'].append(old_target)
            indicator.lop_target = None
            indicator.rationale_for_target = rationale_text
            indicator.save()
            continue

        try:
            int(old_target)
            indicator.lop_target = old_target
            old_categories['int']['values'].append(old_target)
            new_categories['int']['values'].append(old_target)
            indicator.save()
            continue
        except:
            pass

        try:
            decimal_value = Decimal(old_target)
            if decimal_value < .01:
                old_categories['small']['values'].append(old_target)
                new_categories['null']['values'].append(old_target)
                indicator.lop_target = None
                indicator.rationale_for_target = rationale_text
            else:
                old_categories['float']['values'].append(old_target)
                match = re.search('\.(\d+)', old_target)
                if len(match.group(1)) > 2:
                    new_value = Decimal(old_target).quantize(Decimal('1.00'))
                    new_categories['rounded']['values'].append(
                        'id:{}, {} -> {}'.format(indicator.pk, old_target.encode('utf-8'), new_value))
                    indicator.lop_target = new_value
                    indicator.rationale_for_target = rationale_text
                else:
                    new_categories['float']['values'].append(old_target)
                    indicator.lop_target = indicator.lop_target_old
            indicator.save()
            continue
        except:
            pass

        if old_target == '':
            old_categories['empty_string']['values'].append(old_target)
            new_categories['null']['values'].append(old_target)
            indicator.lop_target = None
        elif old_target in na_values:
            old_categories['N/A']['values'].append(old_target)
            new_categories['null']['values'].append(old_target)
            indicator.lop_target = None
            indicator.rationale_for_target = rationale_text

        elif re.search('^\d+%$', old_target):
            match = re.search('^(\d+)%$', old_target)
            indicator.lop_target = Decimal(match.group(1))
            old_categories['percent']['values'].append(
                'id:{}, {} -> {}'.format(indicator.pk, old_target.encode('utf-8'), Decimal(match.group(1))))
            new_categories['float']['values'].append(old_target)
        elif re.search('^[\d,]+$', old_target) and number_has_separator(old_target):
            new_target = old_target.replace(',', '')
            old_categories['has_separator']['values'].append(
                'id:{}, {} -> {}'.format(indicator.pk, old_target.encode('utf-8'), new_target))
            new_categories['int']['values'].append(old_target)
            indicator.lop_target = Decimal(new_target)
        elif re.search('^[\d\s]+$', old_target) and number_has_separator(old_target, sep=' '):
            new_target = old_target.replace(' ', '')
            old_categories['has_separator']['values'].append(
                'id:{}, {} -> {}'.format(indicator.pk, old_target.encode('utf-8'), new_target))
            new_categories['int']['values'].append(old_target)
            indicator.lop_target = Decimal(new_target)
        else:
            old_categories['other']['values'].append(
                'id:{}, {} -> None'.format(indicator.pk, old_target.encode('utf-8')))
            new_categories['null']['values'].append(old_target)
            indicator.lop_target = None
            indicator.rationale_for_target = rationale_text

        indicator.save()

    return old_categories, new_categories


def print_categories(categories, na_values, Indicator, outfile, verbose=True):
    if verbose:
        for key in ['percent', 'has_separator', 'other']:
            outfile.write('\n+++++++++++++++++++++++++%s+++++++++++++++++++++++++\n\n' % key)
            outfile.write('\n'.join(categories[key]['values']))

            outfile.write('\n+++++++++++++++++++++++++++++++++++++++++++++++++++\n\n')
    categorized_total = sum([len(category['values']) for category in categories.values()])

    outfile.write('categorized sum: {}\n'.format(categorized_total))
    outfile.write('indicator count: {}\n'.format(Indicator.objects.count()))
    outfile.write('Values considered as N/A: {}\n'.format(', '.join(na_values)))
    outfile.write('Count of programs with end dates of < 1 yr ago and unparsable lop_targets:\n')
    outfile.write('Category counts:\n')
    for key, values in categories.items():
        outfile.write('  %s: %s\n' % (categories[key]['label'], len(categories[key]['values'])))


def number_has_separator(target, sep=','):
    # Check if number is separated into groups of three digits, except for the first group, which can
    # have fewer than three.
    pieces = target.split(sep)
    return len(pieces[0]) <= 3 and all([len(val) == 3 for val in pieces[1:]])
