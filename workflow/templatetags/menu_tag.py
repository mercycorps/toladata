from collections import OrderedDict

from django import template
from django.db import models
from django.db.models import Q
from tola.util import getCountry
from indicators.models import Indicator
from workflow.models import Program, Country

register = template.Library()


@register.inclusion_tag('workflow/tags/program_menu.html', takes_context=True)
def program_menu(context):
    request = context['request']
    if request.user.is_authenticated:
        countries = request.user.tola_user.available_countries
        indicator_query = Indicator.objects.filter(
            deleted__isnull=True,
            program=models.OuterRef('pk')
        ).order_by().values('program').annotate(i_count=models.Count('pk')).values('i_count')
        programs = request.user.tola_user.available_programs.annotate(
            indicator_count=models.Subquery(indicator_query[:1], output_field=models.IntegerField())
        ).filter(
            funding_status="Funded",
            indicator_count__gt=0
        ).prefetch_related('country')
    else:
        countries = Country.objects.none()
        programs = Program.objects.none()

    programs_by_country = OrderedDict((country.country, []) for country in countries)

    if request.user.is_authenticated:
        for program in programs:
            for country in program.country.all():
                # a program can be in multiple countries, including a country a user is not privy to
                if country.country in programs_by_country:
                    programs_by_country[country.country].append(program)

    return {
        'programs': programs,
        'countries': countries,
        'programs_by_country': programs_by_country,
    }
