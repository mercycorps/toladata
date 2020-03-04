
"""
Views for indicators and related models (results, periodic targets) as well as indicator summaries (Program page)
"""

import copy
import json
import logging
from datetime import datetime, timedelta
from decimal import Decimal
import uuid
import dateparser
from weasyprint import HTML, CSS

from django.template.defaultfilters import truncatechars
from django.contrib import messages
from django.core import serializers
from django.core.exceptions import PermissionDenied
from django.db import connection, transaction
from django.db.models import (
    Count, Q, Max
)
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, render_to_response, get_object_or_404, reverse
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.utils.translation import gettext as _, ugettext
from django.views.generic import TemplateView
from django.views.generic.detail import View
from django.views.generic.edit import CreateView, DeleteView, UpdateView

from tola.util import group_excluded, usefully_normalize_decimal

from workflow.models import (
    Program
)

from indicators.serializers import (
    IndicatorSerializer,
)
from indicators.views.view_utils import (
    import_indicator,
    generate_periodic_targets,
    dictfetchall
)
from indicators.forms import IndicatorForm, ResultForm, PTFormInputsForm, get_disaggregated_result_formset
from indicators.models import (
    Indicator,
    PeriodicTarget,
    DisaggregationLabel,
    Result,
)
from indicators.queries import ProgramWithMetrics, ResultsIndicator
from indicators import indicator_plan as ip

from tola_management.models import (
    ProgramAuditLog
)
from tola_management.permissions import (
    indicator_pk_adapter,
    indicator_adapter,
    periodic_target_pk_adapter,
    has_indicator_write_access,
    result_pk_adapter,
    has_result_read_access,
    has_result_write_access,
    has_program_read_access,
    verify_program_access_level_of_any_program,
    verify_program_access_level
)



logger = logging.getLogger(__name__)


# INDICATOR VIEWS:

@login_required
@has_indicator_write_access
def periodic_targets_form(request, program):
    """
    Returns a form for the periodic targets sub-section,
    used by the Indicator Form

    For historical reasons, the input is a POST of the whole indicator form sent via ajax
    from which a subset of fields are used to generate the returned template
    """
    if not request.has_write_access:
        raise PermissionDenied

    program = get_object_or_404(Program, pk=program)

    form = PTFormInputsForm(data=request.POST)

    if not form.is_valid():
        return JsonResponse(form.errors)

    event_name = ''
    start_date = ''
    target_frequency_num_periods = 1
    target_frequency_type = form.cleaned_data.get('target_frequency')

    if target_frequency_type in Indicator.REGULAR_TARGET_FREQUENCIES:
        start_date = program.reporting_period_start
        # target_frequency_num_periods = IPTT_ReportView._get_num_periods(
        #     start_date, program.reporting_period_end, target_frequency_type)
        target_frequency_num_periods = len(
            [p for p in PeriodicTarget.generate_for_frequency(
                target_frequency_type)(start_date, program.reporting_period_end)])

    generated_targets = generate_periodic_targets(
        target_frequency_type, start_date, target_frequency_num_periods, event_name)

    dummy_indicator = Indicator(
        target_frequency=target_frequency_type,
        unit_of_measure_type=form.cleaned_data.get('unit_of_measure_type'),
        is_cumulative=False,
    )

    content = render_to_string('indicators/indicatortargets.html', {
        'indicator': dummy_indicator,
        'periodic_targets': generated_targets
    })

    return JsonResponse({
        'content': content,
    })


class PeriodicTargetJsonValidationError(Exception):
    pass


class IndicatorFormMixin:
    model = Indicator
    form_class = IndicatorForm

    def __init__(self):
        self.guidance = None

    def set_form_guidance(self):
        self.guidance = None

    def get_template_names(self):
        return 'indicators/indicator_form_modal.html'

    def form_invalid(self, form):
        return JsonResponse(form.errors, status=400)

    def normalize_periodic_target_client_json_dates(self, pt_json):
        """
        The JSON containing periodic targets sent by the client contains dates as: 'Dec 31, 2018'
        The rest of the code expects them to be: '2018-12-31'
        Also changes all pkids of 0 to None
        """
        pt_json = copy.deepcopy(pt_json)

        for pt in pt_json:
            pk = int(pt.get('id'))
            if pk == 0:
                pk = None

            try:
                start_date = dateparser.parse(pt.get('start_date', None))
                start_date = datetime.strftime(start_date, '%Y-%m-%d')
            except (ValueError, TypeError):
                # raise ValueError("Incorrect data value")
                start_date = None

            try:
                end_date = dateparser.parse(pt.get('end_date', None))
                end_date = datetime.strftime(end_date, '%Y-%m-%d')
            except (ValueError, TypeError):
                # raise ValueError("Incorrect data value")
                end_date = None

            pt['id'] = pk
            pt['start_date'] = start_date
            pt['end_date'] = end_date
            pt['target'] = pt['target'].replace(',', '.')

        return pt_json

    def validate_periodic_target_json_from_client(self, normalized_pt_json, program, target_frequency):
        """
        The client sends the full definition of all periodic targets in JSON
        In the past, the server has just accepted it as gospel
        Instead, do some basic validation to confirm what the client is telling the server is sane

        Takes the client JSON, already deserialized and having the dates and pkid normalized as input.
        """
        # Clients send nothing on LOP only
        if target_frequency == Indicator.LOP:
            return

        # Are all target values >= 0?
        for pt in normalized_pt_json:
            try:
                if Decimal(pt['target']).as_tuple()[0] == 1:
                    raise PeriodicTargetJsonValidationError('Target value must be >= 0, found %d' % pt['target'])
            except TypeError:
                pass

        # check that event names exist in the future?
        if target_frequency == Indicator.EVENT:
            return

        if target_frequency == Indicator.MID_END:
            if len(normalized_pt_json) != 2:
                raise PeriodicTargetJsonValidationError(
                    'Midline/Endline periodic target count is not 2 and is instead %d' % len(normalized_pt_json))
            return

        # target_frequency_num_periods = IPTT_ReportView._get_num_periods(program.reporting_period_start,
        #                                                                 program.reporting_period_end,
        #                                                                 target_frequency)

        target_frequency_num_periods = len(
            [p for p in PeriodicTarget.generate_for_frequency(
                target_frequency)(program.reporting_period_start, program.reporting_period_end)])

        generated_targets = generate_periodic_targets(target_frequency,
                                                      program.reporting_period_start,
                                                      target_frequency_num_periods)

        if len(generated_targets) != len(normalized_pt_json):
            raise PeriodicTargetJsonValidationError(
                ("Number of periodic targets sent by client "
                 "does not match excepected number of targets on the server (%d vs %d)") % (
                    len(generated_targets), len(normalized_pt_json)))

        server_period_dates = [(pt['start_date'], pt['end_date']) for pt in generated_targets]
        client_period_dates = [(pt['start_date'], pt['end_date']) for pt in normalized_pt_json]

        if server_period_dates != client_period_dates:
            raise PeriodicTargetJsonValidationError(
                ("Periodic Target start/end dates expected by server "
                 "do not match what was sent by the client: %s vs %s") % (
                    server_period_dates, client_period_dates))

    def _save_success_msg(self, indicator, created=True, level_changed=False):
        """
        Returns the growl of success string for display on the client

        Message can vary depending on
          * Create or update save
          * If new RF levels are in use or not
          * If the new RF level was modified during the save or not
        """
        using_rf = indicator.results_framework

        if not using_rf:
            if created:
                # Translators: success message when an indicator was created
                return _('Success! Indicator created.')
            else:
                # Translators: success message when an indicator was updated
                return _('Success! Indicator updated.')

        # success msg strings
        indicator_number = '{}{}'.format(indicator.level_display_ontology,
                                         indicator.level_order_display) if using_rf else ''
        result_level_display_ontology = '{} {}'.format(indicator.leveltier_name,
                                                       indicator.level_display_ontology) if using_rf else ''

        if created or level_changed:
            # Translators: success message when an indicator was created,
            #  ex. "Indicator 2a was saved and linked to Outcome 2.2"
            return _('Indicator {indicator_number} was saved and linked to {result_level_display_ontology}').format(
                indicator_number=indicator_number,
                result_level_display_ontology=result_level_display_ontology
            )
        else:
            # Translators: success message when indicator was updated ex. "Indicator 2a updated"
            return _('Indicator {indicator_number} updated.').format(indicator_number=indicator_number)


class IndicatorCreate(IndicatorFormMixin, CreateView):

    @method_decorator(login_required)
    @method_decorator(has_indicator_write_access)
    @transaction.atomic
    def dispatch(self, request, *args, **kwargs):
        self.set_form_guidance()
        self.program = Program.objects.get(pk=kwargs['program'])
        self.level_pk = self.request.GET.get('levelId')
        return super(IndicatorCreate, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(IndicatorCreate, self).get_context_data(**kwargs)
        context.update({
            'program': self.program,
            'periodic_targets': [],
            'initial_level_id': self.level_pk,
            'idempotency_key': uuid.uuid4()
        })
        return context

    def get_initial(self):
        return {
            'unit_of_measure_type': Indicator.NUMBER,
            'program': self.program,
        }

    def get_form_kwargs(self):
        kwargs = super(IndicatorCreate, self).get_form_kwargs()
        kwargs.update({
            'request': self.request,
            'program': self.program,
            'level': self.level_pk,
        })
        return kwargs

    def form_valid(self, form, **kwargs):
        indicator = form.save()

        periodic_targets = self.request.POST.get('periodic_targets')

        # Save completed PeriodicTargets to the DB (will be empty u'[]' for LoP)
        if indicator.target_frequency == Indicator.LOP:
            PeriodicTarget.objects.create(
                indicator=indicator,
                period=PeriodicTarget.LOP_PERIOD,
                target=indicator.lop_target,
                create_date=timezone.now(),
            )
        else:
            # now create/update periodic targets
            pt_json = json.loads(periodic_targets)

            normalized_pt_json = self.normalize_periodic_target_client_json_dates(pt_json)

            self.validate_periodic_target_json_from_client(
                normalized_pt_json, indicator.program, indicator.target_frequency
            )

            for i, pt in enumerate(normalized_pt_json):
                values = dict(
                    period=pt.get('period', ''),
                    target=pt.get('target', 0),
                    start_date=pt['start_date'],
                    end_date=pt['end_date'],
                )

                PeriodicTarget.objects.create(
                    indicator=indicator,
                    customsort=i,
                    create_date=timezone.now(),
                    **values
                )

        ProgramAuditLog.log_indicator_created(
            self.request.user,
            indicator,
            'N/A'
        )

        return JsonResponse({
            'success': True,
            'id': indicator.id,
            'save_success_msg': self._save_success_msg(indicator, created=True)
        })


class IndicatorUpdate(IndicatorFormMixin, UpdateView):
    """
    Update and Edit Indicators.
    url: indicator_update/<pk>
    """

    @method_decorator(login_required)
    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    @method_decorator(indicator_pk_adapter(has_indicator_write_access))
    @transaction.atomic
    def dispatch(self, request, *args, **kwargs):
        if request.method == 'GET':
            # If target_frequency is set but not targets are saved then
            # unset target_frequency too.
            indicator = self.get_object()
            reset_indicator_target_frequency(indicator)

        self.set_form_guidance()

        return super(IndicatorUpdate, self).dispatch(request, *args, **kwargs)

    @property
    def _form_title_display_str(self):
        """
        The header of the form when updating - composed here instead of in the template
        such that it can also be used via AJAX
        """
        if self.object.results_framework and self.object.auto_number_indicators:
            if self.object.level_display_ontology:
                return u'{} {} {}{}'.format(
                    self.object.leveltier_name,
                    _('indicator'),
                    self.object.level_display_ontology,
                    self.object.level_order_display,
                )
            else:
                return _('Indicator setup')
        elif self.object.results_framework and self.object.number:
            return u'{} {}'.format(_('indicator'), self.object.number)
        elif self.object.results_framework:
            return _('Indicator setup')
        elif self.object.old_level:
            return u'{} {}'.format(
                str(ugettext(self.object.old_level)),
                str(_('indicator')),
            )
        else:
            return _('Indicator setup')

    @property
    def _form_subtitle_display_str(self):
        return truncatechars(self.object.name, 300)

    def get_context_data(self, **kwargs):
        context = super(IndicatorUpdate, self).get_context_data(**kwargs)
        indicator = self.object
        program = indicator.program

        context['program'] = program

        pts = PeriodicTarget.objects.filter(indicator=indicator) \
            .annotate(num_data=Count('result')).order_by('customsort', 'create_date', 'period')

        ptargets = []
        for pt in pts:
            ptargets.append({
                'id': pt.pk,
                'num_data': pt.num_data,
                'start_date': pt.start_date,
                'end_date': pt.end_date,
                'period': pt.period, # period is deprecated, this should move to .period_name
                'period_name': pt.period_name,
                'target': pt.target
            })

        # if the modal is loaded (not submitted) and the indicator frequency is a periodic
        if self.request.method == 'GET' and indicator.target_frequency in Indicator.REGULAR_TARGET_FREQUENCIES:
            latest_pt_end_date = indicator.periodictargets.aggregate(lastpt=Max('end_date'))['lastpt']

            if latest_pt_end_date is None or latest_pt_end_date == 'None':
                latest_pt_end_date = program.reporting_period_start
            else:
                latest_pt_end_date += timedelta(days=1)

            target_frequency_num_periods = len(
                [p for p in PeriodicTarget.generate_for_frequency(
                    indicator.target_frequency)(latest_pt_end_date, program.reporting_period_end)])
            # target_frequency_num_periods = IPTT_ReportView._get_num_periods(
            #     latest_pt_end_date, program.reporting_period_end, indicator.target_frequency)

            num_existing_targets = pts.count()
            event_name = ''

            generated_targets = generate_periodic_targets(
                indicator.target_frequency, latest_pt_end_date, target_frequency_num_periods, event_name,
                num_existing_targets)

            # combine the list of existing periodic_targets with the newly generated placeholder for missing targets
            ptargets += generated_targets

        context['periodic_targets'] = ptargets

        # redirect user to certain tabs of the form given GET params
        if self.request.GET.get('targetsactive') == 'true':
            context['targetsactive'] = True

        context['readonly'] = not self.request.has_write_access

        context['title_str'] = self._form_title_display_str
        context['subtitle_str'] = self._form_subtitle_display_str

        return context

    def get_initial(self):
        target_frequency_num_periods = self.get_object().target_frequency_num_periods
        if not target_frequency_num_periods:
            target_frequency_num_periods = 1

        initial = {
            'target_frequency_num_periods': target_frequency_num_periods
        }
        return initial

    # add the request to the kwargs
    def get_form_kwargs(self):
        kwargs = super(IndicatorUpdate, self).get_form_kwargs()
        kwargs['request'] = self.request
        program = Program.rf_aware_objects.get(pk=self.object.program_id)
        kwargs['program'] = program
        return kwargs

    def form_valid(self, form, **kwargs):
        periodic_targets = self.request.POST.get('periodic_targets')
        old_indicator = Indicator.objects.get(pk=self.kwargs.get('pk'))
        existing_target_frequency = old_indicator.target_frequency
        new_target_frequency = form.cleaned_data.get('target_frequency')
        lop = form.cleaned_data.get('lop_target')
        rationale = form.cleaned_data.get('rationale')
        old_indicator_values = old_indicator.logged_fields
        prev_level = old_indicator.level  # previous value of "new" level (not to be confused with Indicator.old_level)

        # if existing_target_frequency != new_target_frequency
        # then either existing_target_frequency is None or LoP
        # It shouldn't be anything else as the user should have to delete all targets first

        # Disassociate existing records and delete old PeriodicTargets
        if existing_target_frequency != new_target_frequency:
            PeriodicTarget.objects.filter(indicator=old_indicator).delete()

        # Save completed PeriodicTargets to the DB)
        if new_target_frequency == Indicator.LOP:
            # assume only 1 PT at this point
            lop_pt, created = PeriodicTarget.objects.update_or_create(
                indicator=old_indicator,
                defaults={
                    'target': lop,
                    'period': PeriodicTarget.LOP_PERIOD,
                }
            )

            if created:
                lop_pt.create_date = timezone.now()
                lop_pt.save()

                # Redirect results to new LoP target
                Result.objects.filter(indicator=old_indicator).update(periodic_target=lop_pt)
        else:
            # now create/update periodic targets (will be empty u'[]' for LoP)
            pt_json = json.loads(periodic_targets)

            normalized_pt_json = self.normalize_periodic_target_client_json_dates(pt_json)

            self.validate_periodic_target_json_from_client(
                normalized_pt_json, old_indicator.program, new_target_frequency
            )

            generated_pt_ids = []
            for i, pt in enumerate(normalized_pt_json):
                defaults = {
                    'period': pt.get('period', ''),
                    'target': pt.get('target', 0),
                    'customsort': i,
                    'start_date': pt['start_date'],
                    'end_date': pt['end_date'],
                    'edit_date': timezone.now()
                }

                periodic_target, created = PeriodicTarget.objects \
                    .update_or_create(indicator=old_indicator, id=pt['id'], defaults=defaults)

                if created:
                    periodic_target.create_date = timezone.now()
                    periodic_target.save()
                    generated_pt_ids.append(periodic_target.id)

            # Reassign results to newly created PTs
            if generated_pt_ids:
                pts = PeriodicTarget.objects.filter(indicator=old_indicator, pk__in=generated_pt_ids)
                for pt in pts:
                    Result.objects.filter(
                        indicator=old_indicator,
                        date_collected__range=[pt.start_date, pt.end_date]
                    ).update(periodic_target=pt)


        # save the indicator form
        form.save()
        self.object.refresh_from_db()

        # Write to audit log if results attached or special case of RF level reassignment
        results_count = Result.objects.filter(indicator=self.object).count()
        if (results_count and results_count > 0) or old_indicator.level_id != self.object.level_id:
            ProgramAuditLog.log_indicator_updated(
                self.request.user,
                self.object,
                old_indicator_values,
                self.object.logged_fields,
                rationale
            )

        # refresh the periodic targets form such that pkids of new PeriodicTargets are submitted in the future
        content = render_to_string('indicators/indicatortargets.html', {
            'indicator': self.object,
            'periodic_targets': PeriodicTarget.objects.filter(indicator=self.object).annotate(num_data=Count('result'))
        })

        return JsonResponse({
            'content': content,
            'title_str': self._form_title_display_str,
            'subtitle_str': self._form_subtitle_display_str,
            'save_success_msg': self._save_success_msg(
                self.object,
                created=False,
                level_changed=(self.object.level != prev_level)
            ),
        })


class IndicatorDelete(DeleteView):
    model = Indicator
    form_class = IndicatorForm

    @method_decorator(login_required)
    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    @method_decorator(indicator_pk_adapter(has_indicator_write_access))
    def dispatch(self, request, *args, **kwargs):
        return super(IndicatorDelete, self).dispatch(request, *args, **kwargs)

    def form_invalid(self, form):
        messages.error(self.request, 'Invalid Form', fail_silently=False)
        return self.render_to_response(self.get_context_data(form=form))

    def form_valid(self, form):
        form.save()
        messages.success(self.request, _('Success, Indicator Deleted!'))
        return self.render_to_response(self.get_context_data(form=form))

    def delete(self, request, *args, **kwargs):
        if request.is_ajax():
            indicator = self.get_object()
            if not request.POST.get('rationale'):
                # if an indicator has results and no rationale is provided, fail:
                if indicator.result_set.all().count() > 0:
                    return JsonResponse(
                        {"status": "failed", "msg": _("Reason for change is required.")},
                        status=400
                    )
                # otherwise the rationale is this default:
                else:
                    rationale = _(
                        "Reason for change is not required when deleting an indicator with no linked results."
                        )
            else:
                rationale = request.POST.get('rationale')
            indicator_values = indicator.logged_fields
            program_page_url = indicator.program.program_page_url
            indicator.delete()
            ProgramAuditLog.log_indicator_deleted(self.request.user, indicator, indicator_values, rationale)
            success_message = _("The indicator was successfully deleted.")
            response_context = {'status': 'success'}
            if request.POST.get('redirect'):
                response_context['redirect_url'] = program_page_url
                # message tagged "pnotify" to display a success popup after redirect
                messages.success(request, success_message, extra_tags="pnotify pnotify-success")
            else:
                response_context['msg'] = success_message
            return JsonResponse(response_context)
        else:
            return super(IndicatorDelete, self).delete(request, *args, **kwargs)

    def get_success_url(self):
        return self.object.program.program_page_url

# PERIODIC TARGET VIEWS:


@method_decorator(login_required, name='dispatch')
@method_decorator(indicator_adapter(has_indicator_write_access), name='dispatch')
class PeriodicTargetDeleteAllView(View):
    """
    Delete all targets view
    """
    model = PeriodicTarget

    def post(self, request, *args, **kwargs):
        indicator = Indicator.objects.get(
            pk=self.kwargs.get('indicator', None))

        rationale = request.POST.get('rationale')
        if not rationale:
            if indicator.result_set.all().exists():
                return JsonResponse(
                    {"status": "failed", "msg": _("Reason for change is required")},
                    status=400
                )
            else:
                rationale = _('No reason for change required.')

        periodic_targets = PeriodicTarget.objects.filter(
            indicator=indicator)

        old = indicator.logged_fields

        for pt in periodic_targets:
            pt.result_set.all().update(periodic_target=None)
            pt.delete()

        indicator.target_frequency = None
        indicator.target_frequency_num_periods = 1
        indicator.target_frequency_start = None
        indicator.target_frequency_custom = None
        indicator.lop_target = None  # since lop target is auto-calculated, unset it when PTs are destroyed
        indicator.save()

        ProgramAuditLog.log_indicator_updated(self.request.user, indicator, old, indicator.logged_fields, rationale)

        return JsonResponse({"status": "success"})


def reset_indicator_target_frequency(ind):
    """
    This thing exists due to how the indicator form used to work, which was way more
    permissive in letting you save the target frequency without generating targets.
    It mostly exists now to clean up indicators in a bad state whre the target frequency
    is set but PT count is 0.
    """
    if ind.target_frequency is not None and ind.periodictargets.count() == 0:
        ind.target_frequency = None
        ind.target_frequency_start = None
        ind.target_frequency_num_periods = 1
        ind.save()


@method_decorator(login_required, name='dispatch')
@method_decorator(periodic_target_pk_adapter(has_indicator_write_access), name='dispatch')
class PeriodicTargetDeleteView(DeleteView):
    """
    url periodic_target_delete/<pk>

    Deletes a single target - used only for deleting individual events currently
    """
    model = PeriodicTarget

    def delete(self, request, *args, **kwargs):
        result_count = self.get_object().result_set.count()
        rationale = request.POST.get('rationale')
        indicator = self.get_object().indicator
        old_indicator_values = indicator.logged_fields
        if result_count and result_count > 0:
            if not rationale:
                return JsonResponse(
                    {"status": "failed", "msg": _("Reason for change is required")},
                    status=400
                )
            else:
                self.get_object().result_set.all().update(
                    periodic_target=None)
        if not rationale and result_count == 0:
            rationale = _('No reason for change required.')
        self.get_object().delete()
        if indicator.periodictargets.count() == 0:
            indicator.target_frequency = None
            indicator.target_frequency_num_periods = 1
            indicator.target_frequency_start = None
            indicator.target_frequency_custom = None

        indicator.lop_target = indicator.calculated_lop_target
        indicator.save()

        ProgramAuditLog.log_indicator_updated(
            request.user,
            indicator,
            old_indicator_values,
            indicator.logged_fields,
            rationale
        )

        return JsonResponse({"status": "success"})


class ResultFormMixin(object):
    def get_template_names(self):
        return 'indicators/result_form_modal.html'

    def form_invalid(self, form):
        if self.request.is_ajax():
            return JsonResponse(form.errors, status=400)
        messages.error(self.request, 'Invalid Form', fail_silently=False)
        return self.render_to_response(self.get_context_data(form=form))



class ResultCreate(ResultFormMixin, CreateView):
    """Create new Result called by result_add as modal"""
    model = Result
    form_class = ResultForm

    @method_decorator(login_required)
    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    @method_decorator(indicator_adapter(has_result_write_access))
    def dispatch(self, request, *args, **kwargs):
        if not request.has_write_access:
            raise PermissionDenied
        self.indicator = get_object_or_404(Indicator, pk=self.kwargs['indicator'])
        return super(ResultCreate, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(ResultCreate, self).get_context_data(**kwargs)
        context['indicator'] = self.indicator
        context['title_str'] = u'{}: {}'.format(
            str(self.indicator.form_title_level),
            str(self.indicator.name)
        )
        disaggregations = self.indicator.disaggregation.all().order_by('disaggregation_type')
        context['disaggregation_forms'] = [get_disaggregated_result_formset(disagg)(request=self.request) for disagg in disaggregations]
        return context

    def get_form_kwargs(self):
        kwargs = super(ResultCreate, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        kwargs['indicator'] = self.indicator
        kwargs['program'] = self.indicator.program
        kwargs['request'] = self.request
        return kwargs

    def form_valid(self, form):
        indicator = self.request.POST['indicator']

        result = form.save()
        for disagg in result.indicator.disaggregation.all():
            formset = get_disaggregated_result_formset(disagg)(self.request.POST, result=result, request=self.request)
            if formset.is_valid:
                formset.save()
        ProgramAuditLog.log_result_created(self.request.user, result.indicator, result)

        if self.request.is_ajax():
            data = {
                'pk': result.pk,
                'url': reverse('result_update', kwargs={'pk': result.pk})
            }
            return JsonResponse(data)

        messages.success(self.request, _('Success, Data Created!'))
        redirect_url = result.indicator.program.program_page_url
        return HttpResponseRedirect(redirect_url)


class ResultUpdate(ResultFormMixin, UpdateView):
    """Update Result view called by result_update as modal"""
    model = Result
    form_class = ResultForm

    @method_decorator(login_required)
    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    @method_decorator(result_pk_adapter(has_result_write_access))
    def dispatch(self, request, *args, **kwargs):
        self.result = get_object_or_404(Result, pk=self.kwargs.get('pk'))
        self.indicator = self.result.indicator
        return super(ResultUpdate, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(ResultUpdate, self).get_context_data(**kwargs)
        context['indicator'] = self.indicator
        context['readonly'] = not self.request.has_write_access
        context['title_str'] = u'{}: {}'.format(
            str(self.indicator.form_title_level),
            str(self.indicator.name)
        )
        context['disaggregation_forms'] = [
            get_disaggregated_result_formset(disagg)(result=self.result, request=self.request)
            for disagg in self.indicator.disaggregation.all().order_by('disaggregation_type')
        ]
        return context

    def get_form_kwargs(self):
        kwargs = super(ResultUpdate, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        kwargs['indicator'] = self.indicator
        kwargs['program'] = self.indicator.program
        kwargs['request'] = self.request
        return kwargs

    def form_valid(self, form):
        # save the form then update manytomany relationships
        old_result = Result.objects.get(pk=self.kwargs['pk'])
        old_values = old_result.logged_fields
        old_values['value'] = usefully_normalize_decimal(old_values['value'])
        if "disaggregation_values" in old_values:
            for disagg_id, disagg_dict in old_values["disaggregation_values"].items():
                normalized_value = usefully_normalize_decimal(old_values["disaggregation_values"][disagg_id]["value"])
                old_values["disaggregation_values"][disagg_id]["value"] = normalized_value

        new_result = form.save()
        for disagg in new_result.indicator.disaggregation.all():
            formset = get_disaggregated_result_formset(disagg)(self.request.POST, result=new_result, request=self.request)
            if formset.is_valid:
                formset.save()
        new_values = new_result.logged_fields
        new_values['value'] = usefully_normalize_decimal(new_values['value'])
        if "disaggregation_values" in new_values:
            for disagg_id, disagg_dict in new_values["disaggregation_values"].items():
                normalized_value = usefully_normalize_decimal(new_values["disaggregation_values"][disagg_id]["value"])
                new_values["disaggregation_values"][disagg_id]["value"] = normalized_value

        ProgramAuditLog.log_result_updated(
            self.request.user, new_result.indicator, old_values,
            new_values, form.cleaned_data.get('rationale'))

        if self.request.is_ajax():
            data = serializers.serialize('json', [self.object])
            return HttpResponse(data)

        messages.success(self.request, _('Success, Data Updated!'))
        redirect_url = new_result.program.program_page_url

        return HttpResponseRedirect(redirect_url)


class ResultDelete(DeleteView):
    """TODO: This should handle GET differently - currently returns a nonexistent template"""
    model = Result

    @method_decorator(login_required)
    @method_decorator(group_excluded('ViewOnly', url='workflow/permission'))
    @method_decorator(result_pk_adapter(has_result_write_access))
    def dispatch(self, request, *args, **kwargs):
        return super(ResultDelete, self).dispatch(
            request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if request.is_ajax():
            if not request.POST.get('rationale'):
                return JsonResponse(
                    {"status": "failed", "msg": _("Reason for change is required")},
                    status=401
                )

            result = self.get_object()
            result_values = result.logged_fields
            result.delete()
            ProgramAuditLog.log_result_deleted(
                self.request.user, result.indicator, result_values, self.request.POST['rationale']
            )

            return JsonResponse(
                {"status": "success", "msg": "Result Deleted"}
            )
        else:
            return super(ResultDelete, self).delete(request, *args, **kwargs)

    def get_success_url(self):
        return self.object.program.program_page_url




def merge_two_dicts(x, y):
    """
    merges two dictionaries -- shallow
    """
    z = x.copy()
    z.update(y)
    return z


@login_required
def service_json(request, service):
    """
    For populating service indicators in dropdown
    :param service: The remote data service
    :return: JSON object of the indicators from the service
    """
    if service == 0:
        # no service (this is selecting a custom indicator)
        return HttpResponse(status=204)

    # Permission check
    verify_program_access_level_of_any_program(request, 'high')

    service_indicators = import_indicator(service)
    return JsonResponse(service_indicators, safe=False)


@login_required
@indicator_adapter(has_result_read_access)
def result_view(request, indicator, program):
    """Returns the results table for an indicator - used to expand rows on the Program Page"""
    indicator = ResultsIndicator.results_view.get(pk=indicator)
    reset_indicator_target_frequency(indicator)
    template_name = 'indicators/result_table.html'
    program_obj = indicator.program
    program = program_obj.id
    periodictargets = indicator.annotated_targets
    on_track_lower = 100 - 100 * Indicator.ONSCOPE_MARGIN
    on_track_upper = 100 + 100 * Indicator.ONSCOPE_MARGIN
    if (indicator.lop_percent_met and
            on_track_lower <= indicator.lop_percent_met and
            indicator.lop_percent_met <= on_track_upper):
        on_track = True
    else:
        on_track = False
    is_editable = False if request.GET.get('edit') == 'false' else True

    readonly = not request.has_write_access

    return render_to_response(
        template_name, {
            'indicator': indicator,
            'periodictargets': periodictargets,
            'program_id': program,
            'program': program_obj,
            'is_editable': is_editable,
            'on_track': on_track,
            'readonly': readonly
        }
    )


@login_required
def indicator_plan(request, program):
    """
    This is the GRID report or indicator plan for a program.
    Shows a simple list of indicators sorted by level
    and number. Lives in the "Indicator" home page as a link.
    """
    program = get_object_or_404(Program, id=program)

    verify_program_access_level(request, program.id, 'low')
    if program.results_framework and request.GET.get('orderby') == '2':
        rows = ip.get_rf_rows(ip.tier_sorted_indicator_queryset(program.pk), program.pk)
        ordering = 2
    elif program.results_framework:
        rows = ip.get_rf_rows(ip.chain_sorted_indicator_queryset(program.pk), program.pk)
        ordering = 1
    else:
        rows = ip.get_non_rf_rows(ip.non_rf_indicator_queryset(program.pk))
        ordering = False

    table_width = 4000 #pixels
    return render(request, "indicators/indicator_plan.html", {
        'program': program,
        'column_names': ip.column_names(),
        'column_widths': ip.column_widths(1200),
        'table_width': table_width,
        'rows': rows,
        'ordering': ordering
    })


class DisaggregationReportMixin:
    def get_context_data(self, **kwargs):
        context = super(DisaggregationReportMixin, self) \
            .get_context_data(**kwargs)
        programs = self.request.user.tola_user.available_programs
        indicators = Indicator.objects.filter(program__in=programs)

        programId = int(kwargs.get('program', 0))
        program_selected = None
        if programId:
            program_selected = Program.objects.filter(id=programId).first()
            if program_selected.indicator_set.count() > 0:
                indicators = indicators.filter(program=programId)
        # TODO: this is wrong (rebuild disaggregated value db models)
        disagg_query = "SELECT \
                i.id AS IndicatorID, \
                dt.disaggregation_type AS DType,\
                l.customsort AS customsort, \
                l.label AS Disaggregation, \
                SUM(dv.value) AS Actuals \
            FROM indicators_indicator AS i\
            JOIN indicators_result AS c ON c.indicator_id = i.id\
            JOIN indicators_disaggregatedvalue AS dv ON dv.result_id=c.id\
            JOIN indicators_disaggregationlabel AS l ON l.id=dv.category_id\
            JOIN indicators_disaggregationtype AS dt ON dt.id=l.disaggregation_type_id\
            WHERE i.program_id = %s \
            GROUP BY IndicatorID, DType, customsort, Disaggregation \
            ORDER BY IndicatorID, DType, customsort, Disaggregation;" \
                % programId
        cursor = connection.cursor()
        cursor.execute(disagg_query)
        disdata = dictfetchall(cursor)

        indicator_query = "SELECT DISTINCT \
                p.id as PID, \
                i.id AS IndicatorID, \
                i.number AS INumber, \
                i.name AS Indicator, \
                i.lop_target AS LOP_Target, \
                SUM(cd.achieved) AS Overall \
            FROM indicators_indicator AS i \
            INNER JOIN workflow_program AS p ON p.id = i.program_id \
            LEFT OUTER JOIN indicators_result AS cd \
                ON i.id = cd.indicator_id \
            WHERE p.id = %s \
            GROUP BY PID, IndicatorID \
            ORDER BY Indicator; " % programId

        cursor.execute(indicator_query)
        idata = dictfetchall(cursor)

        for indicator in idata:
            indicator["disdata"] = []
            for i, dis in enumerate(disdata):
                if dis['IndicatorID'] == indicator['IndicatorID']:
                    indicator["disdata"].append(disdata[i])

        context['program_id'] = programId
        context['data'] = idata
        context['getPrograms'] = programs
        context['getIndicators'] = indicators
        context['program_selected'] = program_selected
        if program_selected:
            context['program_name'] = program_selected.name

        return context

@method_decorator(login_required, name='dispatch')
class DisaggregationReportQuickstart(TemplateView):
    template_name = 'indicators/disaggregation_report.html'

    def get_context_data(self, **kwargs):
        context = super(DisaggregationReportQuickstart, self).get_context_data(**kwargs)
        context['program_id'] = 0
        context['data'] = []
        context['getPrograms'] = self.request.user.tola_user.available_programs
        context['disaggregationprint_button'] = False
        context['disaggregationcsv_button'] = False
        return context

@method_decorator(login_required, name='dispatch')
@method_decorator(has_program_read_access, name='dispatch')
class DisaggregationReport(DisaggregationReportMixin, TemplateView):
    template_name = 'indicators/disaggregation_report.html'

    def get_context_data(self, **kwargs):
        context = super(DisaggregationReport, self).get_context_data(**kwargs)
        context['disaggregationprint_button'] = True
        context['disaggregationcsv_button'] = True
        return context


@method_decorator(login_required, name='dispatch')
@method_decorator(has_program_read_access, name='dispatch')
class DisaggregationPrint(DisaggregationReportMixin, TemplateView):
    template_name = 'indicators/disaggregation_print.html'

    def get(self, request, *args, **kwargs):
        context = super(DisaggregationPrint, self).get_context_data(**kwargs)
        hmtl_string = render(request, self.template_name,
                             {'data': context['data'],
                              'program_selected': context['program_selected']
                              })
        pdffile = HTML(string=hmtl_string.content)

        result = pdffile.write_pdf(stylesheets=[CSS(
            string='@page {\
                size: letter; margin: 1cm;\
                @bottom-right{\
                    content: "Page " counter(page) " of " counter(pages);\
                };\
            }'
        )])
        res = HttpResponse(result, content_type='application/pdf')
        res['Content-Disposition'] = 'attachment; \
            filename=indicators_disaggregation_report.pdf'

        res['Content-Transfer-Encoding'] = 'binary'
        # return super(DisaggregationReport, self).get(
        #   request, *args, **kwargs)
        return res


@method_decorator(login_required, name='dispatch')
@method_decorator(has_program_read_access, name='dispatch')
class IndicatorExport(View):
    """
    Export all indicators to an XLS file
    """
    def get(self, request, *args, **kwargs):
        program = get_object_or_404(Program, pk=kwargs.get('program'))
        if program.results_framework and request.GET.get('orderby') == '2':
            wb = ip.create_rf_workbook(ip.tier_sorted_indicator_queryset(program.pk), program.pk)
        elif program.results_framework:
            wb = ip.create_rf_workbook(ip.chain_sorted_indicator_queryset(program.pk), program.pk)
        else:
            wb = ip.create_non_rf_workbook(ip.non_rf_indicator_queryset(program.pk))

        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = 'attachment; filename="{}"'.format('indicator_plan.xlsx')
        wb.save(response)
        return response


@login_required
@indicator_adapter(has_program_read_access)
def api_indicator_view(request, indicator, program):
    """
    API call for viewing an indicator for the program page
    """
    indicator = Indicator.objects.only('program_id', 'sector_id').get(pk=indicator)
    program = ProgramWithMetrics.program_page.get(pk=indicator.program_id)
    program.indicator_filters = {}

    indicator = program.annotated_indicators \
        .annotate(target_period_last_end_date=Max('periodictargets__end_date')).get(pk=indicator.pk)

    return JsonResponse(IndicatorSerializer(indicator).data)


@login_required
@has_program_read_access
def api_indicators_list(request, program):
    """
    API call for refreshing a list of indicators on the program page
    """
    program = ProgramWithMetrics.program_page.get(pk=program)
    program.indicator_filters = {}

    indicators = program.annotated_indicators \
        .annotate(target_period_last_end_date=Max('periodictargets__end_date')).select_related('level')

    return JsonResponse({
        # 'program': ProgramSerializer(program).data,
        'indicators': IndicatorSerializer(indicators, many=True).data,
    })
