import math
import simplejson
from datetime import datetime, date
from django.core.serializers import serialize
from django import template
from django.db.models import QuerySet
from django.utils.timezone import localdate
from django.utils.translation import ugettext_lazy as _
from django.utils.safestring import mark_safe
from indicators.models import Indicator
from django.conf import settings

register = template.Library()

@register.filter('convert2dateobject')
def convert2dateobject(value):
    try:
        return datetime.strptime(value, '%Y-%m-%d')
    except AttributeError:
        return value
    except Exception:
        return value


@register.filter
def concat_string(value1, value2):
    """
    concatenates two strings together
    Usage: <a href="{{ SOME_LINK|concat_string:object.pk }}">LINK</a>
    """
    return "%s%s" % (value1, value2)


@register.filter('jsonify')
def jsonify(object):
    if isinstance(object, QuerySet):
        return serialize('json', object)
    return simplejson.dumps(object)


@register.filter
def and_only(value1, value2):
    """
    Returns "and" if both values are true.
    Useful inside {% blocktrans %}
    Usage: {{ value1|and_only:value2 }}
    """
    return _("and") if (value1 and value2) else ""


@register.filter
def or_only(value1, value2):
    """
    Returns "or" if either value is true
    Useful inside {% blocktrans %}
    Usage: {{ value1|or_only:value2 }}
    """
    return _("or") if (value1 or value2) else ""


@register.filter
def and_or(value1, value2):
    """
    Returns "or" if either value is true, returns "and" if both values are true
    Useful inside {% blocktrans %}
    Usage: {{ value1|and_or:value2 }}
    """
    result = ""
    if (value1 and value2):
        result = _("and")
    elif (value1 or value2):
        result = _("or")
    return result


@register.filter('symbolize_change')
def symbolize_change(value):
    """
    Returns corresponding math symbol for Direction of change
    Usage:
    {{ indicator.direction_of_change|symbolize_change}}
    """
    if value == Indicator.DIRECTION_OF_CHANGE_NEGATIVE:
        return _("-")

    if value == Indicator.DIRECTION_OF_CHANGE_POSITIVE:
        return _("+")

    return _("N/A")


@register.filter('target_frequency_label')
def target_frequency_label(value):
    """
    Returns corresponding math symbol for Direction of change
    Usage:
    {{ indicator.target_frequency|target_frequency_label}}
    """
    try:
        value = value - 1
        return Indicator.TARGET_FREQUENCIES[value][1]
    except Exception:
        return value


@register.filter('symbolize_measuretype')
def symbolize_measuretype(value):
    """
    Returns corresponding math symbol for Direction of change
    Usage:
    {{ indicator.direction_of_change|symbolize_measuretype}}
    """
    if value == Indicator.NUMBER:
        return _("#")

    if value == Indicator.PERCENTAGE:
        return _("%")

    return ""


@register.filter('hash')
def hash(obj, attr):
    """
    Extracts an attributes's value from the object
    Usage:
    {{ object|getattr:attribute }}
    """
    # try:
    #     return obj.get(attr)
    # except Exception:
    #     return None
    if isinstance(attr, unicode) and hasattr(obj, attr.encode('utf-8')):
        return getattr(obj, attr.encode('utf-8'))
    elif isinstance(attr, str) and hasattr(obj, attr):
        return getattr(obj, attr)
    elif attr in obj:
        return obj.get(attr)
    else:
        return None


@register.filter('js', is_safe=True)
def js(obj):
    """
    Render out JSON to get context data to JS

    Ex.

        <script type="text/javascript">
            var someVar = {{ some_var | js }};
        </script>
    """
    return mark_safe(jsonify(obj))

@register.filter('trailingzero')
def strip_trailing_zero(value):
    """Like builtin "floatformat" but strips trailing zeros from the right (12.5 does not become 12.50)"""
    value = str(value)
    if "." in value:
        return value.rstrip("0").rstrip(".")
    return value


def make_percent(numerator, denominator):
    if denominator == 0 or numerator == 0:
        return 0
    if numerator == denominator:
        return 100
    return max(1, min(99, int(round(float(numerator*100)/denominator))))


@register.inclusion_tag('indicators/tags/target-percent-met.html', takes_context=True)
def target_percent_met(context, percent_met, has_ended):
    margin = Indicator.ONSCOPE_MARGIN
    on_track = None
    if percent_met:
        percent_met = percent_met * 100
        on_track = (1 - margin) * 100 <= percent_met <= (1 + margin) * 100
    return {
        'on_track': on_track,
        'percent_met': percent_met,
        'has_ended': has_ended
    }


@register.inclusion_tag('indicators/tags/gauge-tank.html', takes_context=True)
def gauge_tank(context, metric, has_filters=True):
    labels = {
        'targets_defined' : {
            # Translators: title of a graphic showing indicators with targets
            'title': _('Indicators with targets'),
            # Translators: a label in a graphic. Example: 31% have targets
            'filled_label': _('have targets'),
            # Translators: a label in a graphic. Example: 31% no targets
            'unfilled_label': _('no targets'),
            # Translators: a link that displays a filtered list of indicators which are missing targets
            'cta': _('Indicators missing targets'),
            # Translators: a label in a graphic. Example: 31% have missing targets
            'filter_title': _('have missing targets'),
            # Translators: a link that displays a filtered list of indicators which are missing targets
            'link_title': _('Indicators missing targets'),
            'empty': _('No targets'),
            'help_text': '', # currently unused
            'data_target': 'defined-targets',
        },
        'reported_results' : {
            # Translators: title of a graphic showing indicators with results
            'title': _('Indicators with results'),
            # Translators: a label in a graphic. Example: 31% have results
            'filled_label': _('have results'),
            # Translators: a label in a graphic. Example: 31% no results
            'unfilled_label': _('no results'),
            # Translators: a link that displays a filtered list of indicators which are missing results
            'cta': _('Indicators missing results'),
            # Translators: a label in a graphic. Example: 31% have missing results
            'filter_title': _('have missing results'),
            # Translators: a link that displays a filtered list of indicators which are missing results
            'link_title': _('Indicators missing results'),
            'empty': _('No results'),
            'help_text': '', # currently unused
            'data_target': 'reported-results',
        },
        'results_evidence': {
            # Translators: title of a graphic showing results with evidence
            'title': _('Results with evidence'),
            # Translators: a label in a graphic. Example: 31% have evidence
            'filled_label': _('have evidence'),
            # Translators: a label in a graphic. Example: 31% no evidence
            'unfilled_label': _('no evidence'),
            # Translators: a link that displays a filtered list of indicators which are missing evidence
            'cta': _('Indicators missing evidence'),
            # Translators: a label in a graphic. Example: 31% have missing evidence
            'filter_title': _('have missing evidence'),
            # Translators: a link that displays a filtered list of indicators which are missing evidence
            'link_title': _('Indicators missing evidence'),
            'empty': _('No evidence'),
            'help_text': '', # currently unused
            'data_target': 'has-evidence',
        },
    }
    routes = {
        'targets_defined': 'targets',
        'reported_results': 'results',
        'results_evidence': 'evidence',
    }
    program = context['program']
    filled_value = program.metrics[metric]
    results_count = program.metrics['results_count']
    indicator_count = program.metrics['indicator_count']
    denominator = results_count if metric == 'results_evidence' else indicator_count
    unfilled_value = denominator - filled_value
    filter_title_count = program.metrics['needs_evidence'] if metric == 'results_evidence' else unfilled_value
    #filled_percent = make_percent(filled_value, denominator)
    filled_percent = 0 if denominator == 0 else (100 - make_percent(unfilled_value, denominator))
    
    filter_active = filled_percent != 100 and (
        metric == 'targets_defined' or (
            metric == 'reported_results' and program.metrics.get('targets_defined', False)
        ) or (
            metric == 'results_evidence' and results_count > 0
        )
    )
    # if has_filters is false this is from the homepage, so needs hardcoded url filters based on the program url:
    program_url = False if (has_filters or not filter_active) else '{base}#/{route}/'.format(
            base=program.program_page_url,
            route=routes[metric]
        )
    tick_count = 10
    return {
        'program': program,
        'program_url': program_url,
        'title': labels[metric]['title'],
        'data_target': labels[metric]['data_target'],
        'id_tag': metric,
        'filled_value': filled_value,
        'unfilled_value': unfilled_value,
        'indicator_count': indicator_count,
        'results_count': results_count,
        'filled_percent': filled_percent,
        'unfilled_percent': 100 - filled_percent,
        'filled_label': labels[metric]['filled_label'],
        'unfilled_label': labels[metric]['unfilled_label'],
        'ticks': list(range(1, tick_count+1)),
        'cta': labels[metric]['cta'],
        'filter_title': labels[metric]['filter_title'],
        'has_filters': has_filters,
        'filter_title_count': filter_title_count,
        'empty_label': labels[metric]['empty'],
        'help_text': labels[metric]['help_text'],
        'link_title': labels[metric]['link_title'],
        'filter_active': filter_active,
    }

@register.inclusion_tag('indicators/tags/gauge-tank-small.html', takes_context=True)
def gauge_tank_small(context, metric):
    labels = {
        'targets_defined': {
            # Translators: a label in a graphic. Example: 31% of programs have all targets defined
            'filled_label': _('of programs have all targets defined'),
            # Translators: help text explaining why a certain percentage of indicators are marked "missing targets"
            'help_text': _('Each indicator must have a target frequency selected and targets entered for all periods.'),
        },
        'reported_results': {
            # Translators: a label in a graphic. Example: 31% of indicators have reported results
            'filled_label': _('of indicators have reported results'),
            # Translators: help text explaining why a certain percentage of indicators are marked "missing results"
            'help_text': _('Each indicator must have at least one reported result.'),
        },
        'results_evidence': {
            # Translators: a label in a graphic. Example: 31% of results are backed up with evidence
            'filled_label': _('of results are backed up with evidence'),
            # Translators: help text explaining why a certain percentage of indicators are marked "missing evidence"
            'help_text': _('Each result must include a link to an evidence file or folder.'),
        },
    }
    if metric == 'targets_defined':
        denominator = context['programs'].program_count
        numerator = context['programs'].all_targets_defined_for_all_indicators_count
    if metric == 'reported_results':
        denominator = context['programs'].indicators_count
        numerator = context['programs'].indicators_with_results_count
    if metric == 'results_evidence':
        denominator = context['programs'].results_count
        numerator = context['programs'].results_with_evidence_count
    #if denominator == 0:
    #    filled_percent = 0
    #else:
    #    filled_percent = 100 if numerator == denominator else max(int(round(float(numerator*100)/denominator)), 99)
    filled_percent = make_percent(numerator, denominator)
    unfilled_percent = 100 - filled_percent
    tick_count = 10

    return {
        'unfilled_percent': unfilled_percent,
        'filled_percent': filled_percent,
        'filled_label': labels[metric]['filled_label'],
        'help_text': labels[metric]['help_text'],
        'ticks': list(range(1, tick_count+1)),
    }



@register.inclusion_tag('indicators/tags/gauge-band.html', takes_context=True)
def gauge_band(context, has_filters=True):
    program = context['program']
    scope_counts = program.scope_counts
    denominator = scope_counts['indicator_count']
    results_count = program.metrics['results_count']
    # program url is only used on the home page (which is served up with has_filters = false
    #  because it does not filter in React on the home page, it links to the program page with filter in place)
    program_url = False if has_filters else program.program_page_url
    program_started = localdate() >= program.reporting_period_start

    scope_percents = {
        'high': make_percent(scope_counts['high'], denominator),
        'on_scope': make_percent(scope_counts['on_scope'], denominator),
        'low': make_percent(scope_counts['low'], denominator),
        'nonreporting': make_percent(scope_counts['nonreporting_count'], denominator),
        'reporting': scope_counts['reporting_count']
    }
    return {
        'scope_percents': scope_percents,
        'scope_counts': scope_counts,
        'ticks': list(range(1, 11)),
        'margin': int(Indicator.ONSCOPE_MARGIN * 100),
        'has_filters': has_filters,
        'program_url': program_url,
        'results_count': results_count,
        'program_started': program_started,
    }


@register.inclusion_tag('indicators/tags/program-complete.html', takes_context=True)
def program_complete(context, read_only=False):
    """
    Renders percentage complete with a graphic icon.
    Takes percent_complete as an integer percentage value
    """
    program = context['program']
    return {
        'program.id': program.id,
        'program.start_date': program.start_date,
        'program.end_date': program.end_date,
        'program.reporting_period_start': program.reporting_period_start,
        'program.reporting_period_end': program.reporting_period_end,
        'program.percent_complete': program.percent_complete,
        'read_only': 'true' if read_only else 'false',
    }

@register.inclusion_tag('indicators/tags/program-complete.html', takes_context=True)
def program_complete_program_page(context, read_only=False):
    """
    Renders percentage complete with a graphic icon.
    Takes percent_complete as an integer percentage value
    """
    program = context['program']
    return {
        'program.id': program['pk'],
        'program.start_date': program['start_date'],
        'program.end_date': program['end_date'],
        'program.reporting_period_start': program['reporting_period_start_iso'],
        'program.reporting_period_end': program['reporting_period_end_iso'],
        'program.percent_complete': program['percent_complete'],
        'read_only': 'true' if read_only else 'false',
    }