# -*- coding: utf-8 -*-
"""
Views specific to the results framework (creating/updating/viewing)
"""

import logging
import copy
import json

from django.core.exceptions import ValidationError
from django.db import transaction
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils import translation
from django.utils.translation import ugettext_lazy as _
from django.utils.decorators import method_decorator
from django.utils.functional import Promise
from django.utils.encoding import force_text
from django.core.serializers.json import DjangoJSONEncoder

from django.views.generic.list import ListView


from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from indicators.serializers import (
    LevelTierSerializer,
    LevelTierTemplateSerializer,
    LevelSerializer,
    IndicatorSerializerMinimal,
    ProgramObjectiveSerializer
)
from indicators.models import Level, LevelTier, LevelTierTemplate, Indicator
from tola_management.models import ProgramAuditLog
from workflow.models import Program
from workflow.serializers import ResultsFrameworkProgramSerializer


logger = logging.getLogger(__name__)


@method_decorator(login_required, name='dispatch')
class ResultsFrameworkBuilder(ListView):
    model = Level
    template_name = 'indicators/results_framework_page.html'
    metrics = False

    def get(self, request, *args, **kwargs):
        # TODO:  put in a try block
        program = Program.objects.prefetch_related('level_tiers').get(pk=int(self.kwargs['program_id']))
        role = request.user.tola_user.program_role(program.id)

        if not role or (role in ['low', 'medium'] and program.level_tiers.count() == 0):
            return HttpResponseRedirect('/')

        tiers = LevelTier.objects.filter(program=program)
        try:
            custom_tiers = LevelTierTemplate.objects.get(program=program)
        except LevelTierTemplate.DoesNotExist:
            custom_tiers = None
        levels = Level.objects.filter(program=program)
        # All indicators associated with the program should be passed to the front-end, not just the ones
        # associated with the rf levels.  The front-end uses the overall count to determine whether
        # the program name in the header should be plain text or a link.
        indicators = Indicator.objects.filter(program=program, deleted__isnull=True)

        translated_templates = json.dumps(LevelTier.get_templates(), cls=LazyEncoder)
        old_lang = translation.get_language()
        translation.activate('en')
        untranslated_templates = json.dumps(LevelTier.get_templates(), cls=LazyEncoder)
        translation.activate(old_lang)
        js_context = {
            'program': ResultsFrameworkProgramSerializer(program).data,
            'levels': LevelSerializer(levels, many=True).data,
            'indicators': IndicatorSerializerMinimal(indicators, many=True).data,
            'levelTiers': LevelTierSerializer(tiers, many=True).data,
            'tierTemplates': translated_templates,
            'englishTemplates': untranslated_templates,
            'customTemplates': LevelTierTemplateSerializer(custom_tiers).data,
            'programObjectives': ProgramObjectiveSerializer(program.objective_set.all(), many=True).data,
            'accessLevel': role,
            'usingResultsFramework': program.results_framework,
        }

        context_data = {
            'program': program,
            'indicator_count': indicators.count(),
            'js_context': js_context,
        }
        return render(request, self.template_name, context_data)


class LazyEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, Promise):
            return force_text(obj)
        return super(LazyEncoder, self).default(obj)


# TODO: add security
class LevelViewSet(viewsets.ModelViewSet):

    serializer_class = LevelSerializer
    queryset = Level.objects.all()

    def update(self, request, pk=None):
        instance = self.get_object()
        program = instance.program
        role = request.user.tola_user.program_role(program.id)
        if request.user.is_anonymous or role != 'high':
            return HttpResponseRedirect('/')

        # Pull rationale string outside of model serializer, since not part of model
        rationale_str = request.data.get('rationale', '')
        instance = self.get_object()
        old_level_fields = self.get_object().logged_fields

        with transaction.atomic():
            # update Level

            serializer = self.get_serializer(instance, data=request.data, partial=False)
            serializer.is_valid(raise_exception=True)

            serializer.save()

            # log changes
            new_level_fields = instance.logged_fields

            # only log changes if indicators attached and not just adding assumption text
            has_indicators = instance.indicator_set.exists()
            diff_fields = set(old_level_fields.items()) - set(new_level_fields.items())
            only_added_assumptions = len(diff_fields) == 1 and diff_fields.pop() == ('assumptions', '')

            if has_indicators and not only_added_assumptions:
                ProgramAuditLog.log_result_level_updated(
                    self.request.user,
                    instance,
                    old_level_fields,
                    new_level_fields,
                    rationale_str,
                )

        # DRF stuff
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def destroy(self, request, pk=None):
        instance = self.get_object()
        program = instance.program
        parent = instance.parent

        role = request.user.tola_user.program_role(program.id)
        if request.user.is_anonymous or role != 'high':
            return HttpResponseRedirect('/')

        try:
            with transaction.atomic():
                self.perform_destroy(instance)

                levels_to_shift = Level.objects \
                    .filter(program=program, parent=parent) \
                    .order_by('customsort')
                for i, s_level in enumerate(levels_to_shift):
                    s_level.customsort = i + 1
                    s_level.save()

                all_levels = Level.objects.filter(program=instance.program)

        except Exception as e:
            logger.error(e)
            return JsonResponse({'message': _('Your request could not be processed.')}, status=400)

        return Response(LevelSerializer(all_levels, many=True).data)


@api_view(http_method_names=['POST'])
def insert_new_level(request):
    level_data = copy.copy(request.data)
    program = Program.objects.get(id=request.data['program'])

    role = request.user.tola_user.program_role(program.id)
    if request.user.is_anonymous or role != 'high':
        return HttpResponseRedirect('/')

    # Update new Level data in preparation for saving
    if request.data['parent'] == "root":
        parent = None
    else:
        parent = Level.objects.get(id=request.data['parent'])
    level_data['parent'] = parent
    level_data['program'] = program
    if 'ontology' in request.data:
        del level_data['ontology']
    del level_data['level_depth']

    # First update the customsort values of all Levels that getting pushed down by the new Level.
    # No need to do it if the top tier level is being saved
    if request.data['parent'] != "root":
        levels_to_shift = Level.objects\
            .filter(program=program, parent_id=parent.id, customsort__gte=request.data['customsort'])\
            .order_by('-customsort')
        for s_level in levels_to_shift:
            s_level.customsort += 1
            s_level.save()

    new_level = Level(**level_data)

    try:
        new_level.full_clean()
    except ValidationError as e:
        return Response(e.message_dict, status=400)

    # Now the new level can be saved
    new_level.save()

    # Return all Levels for the program. There shouldn't be so much that it slows things down much.
    # Also return the newly created Level.
    all_data = LevelSerializer(Level.objects.filter(program=program), many=True).data
    return Response({'all_data': all_data, 'new_level': LevelSerializer(new_level).data})


@api_view(http_method_names=['POST'])
def save_leveltiers(request):
    print('post data', request.data['tiers'])
    program = Program.objects.get(id=request.data['program_id'])
    role = request.user.tola_user.program_role(program.id)
    if request.user.is_anonymous or role != 'high':
        return HttpResponseRedirect('/')
    try:
        with transaction.atomic():
            LevelTier.objects.filter(program=program).delete()
            for n, tier in enumerate(request.data['tiers']):
                tier_obj = LevelTier.objects.create(
                    program=program,
                    tier_depth=n+1,
                    name=tier
                )

            tier_obj.save()
    except Exception as e:
        print('error is {}'.format(e))
        logger.error(e)
        return JsonResponse({'message': _('Your request could not be processed.')}, status=400)

    return Response({"message": "success"})


@login_required
@api_view(http_method_names=['POST'])
def reorder_indicators(request):
    program_ids = list({Indicator.objects.get(pk=i['id']).program.id for i in request.data})
    role = request.user.tola_user.program_role(program_ids[0])
    if request.user.is_anonymous or len(program_ids) > 1 or role != 'high':
        return HttpResponseRedirect('/')

    level_order_map = {i['id']: i['level_order'] for i in request.data}
    try:
        with transaction.atomic():
            for indicator in Indicator.objects.filter(id__in=level_order_map.keys()):
                indicator.level_order = level_order_map[indicator.id]
                indicator.save()
    except Exception as e:
        logger.error(e)
        # Translators: Error message when a user request could not be saved to the DB.
        return JsonResponse({'message': _('Your request could not be processed.')}, status=400)

    return Response({"message": "success"})


@login_required
def indicator_list(request, program_id):

    program = Program.objects.get(pk=program_id)
    if not request.user.tola_user.program_role(program.id):
        return JsonResponse({'message': _('Your request could not be processed.')}, status=400)

    filter_name_map = {'levelId': 'level_id', 'indicatorId': 'pk'}
    filters = {filter_name_map[key]: request.GET.get(key) for key in filter_name_map if request.GET.get(key, None)}

    indicators = Indicator.objects.filter(program=program, **filters)

    return JsonResponse(IndicatorSerializerMinimal(indicators, many=True).data, safe=False, status=200)

@api_view(http_method_names=['POST'])
def save_custom_template(request):
    program = Program.objects.get(id=request.data['program_id'])
    role = request.user.tola_user.program_role(program.id)
    if request.user.is_anonymous or role != 'high':
        return HttpResponseRedirect('/')
    if not request.data['tiers']:
        LevelTierTemplate.objects.filter(program=program).delete()
        return JsonResponse({'message': 'update successful'}, status=200)

    try:
        # Replace both the template and the program-associated level tiers, since there is only
        # one form and it does both.  May need to split this later if custom template creation and
        # tierset saving is split.
        with transaction.atomic():
            LevelTierTemplate.objects.filter(program=program).delete()
            LevelTierTemplate.objects.create(
                program=program,
                names=request.data['tiers']
            )

    except Exception:
        logger.exception("Trouble in RF template paradise")
        return JsonResponse({'message': _('Your request could not be processed.')}, status=400)

    new_template = LevelTierTemplateSerializer(LevelTierTemplate.objects.filter(program=program), many=True)
    return JsonResponse(new_template.data, safe=False)

@api_view(http_method_names=['POST'])
def save_custom_tiers(request):
    program = Program.objects.get(id=request.data['program_id'])
    role = request.user.tola_user.program_role(program.id)
    if request.user.is_anonymous or role != 'high':
        return HttpResponseRedirect('/')
    try:
        # Replace both the template and the program-associated level tiers, since there is only
        # one form and it does both.  May need to split this later if custom template creation and
        # tierset saving is split.
        with transaction.atomic():
            LevelTierTemplate.objects.filter(program=program).delete()
            LevelTier.objects.filter(program=program).delete()

            tier_count = len(request.data['tiers'])
            if tier_count != len(set(request.data['tiers'])):
                raise NotImplementedError(_("Result levels must have unique names."))

            if Level.objects.filter(level_depth=tier_count) > 0:
                raise NotImplementedError(_("This level is being used in the results framework."))

            for n, template_tier in enumerate(request.data['tiers']):
                if not template_tier:
                    # Translators:  This is a warning message when users have left an input field blank.
                    raise NotImplementedError(_("Level names should not be blank"))

                LevelTier.objects.create(
                    program=program,
                    tier_depth=n+1,
                    name=template_tier
                )
            LevelTierTemplate.objects.create(
                program=program,
                names=request.data['tiers']
            )

    except NotImplementedError as e:
        logger.exception("Trouble in RF Tier saving paradise")
        return JsonResponse({'message': e.message}, status=400)
    except Exception as e:
        logger.exception("Trouble in RF Tier saving paradise")
        return JsonResponse({'message': _('Your request could not be processed.')}, status=400)

    new_template = LevelTierTemplateSerializer(LevelTierTemplate.objects.filter(program=program), many=True)
    return JsonResponse(new_template.data, safe=False)
