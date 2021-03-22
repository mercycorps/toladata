# -*- coding: utf-8 -*-
import re
import collections
import string
import uuid
from datetime import timedelta, date
from decimal import Decimal
import dateparser
from functools import total_ordering

from tola.l10n_utils import l10n_date_medium
from tola.model_utils import generate_safedelete_queryset

from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import signals
from django.dispatch import receiver
from django.http import QueryDict
from django.urls import reverse
from django.utils import formats, timezone
from django.utils.translation import ugettext_lazy as _
from django.contrib import admin
from django.utils.functional import cached_property
import django.template.defaultfilters

from simple_history.models import HistoricalRecords
from safedelete.models import SafeDeleteModel
from safedelete.managers import SafeDeleteManager
from safedelete.queryset import SafeDeleteQueryset
from django_mysql.models import ListCharField
from tola.util import usefully_normalize_decimal
from multiselectfield import MultiSelectField

from workflow.models import (
    Program, Sector, SiteProfile, Country, TolaUser
)


@total_ordering
class MaxType:
    def __le__(self, other):
        return False

    def __eq__(self, other):
        return (self is other)

Max = MaxType()

@total_ordering
class MinType:
    def __le__(self, other):
        return True

    def __eq__(self, other):
        return (self is other)

Min = MinType()


class IndicatorType(models.Model):
    indicator_type = models.CharField(_("Indicator type"), max_length=135, blank=True)
    description = models.TextField(_("Description"), max_length=765, blank=True)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        verbose_name = _("Indicator Type")

    def __str__(self):
        return self.indicator_type


class IndicatorTypeAdmin(admin.ModelAdmin):
    list_display = ('indicator_type', 'description', 'create_date',
                    'edit_date')
    display = 'Indicator Type'


class StrategicObjective(SafeDeleteModel):
    name = models.CharField(_("Name"), max_length=135, blank=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, null=True, blank=True, verbose_name=_("Country"))
    description = models.TextField(_("Description"), max_length=765, blank=True)
    status = models.CharField(_("Status"), max_length=255, blank=True)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        verbose_name = _("Country Strategic Objectives")
        ordering = ('country', 'name')

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        super(StrategicObjective, self).save(*args, **kwargs)


class Objective(models.Model):
    name = models.CharField(_("Name"), max_length=135, blank=True)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, null=True, blank=True, verbose_name=_("Program"))
    description = models.TextField(_("Description"), max_length=765, blank=True)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        verbose_name = _("Program Objective")
        ordering = ('program', 'name')

    def __str__(self):
        return self.name

    def save(self):
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()
        super(Objective, self).save()


class Level(models.Model):
    name = models.CharField(_("Name"), max_length=500)
    assumptions = models.TextField(_("Assumptions"), blank=True)
    parent = models.ForeignKey('self', blank=True, null=True, on_delete=models.CASCADE, related_name='child_levels')
    program = models.ForeignKey(Program, blank=True, null=True, on_delete=models.CASCADE, related_name='levels')
    customsort = models.IntegerField(_("Sort order"), blank=True, null=True)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        ordering = ('customsort', )
        verbose_name = _("Level")
        unique_together = ('parent', 'customsort')

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        super(Level, self).save(*args, **kwargs)

    def get_level_depth(self, depth=1):
        if self.parent is None:
            return depth
        else:
            depth += 1
            depth = self.parent.get_level_depth(depth)
        return depth

    @cached_property
    def level_depth(self):
        return self.get_level_depth()

    @property
    def ontology(self):
        target = self
        ontology = []
        while True:
            ontology = [str(target.customsort)] + ontology
            if target.parent is None:
                break
            else:
                target = target.parent

        tier_count = LevelTier.objects.filter(program=self.program_id).count()
        missing_tiers = tier_count - self.get_level_depth()
        ontology += missing_tiers * ['0']
        return '.'.join(ontology)

    @property
    def display_ontology(self):
        target = self
        display_ontology = []
        while target.parent is not None:
            display_ontology = [str(target.customsort),] + display_ontology
            target = target.parent
        return '.'.join(display_ontology)

    @property
    def leveltier(self):
        # TODO: What if their level hierarchy is deeper than the leveltier set that they pick
        tiers = self.program.level_tiers.order_by('tier_depth')
        try:
            tier = tiers[self.level_depth-1]
        except IndexError:
            tier = None
        return tier

    @cached_property
    def display_name(self):
        """ this returns the level's "name" as displayed on IPTT i.e. Goal: name or Output 1.1: Name"""
        return u'{tier}{ontology}: {name}'.format(
            tier=_(self.leveltier.name) if self.leveltier else '',
            ontology=' {}'.format(self.display_ontology) if self.display_ontology else '',
            name=self.name
        )

    @cached_property
    def display_number(self):
        """ (for audit log) this returns the level's tier name and level number, i.e. 'Goal' or 'Output 1.1'"""
        return '{tier}{ontology}'.format(
            tier=_(self.leveltier.name) if self.leveltier else '',
            ontology=' {}'.format(self.display_ontology) if self.display_ontology else '',
        )

    def get_children(self):
        """ Used in group-by-outcome-chain reports, recursively gets children in tree order"""
        child_levels = []
        for child_level in self.child_levels.all():
            child_levels.append(child_level)
            child_levels += child_level.get_children()
        return child_levels

    @property
    def next_sort_order(self):
        current_max = None
        if self.indicator_set.exists():
            current_max = self.indicator_set.filter(deleted__isnull=True).aggregate(
                models.Max('level_order')
            ).get('level_order__max', None)
        return 0 if current_max is None else current_max + 1

    def update_level_order(self):
        if self.indicator_set.filter(deleted__isnull=True).exists():
            for c, indicator in enumerate(self.indicator_set.filter(deleted__isnull=True).order_by('level_order')):
                if c != indicator.level_order:
                    indicator.level_order = c
                    indicator.save()

    @staticmethod
    def sort_by_ontology(levels):
        """
        Take a sequence of Level objects, and order them by their ontology hierarchy (DFS traversal)
        Assume one root node - assert if multiple roots found
        Levels not part of the tree will not be returned
        """
        if not levels:
            return levels

        # A root node has parent_id is None, or a parent_id not present in the list (sub-tree)
        level_ids = set(l.id for l in levels)
        root_nodes = [l for l in levels if l.parent_id is None or l.parent_id not in level_ids]
        assert len(root_nodes) == 1
        root_node = root_nodes[0]

        # ensure levels are ordered by customsort at their given tier
        # Note: "is None" in the tuple required to avoid comparing "None" with int (python3)
        sorted_levels = sorted(
            levels,
            key=lambda level_obj: ((level_obj.parent_id is None, level_obj.parent_id),
                (level_obj.customsort is None, level_obj.customsort))
            )

        # parent_id -> [] of child Levels
        tree_map = collections.defaultdict(list)

        for level in sorted_levels:
            tree_map[level.parent_id].append(level)

        return_levels = []
        dfs_stack = [root_node]

        while dfs_stack:
            level = dfs_stack.pop()
            children = tree_map.get(level.id, [])
            children.reverse()  # does not return a list!
            dfs_stack.extend(children)
            return_levels.append(level)

        return return_levels

    @property
    def logged_fields(self):
        """
        Fields logged by program audit log. If you change the composition of this property you may also want
        to update the logged_field_order property.
        """

        return {
            "name": self.name.strip(),
            "assumptions": self.assumptions.strip(),
        }

    @staticmethod
    def logged_field_order():
        """
        This list determines the order in which result fields will be displayed in the change log.  Because it
        represents all fields that have ever been used in the Result form change log, it should never be
        shrunk, only expanded or reordered.
        """
        return ['name', 'assumptions']


class LevelAdmin(admin.ModelAdmin):
    list_display = ('name')
    display = 'Levels'


class LevelTier(models.Model):

    MAX_TIERS = 8
    @property
    def TEMPLATES(self):
        return self.get_templates()

    #####!!!!!!!!!!! IMPORTANT!!    !!!!!!!!!!!#####
    # If you update these templates, make sure you update the template in /js/level_utils.js.  They need to be in
    # some .js file so that the translation strings get picked up in the djangojs.po/mo file and provided to the
    # front-end.
    @classmethod
    def get_templates(cls):
        return {
            'mc_standard': {
                # Translators: Name of the most commonly used organizational hierarchy of KPIs at Mercy Corps.
                'name': _('Mercy Corps'),
                'tiers': [
                    # Translators: Highest level objective of a project.  High level KPIs can be attached here.
                    _('Goal'),
                    # Translators: Below Goals, the 2nd highest organizing level to attach KPIs to.
                    _('Outcome'),
                    # Translators: Below Outcome, the 3rd highest organizing level to attach KPIs to. Noun.
                    _('Output'),
                    # Translators: Below Output, the lowest organizing level to attach KPIs to.
                    _('Activity')]},
            'dfid': {
                # Translators: Name of the most commonly used organizational hierarchy of KPIs at Mercy Corps.
                'name': _('Department for International Development (DFID)'),
                'tiers': [
                    # Translators: Highest level objective of a project.  High level KPIs can be attached here.
                    _('Impact'),
                    # Translators: Below Goals, the 2nd highest organizing level to attach KPIs to.
                    _('Outcome'),
                    # Translators: Below Outcome, the 3rd highest organizing level to attach KPIs to. Noun.
                    _('Output'),
                    # Translators: Below Output, the lowest organizing level to attach KPIs to.
                    _('Input')]},
            'ec': {
                # Translators: The KPI organizational hierarchy used when we work on EC projects.
                'name': _('European Commission (EC)'),
                'tiers': [
                    # Translators: Highest level goal of a project.  High level KPIs can be attached here.
                    _('Overall Objective'),
                    # Translators: Below Overall Objective, the 2nd highest organizing level to attach KPIs to.
                    _('Specific Objective'),
                    # Translators: Below Specific Objective, the 3rd highest organizing level to attach KPIs to.
                    _('Purpose'),
                    # Translators: Below Purpose, the 4th highest organizing level to attach KPIs to.
                    _('Result'),
                    # Translators: Below Result, the lowest organizing level to attach KPIs to.
                    _('Activity')]},
            'usaid1': {
                # Translators: The KPI organizational hierarchy used when we work on certain USAID projects.
                'name': _('USAID 1'),
                'tiers': [
                    # Translators: Highest level objective of a project.  High level KPIs can be attached here.
                    _('Goal'),
                    # Translators: Below Goal, the 2nd highest organizing level to attach KPIs to.
                    _('Purpose'),
                    # Translators: Below Purpose, the 3rd highest organizing level to attach KPIs to.
                    _('Sub-Purpose'),
                    # Translators: Below Sub-Purpose, the 4th highest organizing level to attach KPIs to. Noun.
                    _('Output'),
                    # Translators: Below Output, the lowest organizing level to attach KPIs to. Noun.
                    _('Input')]},
            'usaid2': {
                # Translators: The KPI organizational hierarchy used when we work on certain USAID projects.
                'name': _('USAID 2'),
                'tiers': [
                    # Translators: Highest level goal of a project.  High level KPIs can be attached here.
                    _('Strategic Objective'),
                    # Translators: Below Strategic Objective, the 2nd highest organizing level to attach KPIs to.
                    _('Intermediate Result'),
                    # Translators: Below Intermediate Result, the 3rd highest organizing level to attach KPIs to.
                    _('Sub-Intermediate Result'),
                    # Translators: Below Sub-Intermediate Result, the 4th highest organizing level to attach KPIs to. Noun.
                    _('Output'),
                    # Translators: Below Output, the lowest organizing level to attach KPIs to. Noun.
                    _('Input')]},
            'usaid_ffp': {
                # Translators: The KPI organizational hierarchy used when we work on USAID Food for Peace projects.
                'name': _('USAID FFP'),
                'tiers': [
                    # Translators: Highest level objective of a project.  High level KPIs can be attached here.
                    _('Goal'),
                    # Translators: Below Goal, the 2nd highest organizing level to attach KPIs to.
                    _('Purpose'),
                    # Translators: Below Purpose, the 3rd highest organizing level to attach KPIs to.
                    _('Sub-Purpose'),
                    # Translators: Below Sub-Purpose, the 4th highest organizing level to attach KPIs to.
                    _('Intermediate Outcome'),
                    # Translators: Below Intermediate Outcome, the lowest organizing level to attach KPIs to. Noun.
                    _('Output')]},
        }

    name = models.CharField(_("Name"), max_length=135, blank=True)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='level_tiers')
    # Translators: This is depth of the selected object (a level tier) in a hierarchy of level tier objects
    tier_depth = models.IntegerField(_("Level Tier depth"))
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        ordering = ('tier_depth', )
        # Translators: Indicators are assigned to Levels.  Levels are organized in a hierarchy of Tiers.
        verbose_name = _("Level Tier")
        unique_together = (('name', 'program'), ('program', 'tier_depth'))

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()
        super(LevelTier, self).save(*args, **kwargs)


# Right now, these are only being used to store custom templates across sessions.  However, they could also
# be used to store regular templates (i.e. instead of using an attribute of the LevelTier model).
class LevelTierTemplate(models.Model):
    # Translators:  A user can select from multiple templates for a particular piece of funtionality.  This is a label for the name of the template.
    names = ListCharField(base_field=models.CharField(max_length=75), size=6, max_length=(7 * 70))
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='level_tier_templates')
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        # Translators: Indicators are assigned to Levels.  Levels are organized in a hierarchy of Tiers.  There are several templates that users can choose from with different names for the Tiers.
        verbose_name = _("Level tier templates")

    def __str__(self):
        return ",".join(self.names)

    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()
        super(LevelTierTemplate, self).save(*args, **kwargs)

class DisaggregationIndicatorFormManager(models.Manager):
    def get_queryset(self):
        qs = super().get_queryset().order_by('disaggregation_type').annotate(
            _in_use=models.Exists(
                Indicator.rf_aware_objects.filter(
                    disaggregation__in=models.OuterRef('pk')
                )
            )
        ).prefetch_related(
            models.Prefetch(
                'disaggregationlabel_set',
                queryset=DisaggregationLabel.objects.annotate(
                    in_use=models.Exists(
                        DisaggregatedValue.objects.filter(
                            category=models.OuterRef('pk'),
                            value__isnull=False
                        )
                    )
                ),
                to_attr='categories'
                )
            )
        return qs

    def for_indicator(self, indicator_pk):
        qs = self.get_queryset()
        qs = qs.annotate(
            has_results=models.Exists(
                DisaggregatedValue.objects.filter(
                    category__disaggregation_type=models.OuterRef('pk'),
                    value__isnull=False,
                    result__indicator__pk=indicator_pk
                )
            )
        )
        return qs


class DisaggregationType(models.Model):
    """
    #####!!!!!!!!!!! IMPORTANT!!    !!!!!!!!!!!#####
    The GLOBAL_DISAGGREGATION_LABELS constant was created to ensure that a translated string appears
    in the PO file.  It won't appear through the normal translation machinery because
    the global disagg types are stored in the DB rather than the code.  When adding
    a global disaggregation type you will need to add the marked string to this list.

    If you update these templates, make sure you update the globalDisaggregationTypes constant in
    js/extra_translations.js.
    """
    GLOBAL_DISAGGREGATION_LABELS = [
        _("Sex and Age Disaggregated Data (SADD)")
    ]

    """Business logic name: Disaggregation - e.g. `Gender` or `SADD`"""
    disaggregation_type = models.CharField(_("Disaggregation"), max_length=135)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, null=True, blank=True, verbose_name="Country")
    standard = models.BooleanField(default=False, verbose_name=_("Global (all programs, all countries)"))
    is_archived = models.BooleanField(default=False, verbose_name=_("Archived"))
    selected_by_default = models.BooleanField(default=False)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)
    objects = models.Manager()
    form_objects = DisaggregationIndicatorFormManager()

    class Meta:
        unique_together = ['disaggregation_type', 'country']

    def __str__(self):
        return self.disaggregation_type

    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()

        super(DisaggregationType, self).save(*args, **kwargs)

    @classmethod
    def program_disaggregations(cls, program_pk, countries=None, indicator_pk=None):
        """Takes a program or program_pk and returns all disaggregations available to that program

            - returns (list of global disaggs, list of tuples (country name, list of country disaggs))
            - filters for not-archived, or in use by program (even after archiving, actively in-use disaggs
                are still available to a program
        """
        program = Program.rf_aware_objects.get(pk=program_pk)
        country_set = program.country.all()
        if countries is not None:
            country_set = country_set.filter(pk__in=[c.pk for c in countries])
        disaggs = cls.form_objects
        if indicator_pk is not None:
            disaggs = disaggs.for_indicator(indicator_pk)
        else:
            disaggs = disaggs.annotate(has_results=models.Value(False, output_field=models.BooleanField()))
        disaggs = disaggs.filter(
            models.Q(standard=True) | models.Q(country__in=country_set),
            models.Q(is_archived=False) | models.Q(indicator__program=program)
        ).distinct()
        return (
            disaggs.filter(standard=True),
            [
                (country_name, disaggs.filter(country=country_pk))
                for country_pk, country_name in disaggs.filter(
                    standard=False
                ).values_list('country', 'country__country').distinct().order_by('country__country')
            ]
        )

    @property
    def in_use(self):
        return getattr(self, '_in_use', self.has_indicators)

    @property
    def has_indicators(self):
        return self.indicator_set.exists()

    @property
    def labels(self):
        return self.disaggregationlabel_set.all().order_by('customsort')

    @property
    def logged_fields(self):
        """
        If you change the composition of this property you may also want to update the logged_field_order property.
        """
        return {
            "disaggregation_type": self.disaggregation_type,
            "is_archived": self.is_archived,
            "labels": {
                l.id: {
                    "id": l.id,
                    "label": l.label,
                    "custom_sort": l.customsort,
                }
                for l in self.disaggregationlabel_set.all()
            },
        }

    @staticmethod
    def logged_field_order():
        """
        This list determines the order in which result fields will be displayed in the change log.  Because it
        represents all fields that have ever been used in the Result form change log, it should never be
        shrunk, only expanded or reordered.  Adding another property was the path of least resistance for enabling
        front end ordering of the fields.  An ordered dict doesn't work because it loses order in JS and changing
        the logged fields to an ordered type would require a similar change in all models that use the same logging
        mechanism to track history.
        """
        return ['type', 'is_archived', 'labels',]


class DisaggregationLabel(models.Model):
    """Business logic name: Category - e.g. `Male` or `Females aged 16-24`"""
    disaggregation_type = models.ForeignKey(DisaggregationType, on_delete=models.CASCADE,
                                            verbose_name=_("Disaggregation"))
    label = models.CharField(_("Label"), max_length=765)
    customsort = models.PositiveSmallIntegerField(_("Sort order"), default=0, blank=False, null=False)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        ordering = ['customsort']
        unique_together = ['disaggregation_type', 'label']

    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()

        super(DisaggregationLabel, self).save(*args, **kwargs)

    def __str__(self):
        return self.label

    @property
    def name(self):
        return self.label

    @classmethod
    def get_standard_labels(cls):
        return cls.objects.filter(disaggregation_type__standard=True)


class DisaggregatedValue(models.Model):
    result = models.ForeignKey('indicators.Result', on_delete=models.CASCADE)
    category = models.ForeignKey(DisaggregationLabel, on_delete=models.CASCADE,
                                 verbose_name=_("Disaggregation category"))
    value = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['result', 'category'], name='unique_disaggregation_per_result')
        ]


class ReportingFrequency(models.Model):
    frequency = models.CharField(
        _("Frequency"), max_length=135, unique=True)
    description = models.CharField(
        _("Description"), max_length=765, blank=True)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    sort_order = models.IntegerField(unique=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        verbose_name = _("Reporting Frequency")

    def __str__(self):
        return self.frequency


class DataCollectionFrequency(models.Model):
    frequency = models.CharField(
        _("Frequency"), max_length=135, unique=True)
    description = models.CharField(
        _("Description"), max_length=255, blank=True, null=True)
    sort_order = models.IntegerField(unique=True)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        verbose_name = _("Data Collection Frequency")

    def __str__(self):
        return self.frequency


class DataCollectionFrequencyAdmin(admin.ModelAdmin):
    list_display = ('frequency', 'description', 'create_date', 'edit_date')
    display = 'Data Collection Frequency'


class ExternalService(models.Model):
    name = models.CharField(_("Name"), max_length=255, blank=True)
    url = models.CharField(_("URL"), max_length=765, blank=True)
    feed_url = models.CharField(_("Feed URL"), max_length=765, blank=True)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        verbose_name = _("External Service")

    def __str__(self):
        return self.name


class ExternalServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'url', 'feed_url', 'create_date', 'edit_date')
    display = 'External Indicator Data Service'


class ExternalServiceRecord(models.Model):
    external_service = models.ForeignKey(
        ExternalService, blank=True, null=True, on_delete=models.SET_NULL,
        verbose_name=_("External service"))
    full_url = models.CharField(_("Full URL"), max_length=765, blank=True)
    record_id = models.CharField(_("Unique ID"), max_length=765, blank=True)
    create_date = models.DateTimeField(null=True, blank=True, verbose_name=_("Create date"))
    edit_date = models.DateTimeField(null=True, blank=True, verbose_name=_("Edit date"))

    class Meta:
        verbose_name = _("External Service Record")

    def __str__(self):
        return self.full_url


class ExternalServiceRecordAdmin(admin.ModelAdmin):
    list_display = ('external_service', 'full_url', 'record_id', 'create_date',
                    'edit_date')
    display = 'Exeternal Indicator Data Service'

# pylint: disable=W0223
class DecimalSplit(models.Func):
    function = 'SUBSTRING_INDEX'
    template = '%(function)s(%(expressions)s)'

    def __init__(self, string_value, count, **extra):
        expressions = models.F(string_value), models.Value('.'), count
        super(DecimalSplit, self).__init__(*expressions)

# pylint: disable=W0223
class DoubleDecimalSplit(models.Func):
    function = 'SUBSTRING_INDEX'
    template = 'SUBSTRING_INDEX(%(function)s(%(expressions)s), \'.\', -1)'

    def __init__(self, string_value, count, **extra):
        expressions = models.F(string_value), models.Value('.'), count
        super(DoubleDecimalSplit, self).__init__(*expressions)


class IndicatorSortingQSMixin:
    """This provides a temporary relief to indicator number sorting issues in advance of Satsuma -
    uses regex matches to determine if the number is of the format "1.1" or "1.1.1" etc. and sorts it then by
    version number sorting, otherwise numeric, and falls back to alphabetical.  Written as a mixin so it can be
    replaced with log frame sorting on release of Satsuma"""
    def with_logframe_sorting(self):
        numeric_re = r'^[[:space:]]*[0-9]+[[:space:]]*$'
        castable_to_int_re = r'[0-9]+'
        logframe_re = r'^[[:space:]]*(([0-9]+)|([a-z]+))([[.period.]](([0-9]+)|([a-z]+)))?'\
                      '([[.period.]](([0-9]+)|([a-z]+)))?([[.period.]](([0-9]+)|([a-z]+)))?([[.period.]])?[[:space:]]*$'
        logframe_re2 = r'^[[:space:]]*(([0-9]+)|([a-z]+))[[.period.]](([0-9]+)|([a-z]+))([[.period.]](([0-9]+)|([a-z]+)))?([[.period.]](([0-9]+)|([a-z]+)))?([[.period.]])?[[:space:]]*$'
        logframe_re3 = r'^[[:space:]]*(([0-9]+)|([a-z]+))[[.period.]](([0-9]+)|([a-z]+))[[.period.]](([0-9]+)|([a-z]+))([[.period.]](([0-9]+)|([a-z]+)))?([[.period.]])?[[:space:]]*$'
        logframe_re4 = r'^[[:space:]]*(([0-9]+)|([a-z]+))[[.period.]](([0-9]+)|([a-z]+))[[.period.]](([0-9]+)|([a-z]+))[[.period.]](([0-9]+)|([a-z]+))([[.period.]])?[[:space:]]*$'
        old_level_whens = [
            models.When(
                old_level=level_name,
                then=level_pk
            ) for (level_pk, level_name) in Indicator.OLD_LEVELS
        ] + [
            models.When(
                old_level__isnull=True,
                then=99
            ),
        ]
        qs = self.annotate(
            old_level_pk=models.Case(
                *old_level_whens,
                default=99,
                output_field=models.IntegerField()
            ),
            logsort_type=models.Case(
                models.When(
                    models.Q(
                        models.Q(
                            models.Q(program___using_results_framework=Program.MIGRATED) |
                            models.Q(program___using_results_framework=Program.RF_ALWAYS)
                        ) &
                        models.Q(level_id__isnull=False)
                    ),
                    then=0
                ),
                models.When(
                    number__regex=logframe_re,
                    then=1
                ),
                models.When(
                    number__regex=numeric_re,
                    then=2
                ),
                default=3,
                output_field=models.IntegerField()
            )
        ).annotate(
            logsort_a=models.Case(
                models.When(
                    logsort_type=0,
                    then=models.F('level_order')
                ),
                models.When(
                    logsort_type=1,
                    then=DecimalSplit('number', 1)
                ),
                models.When(
                    logsort_type=2,
                    then=models.F('number'),
                ),
                default=models.Value(0),
                output_field=models.CharField()
            ),
            logsort_b=models.Case(
                models.When(
                    number__regex=logframe_re2,
                    then=DoubleDecimalSplit('number', 2)
                ),
                default=models.Value(0),
                output_field=models.CharField()
            ),
            logsort_c=models.Case(
                models.When(
                    number__regex=logframe_re3,
                    then=DoubleDecimalSplit('number', 3)
                ),
                default=models.Value(0),
                output_field=models.CharField()
            ),
            logsort_d=models.Case(
                models.When(
                    number__regex=logframe_re4,
                    then=DoubleDecimalSplit('number', 4)
                ),
                default=models.Value(0),
                output_field=models.CharField()
            )
        ).annotate(
            logsort_a_int=models.Case(
                models.When(
                    logsort_a__regex=castable_to_int_re,
                    then=models.F('logsort_a')
                ),
                default=models.Value(0),
                output_field=models.IntegerField()
            ),
            logsort_b_int=models.Case(
                models.When(
                    logsort_b__regex=castable_to_int_re,
                    then=models.F('logsort_b')
                ),
                default=models.Value(0),
                output_field=models.IntegerField()
            ),
            logsort_c_int=models.Case(
                models.When(
                    logsort_c__regex=castable_to_int_re,
                    then=models.F('logsort_c')
                ),
                default=models.Value(0),
                output_field=models.IntegerField()
            ),
        )
        return qs.order_by(
            'logsort_type',
            models.functions.Cast('logsort_a_int', models.IntegerField()),
            models.functions.Cast('logsort_a', models.CharField()),
            models.functions.Cast('logsort_b_int', models.IntegerField()),
            models.functions.Cast('logsort_b', models.CharField()),
            models.functions.Cast('logsort_c_int', models.IntegerField()),
            models.functions.Cast('logsort_c', models.CharField()),
            'number'
            )

class IndicatorSortingManagerMixin:
    """This provides a temporary relief to indicator number sorting issues in advance of Satsuma -
    provides a logframe sorting method that utilizes the above QS mixin to sort as though a logframe model existed"""
    def with_logframe_sorting(self):
        qs = self.get_queryset()
        return qs.with_logframe_sorting()

class IndicatorQuerySet(SafeDeleteQueryset, IndicatorSortingQSMixin):
    pass

class IndicatorManager(SafeDeleteManager, IndicatorSortingManagerMixin):

    def get_queryset(self):
        queryset = IndicatorQuerySet(self.model, using=self._db)
        queryset._safedelete_visibility = self._safedelete_visibility
        queryset._safedelete_visibility_field = self._safedelete_visibility_field
        return queryset.select_related('program', 'sector')


class IndicatorRFMixin:
    qs_name = 'RFAware'
    annotate_methods = ['is_program_using_results_framework', 'is_using_manual_numbering']

    def is_program_using_results_framework(self):
        return self.annotate(
            using_results_framework=models.Case(
                models.When(
                    program___using_results_framework=Program.NOT_MIGRATED,
                    then=models.Value(False)
                ),
                default=models.Value(True),
                output_field=models.BooleanField()
            )
        )

    def is_using_manual_numbering(self):
        return self.annotate(
            manual_number_display=models.Case(
                models.When(
                    using_results_framework=False,
                    then=models.Value(True)
                ),
                models.When(
                    program__auto_number_indicators=False,
                    then=models.Value(True)
                ),
                default=models.Value(False),
                output_field=models.BooleanField()
            )
        )

class IndicatorLevelsMixin:
    qs_name = 'LevelAware'
    annotate_methods = ['annotate_old_level']
    ordering_methods = ['order_by_old_level']

    def annotate_old_level(self):
        old_level_whens = [
            models.When(
                models.Q(
                    models.Q(using_results_framework=True) &
                    models.Q(level_id__isnull=False)
                ),
                then=models.Value(0)
            )
        ] + [
            models.When(
                old_level=level_name,
                then=level_pk
            ) for (level_pk, level_name) in Indicator.OLD_LEVELS
        ] + [
            models.When(
                old_level__isnull=True,
                then=None
            ),
        ]
        return self.annotate(
            old_level_pk=models.Case(
                *old_level_whens,
                default=None,
                output_field=models.IntegerField()
            )
        )

    def order_by_old_level(self):
        return self.order_by(models.F('old_level_pk').asc(nulls_last=True))


class IndicatorTargetsMixin:
    qs_name = 'TargetAware'
    annotate_methods = ['annotate_lop_target', 'annotate_most_recent_complete']

    def annotate_lop_target(self):
        from indicators.queries import utils as query_utils
        return self.annotate(
            lop_target_calculated=query_utils.indicator_lop_target_calculated_annotation()
        )

    def annotate_most_recent_complete(self):
        from indicators.queries import utils as query_utils
        return self.annotate(
            most_recent_completed_target_end_date=models.Subquery(
                PeriodicTarget.objects.filter(
                    indicator=models.OuterRef('pk'),
                    end_date__lt=query_utils.UTCNow()
                ).order_by('-end_date').values('end_date')[:1],
                output_field=models.DateField()
            ),
            target_period_last_end_date=models.Subquery(
                PeriodicTarget.objects.filter(
                    indicator=models.OuterRef('pk')
                ).order_by('-end_date').values('end_date')[:1],
                output_field=models.DateField()
            ),
        )

class IndicatorMetricsMixin:
    qs_name = 'MetricsAnnotated'
    annotate_methods = ['annotate_reporting', 'annotate_scope', 'annotate_counts', 'annotate_metrics', 'annotate_kpi']

    def annotate_reporting(self):
        from indicators.queries import utils as query_utils
        return self.annotate(
            lop_actual_progress=query_utils.indicator_lop_actual_progress_annotation(),
            lop_target_progress=query_utils.indicator_lop_target_progress_annotation(),
            reporting=query_utils.indicator_reporting_annotation()
        )

    def annotate_scope(self):
        from indicators.queries import utils as query_utils
        return self.annotate(
            lop_percent_met_progress=query_utils.indicator_lop_percent_met_progress_annotation(),
            over_under=query_utils.indicator_over_under_annotation()
        )

    def annotate_counts(self):
        from indicators.queries import utils as query_utils
        return self.annotate(
            program_months=query_utils.indicator_get_program_months_annotation(),
            defined_targets=models.Count('periodictargets'),
            results_count=query_utils.indicator_results_count_annotation(),
            results_with_evidence_count=query_utils.indicator_results_evidence_annotation(),
        )

    def annotate_metrics(self):
        from indicators.queries import utils as query_utils
        return self.annotate(
            has_all_targets_defined=query_utils.indicator_all_targets_defined_annotation(),
            lop_actual=query_utils.indicator_lop_actual_annotation(),
            lop_percent_met=query_utils.indicator_lop_percent_met_annotation()
        )

    def annotate_kpi(self):
        """annotation to replace the former key_performance_indicator field to avoid extra lookups"""
        return self.annotate(
            is_key_performance_indicator=models.Exists(
                IndicatorType.objects.filter(
                    indicator=models.OuterRef('pk'),
                    indicator_type="Key Performance Indicator (KPI)"
                )
            )
        )

class Indicator(SafeDeleteModel):
    LOP = 1
    MID_END = 2
    ANNUAL = 3
    SEMI_ANNUAL = 4
    TRI_ANNUAL = 5
    QUARTERLY = 6
    MONTHLY = 7
    EVENT = 8
    TARGET_FREQUENCIES = (
        (LOP, _('Life of Program (LoP) only')),
        (MID_END, _('Midline and endline')),
        (ANNUAL, _('Annual')),
        (SEMI_ANNUAL, _('Semi-annual')),
        (TRI_ANNUAL, _('Tri-annual')),
        (QUARTERLY, _('Quarterly')),
        (MONTHLY, _('Monthly')),
        (EVENT, _('Event'))
    )

    REGULAR_TARGET_FREQUENCIES = (
        ANNUAL,
        SEMI_ANNUAL,
        TRI_ANNUAL,
        QUARTERLY,
        MONTHLY,
    )

    IRREGULAR_TARGET_FREQUENCIES = (
        LOP,
        MID_END,
        EVENT,
    )

    NUMBER = 1
    PERCENTAGE = 2
    UNIT_OF_MEASURE_TYPES = (
        (NUMBER, _('Number (#)')),
        (PERCENTAGE, _("Percentage (%)"))
    )

    DIRECTION_OF_CHANGE_NONE = 1
    DIRECTION_OF_CHANGE_POSITIVE = 2
    DIRECTION_OF_CHANGE_NEGATIVE = 3
    DIRECTION_OF_CHANGE = (
        (DIRECTION_OF_CHANGE_NONE, _("Not applicable")),
        (DIRECTION_OF_CHANGE_POSITIVE, _("Increase (+)")),
        (DIRECTION_OF_CHANGE_NEGATIVE, _("Decrease (-)"))
    )
    SEPARATOR = ','

    ONSCOPE_MARGIN = .15

    OLD_LEVELS = [
        (1, 'Goal'),
        (2, 'Impact'),
        (3, 'Outcome'),
        (4, 'Intermediate Outcome'),
        (5, 'Output'),
        (6, 'Activity')
    ]

    QUALITY_ASSURANCE_CHOICES = [
        # Translators:  describes a user-selectable option in a list of things that users can do to ensure program quality
        ('data_cleaning', _('Data cleaning and processing')),
        # Translators:  describes a user-selectable option in a list of things that users can do to ensure program quality
        ('data_collection', _('Data collection training and piloting')),
        # Translators:  describes a user-selectable option in a list of things that users can do to ensure program quality
        ('data_cross_checks', _('Data cross checks or triangulation of data sources')),
        # Translators:  describes a user-selectable option in a list of things that users can do to ensure program quality
        ('dqas', _('Data quality audits (DQAs)')),
        # Translators:  describes a user-selectable option in a list of things that users can do to ensure program quality
        ('data_spot_checks', _('Data spot checks')),
        # Translators:  describes a user-selectable option in a list of things that users can do to ensure program quality
        ('digital_data_collection', _('Digital data collection tools')),
        # Translators:  describes a user-selectable option in a list of things that users can do to ensure program quality
        ('external_evaluator', _('External evaluator or consultant')),
        # Translators:  describes a user-selectable option in a list of things that users can do to ensure program quality
        ('mixed_methods', _('Mixed methods')),
        # Translators:  describes a user-selectable option in a list of things that users can do to ensure program quality
        ('participatory_data_analysis', _('Participatory data analysis validation')),
        # Translators:  describes a user-selectable option in a list of things that users can do to ensure program quality
        ('peer_reviews', _('Peer reviews or reproducibility checks')),
        # Translators:  describes a user-selectable option in a list of things that users can do to ensure program quality
        ('randomized_phone_calls', _('Randomized phone calls to respondents')),
        # Translators:  describes a user-selectable option in a list of things that users can do to ensure program quality
        ('randomized_visits', _('Randomized visits to respondents')),
        # Translators:  describes a user-selectable option in a list of things that users can do to ensure program quality
        ('regular_reviews', _('Regular indicator and data reviews')),
        # Translators:  describes a user-selectable option in a list of things that users can do to ensure program quality
        ('secure_data_storage', _('Secure data storage')),
        # Translators:  describes a user-selectable option in a list of things that users can do to ensure program quality
        ('shadow_audits', _('Shadow audits or accompanied supervision')),
        # Translators:  describes a user-selectable option in a list of things that users can do to ensure program quality
        ('standardized_indicators', _('Standardized indicators')),
        # Translators:  describes a user-selectable option in a list of things that users can do to ensure program quality
        ('sops', _('Standard operating procedures (SOPs) or protocols')),
    ]

    INFORMATION_USE_CHOICES = [
        # Translators:  describes a user-selectable option in a list of things that users plan to do with the information gathered while the program is running
        ('donor_reporting', _('Donor and/or stakeholder reporting')),
        # Translators:  describes a user-selectable option in a list of things that users plan to do with the information gathered while the program is running
        ('internal_program_management', _('Internal program management and learning')),
        # Translators:  describes a user-selectable option in a list of things that users plan to do with the information gathered while the program is running
        ('participant_accountability', _('Participant accountability'))
    ]



    indicator_key = models.UUIDField(
        default=uuid.uuid4, help_text=" ", verbose_name=_("Indicator key"))

    # i.e. Alpha, Donor, Standard
    # TODO: make this a foreign key
    indicator_type = models.ManyToManyField(
        IndicatorType, blank=True, verbose_name=_("Indicator type"),
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("Classifying indicators by type allows us to filter and analyze related sets of indicators.")
    )

    # the Log Frame level (i.e. Goal, Output, Outcome, etc.)
    level = models.ForeignKey(
        Level, blank=True, null=True, verbose_name=_("Level"),
        on_delete=models.SET_NULL,
        # Translators: this is help text for a drop down select menu on an indicator setup form
        help_text=_("Select the result this indicator is intended to measure.")
    )

    # ordering with respect to level (determines whether indicator is 1.1a 1.1b or 1.1c)
    level_order = models.IntegerField(default=0)

    # this includes a relationship to a program
    objectives = models.ManyToManyField(
        Objective, blank=True, verbose_name=_("Program Objective"),
        related_name="obj_indicator", help_text=" "
    )

    # this includes a relationship to a country
    strategic_objectives = models.ManyToManyField(
        StrategicObjective, verbose_name=_("Country Strategic Objective"),
        blank=True, related_name="strat_indicator",
        # Translators: this is help text for a menu area on an indicator setup form where objectives are selected
        help_text=_("Identifying the country strategic objectives to which an indicator contributes, allows us to "
                    "filter and analyze related sets of indicators. Country strategic objectives are managed by the "
                    "TolaData country administrator.")
    )

    name = models.CharField(verbose_name=_("Name"), max_length=500, null=False,
                            # Translators: this is help text for a field on an indicator setup form
                            help_text=_("Provide an indicator statement of the precise information needed "
                                        "to assess whether intended changes have occurred."))

    number = models.CharField(
        # Translators: this is the label for a form field where the user enters the "number" identifying an indicator
        _("Number"), max_length=255, null=True, blank=True, help_text=" "
    )

    source = models.CharField(
        # Translators: field label for entering which standardized list the indicator was chosen from
        _("Source"), max_length=255, null=True, blank=True,
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("Identify the source of this indicator (e.g. Mercy Corps DIG, EC, USAID, etc.) If the indicator "
                    "is brand new and created specifically for the program, enter &ldquo;Custom.&rdquo;")
    )

    definition = models.TextField(
        # Translators: field label for entering the extended explanation of the indicator
        _("Definition"), null=True, blank=True,
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("Provide a long-form definition of the indicator and all key terms that need further detail for "
                    "precise and reliable measurement. Anyone reading the definition should understand exactly what "
                    "the indicator is measuring without any ambiguity.")
    )

    justification = models.TextField(
        max_length=500, null=True, blank=True,
        verbose_name=_("Rationale or justification for indicator"),
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("Explain why the indicator was chosen for this program.")
    )

    unit_of_measure = models.CharField(
        max_length=135, null=True, blank=True,
        verbose_name=_("Unit of measure"),
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("Enter a meaningful description of what the indicator uses as its standard unit "
                    "(e.g. households, kilograms, kits, participants, etc.)")
    )

    unit_of_measure_type = models.IntegerField(
        blank=False, null=True, choices=UNIT_OF_MEASURE_TYPES,
        default=NUMBER, verbose_name=_("Unit Type"),
        # Translators: this is help text for a user selecting "percentage" or "numeric" as the measurement type
        help_text=_("This selection determines how results are calculated and displayed.")
    )

    # this helptext is duplicated in forms.py because of the wacky way we currently do disaggregations, if
    # you update the help_text, update in both places
    disaggregation = models.ManyToManyField(
        DisaggregationType, blank=True, verbose_name=_("Disaggregation"),
        # Translators: this is help text for a menu area where disaggregations (by age, gender, etc.) are selected
        help_text=_("Select all relevant disaggregations. Disaggregations are managed by the TolaData country "
                    "administrator. Mercy Corps required disaggregations (e.g. SADD) are selected by default, but "
                    "can be deselected when they are not applicable to the indicator.")
    )

    baseline = models.CharField(
        verbose_name=_("Baseline"), max_length=255, null=True, blank=True,
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("Enter a numeric value for the baseline. If a baseline is not yet known or not applicable, "
                    "enter a zero or select the &ldquo;Not applicable&rdquo; checkbox. The baseline can always "
                    "be updated at later point in time.")
    )

    baseline_na = models.BooleanField(
        verbose_name=_("Not applicable"), default=False, help_text=" "
    )

    lop_target = models.DecimalField(
        blank=True, decimal_places=2, help_text=b' ',
        max_digits=20, null=True, verbose_name=_('Life of Program (LoP) target'))

    direction_of_change = models.IntegerField(
        blank=False, null=True, choices=DIRECTION_OF_CHANGE,
        default=DIRECTION_OF_CHANGE_NONE, verbose_name=_("Direction of Change"),
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("Is your program trying to achieve an increase (+) or decrease (-) in the indicator's "
                    "unit of measure? This field is important for the accuracy of our &ldquo;indicators on "
                    "track&rdquo; metric. For example, if we are tracking a decrease in cases of malnutrition, we "
                    "will have exceeded our indicator target when the result is lower than the target.")
    )

    is_cumulative = models.NullBooleanField(
        blank=False, verbose_name=_("C / NC"), help_text=" "
    )

    rationale_for_target = models.TextField(
        _("Rationale for target"), max_length=500, null=True, blank=True,
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("Provide an explanation for any target value/s assigned to this indicator. You might "
                    "include calculations and any historical or secondary data sources used to estimate targets.")
    )

    target_frequency = models.IntegerField(
        blank=False, null=True, choices=TARGET_FREQUENCIES,
        verbose_name=_("Target frequency"),
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("This selection determines how the indicator's targets and results are organized and displayed. "
                    "Target frequencies will vary depending on how frequently the program needs indicator data to "
                    "properly manage and report on program progress.")
    )

    # Deprecated - redundant to the event name of the first PeriodicTarget saved by the form
    target_frequency_custom = models.CharField(
        null=True, blank=True, max_length=100,
        verbose_name=_("First event name"), help_text=" "
    )

    # Deprecated - can probably be safely deleted
    target_frequency_start = models.DateField(
        blank=True, null=True, auto_now=False, auto_now_add=False,
        verbose_name=_("First target period begins*"), help_text=" "
    )

    target_frequency_num_periods = models.IntegerField(
        blank=True, null=True, verbose_name=_("Number of target periods*"),
        help_text=" "
    )

    means_of_verification = models.TextField(
        max_length=1500, null=True, blank=True, verbose_name=_("Means of verification / data source"),
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("Identify the source of indicator data and the tools used to collect data (e.g., surveys, "
                    "checklists, etc.) Indicate whether these tools already exist or will need to be developed.")
    )

    data_collection_method = models.TextField(
        max_length=2500, null=True, blank=True, verbose_name=_("Data collection method"),
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("Explain the process used to collect data (e.g., population-based sampling with randomized "
                    "selection, review of partner records, etc.) Explain how the means of verification or data "
                    "sources will be collected. Describe the methodological approaches the indicator will apply "
                    "for data collection.")
    )

    data_collection_frequencies = models.ManyToManyField(
        DataCollectionFrequency, related_name='indicators', blank=True,
        verbose_name=_("Frequency of data collection"),
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("How frequently will you collect data for this indicator? The frequency and timing of data "
                    "collection should be based on how often data are needed for management purposes, the cost of "
                    "data collection, and the pace of change anticipated. If an indicator requires multiple data "
                    "sources collected at varying frequencies, then it is recommended to select the frequency at "
                    "which all data will be collected for calculation.")
    )

    data_points = models.TextField(
        max_length=1000, null=True, blank=True, verbose_name=_("Data points"),
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("List all data points required for reporting. While some indicators require a single data point "
                    "(# of students attending training), others require multiple data points for calculation. "
                    "For example, to calculate the % of students graduated from a training course, the two data "
                    "points would be # of students graduated (numerator) and # of students enrolled (denominator).")
    )

    responsible_person = models.TextField(
        max_length=500, null=True, blank=True, verbose_name=_("Responsible person(s) and team"),
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("List the people or team(s) responsible for data collection. This can include community "
                    "volunteers, program team members, local partner(s), enumerators, consultants, etc.")
    )

    method_of_analysis = models.TextField(
        max_length=4000, null=True, blank=True, verbose_name=_("Method of analysis"),
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("The method of analysis should be detailed enough to allow an auditor or third party to "
                    "reproduce the analysis or calculation and generate the same result.")
    )

    information_use = models.TextField(
        max_length=500, null=True, blank=True, verbose_name=_("Information use"),
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("Describe the primary uses of the indicator and its intended audience. This is the most important "
                    "field in an indicator plan, because it explains the utility of the indicator. If an indicator "
                    "has no clear informational purpose, then it should not be tracked or measured. By articulating "
                    "who needs the indicator data, why and what they need it for, teams ensure that only useful "
                    "indicators are included in the program.")
    )

    reporting_frequencies = models.ManyToManyField(
        ReportingFrequency, related_name='indicators', blank=True,
        verbose_name=_("Frequency of reporting"),
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("This frequency should make sense in relation to the data collection frequency and target "
                    "frequency and should adhere to any requirements regarding program, stakeholder, and/or donor "
                    "accountability and reporting.")
    )

    quality_assurance = models.TextField(
        max_length=500, null=True, blank=True, verbose_name=_("Data quality assurance details"),
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("Provide any additional details about how data quality will be ensured for this specific "
                    "indicator. Additional details may include specific roles and responsibilities of team members "
                    "for ensuring data quality and/or specific data sources to be verified, reviewed, or "
                    "triangulated, for example.")
    )

    quality_assurance_techniques = MultiSelectField(
        null=True, blank=True, verbose_name=_("Data quality assurance techniques"), choices=QUALITY_ASSURANCE_CHOICES,
        help_text=_("Select the data quality assurance techniques that will be applied to this specific indicator.")
    )

    data_issues = models.TextField(
        max_length=500, null=True, blank=True, verbose_name=_("Data issues"),
        # Translators: this is help text for a field on an indicator setup form
        help_text=_("List any limitations of the data used to calculate this indicator (e.g., issues with validity, "
                    "reliability, accuracy, precision, and/or potential for double counting.) Data issues can be "
                    "related to indicator design, data collection methods, and/or data analysis methods. Please be "
                    "specific and explain how data issues were addressed.")
    )

    indicator_changes = models.TextField(
        max_length=500, null=True, blank=True,
        verbose_name=_("Changes to indicator"), help_text=" "
    )

    comments = models.TextField(
        _("Comments"), max_length=4000, null=True, blank=True, help_text=" "
    )

    program = models.ForeignKey(
        Program, verbose_name=_("Program"),
        blank=True, null=True, on_delete=models.CASCADE,
    )

    sector = models.ForeignKey(
        Sector, null=True, blank=True, on_delete=models.SET_NULL, verbose_name=_("Sector"),
        # Translators: this is help text for a field on an indicator setup form where the user selects from a list
        help_text=_("Classifying indicators by sector allows us to filter and analyze related sets of indicators.")
    )

    external_service_record = models.ForeignKey(
        ExternalServiceRecord, verbose_name=_("External Service ID"),
        blank=True, null=True, on_delete=models.SET_NULL, help_text=" "
    )

    old_level = models.CharField(
        max_length=80, null=True, blank=True,
        # Translators: This is the name of the Level object in the old system of organising levels
        verbose_name=_("Old Level"), help_text=" "
    )

    create_date = models.DateTimeField(
        _("Create date"), null=True, blank=True, help_text=" "
    )

    edit_date = models.DateTimeField(
        _("Edit date"), null=True, blank=True, help_text=" "
    )

    # optimize query for class based views etc.
    objects = IndicatorManager()
    rf_aware_objects = generate_safedelete_queryset(
        IndicatorRFMixin,
        IndicatorLevelsMixin,
        IndicatorTargetsMixin,
        ).as_manager()

    program_page_objects = generate_safedelete_queryset(
        IndicatorRFMixin,
        IndicatorLevelsMixin,
        IndicatorTargetsMixin,
        IndicatorMetricsMixin,
        ).as_manager()

    class Meta:
        ordering = ('create_date',)
        verbose_name = _("Indicator")
        unique_together = ['level', 'level_order', 'deleted']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()
        if self.level and self.level.program_id != self.program_id:
            raise ValidationError(
                # Translators: This is an error message that is returned when a user is trying to assign an indicator to the wrong hierarch of levels.
                _('Level/Indicator mismatched program IDs ' +
                  '(level %(level_program_id)d and indicator %(indicator_program_id)d)'),
                code='foreign_key_constraint',
                params={
                    'level_program_id': self.level.program_id,
                    'indicator_program_id': self.program_id
                })
        super(Indicator, self).save(*args, **kwargs)

    @property
    def is_target_frequency_time_aware(self):
        return self.target_frequency in self.REGULAR_TARGET_FREQUENCIES

    @property
    def is_target_frequency_not_time_aware(self):
        return self.target_frequency in self.IRREGULAR_TARGET_FREQUENCIES

    @property
    def is_target_frequency_lop(self):
        return self.target_frequency == self.LOP

    @property
    def is_event_target_frequency(self):
        return self.target_frequency == self.EVENT

    @property
    def is_mid_end_target_frequency(self):
        return self.target_frequency == self.MID_END

    @property
    def just_created(self):
        if self.create_date >= timezone.now() - timedelta(minutes=5):
            return True
        return False

    @property
    def name_clean(self):
        return self.name.encode('ascii', 'ignore')

    @property
    def objectives_list(self):
        return ', '.join([x.name for x in self.objectives.all()])

    @property
    def strategicobjectives_list(self):
        return ', '.join([x.name for x in self.strategic_objectives.all()])

    @property
    def programs(self):
        return ', '.join([x.name for x in self.program.all()])

    @property
    def indicator_types(self):
        return ', '.join([x.indicator_type for x in self.indicator_type.all()])

    @property
    def disaggregations(self):
        disaggregations = self.disaggregation.all()
        return self.SEPARATOR.join([x.disaggregation_type for x in disaggregations])

    @property
    def key_performance_indicator(self):
        """transition method for key_performance_indicator field removal - may cause unnecessary db calls"""
        return self.indicator_type.filter(indicator_type="Key Performance Indicator (KPI)").exists()

    @property
    def logged_fields(self):
        """
        If you change the composition of this property you may also want to update the logged_field_order property.
        """
        s = self
        return {
            "name": s.name.strip(),
            "unit_of_measure": s.unit_of_measure.strip() if s.unit_of_measure else s.unit_of_measure,
            "unit_of_measure_type": s.unit_of_measure_type,
            "is_cumulative": s.is_cumulative,
            "lop_target": s.lop_target,
            "direction_of_change": s.direction_of_change,
            "baseline_value": s.baseline.strip() if s.baseline else s.baseline,
            "baseline_na": s.baseline_na,
            "targets": {
                t.id: {
                    "id": t.id,
                    "value": t.target_display_str,
                    "name": t.period_name.strip(),
                }
                for t in s.periodictargets.all()
            },
            "level": str(s.level.display_number) if s.level is not None else '',
            "definition": s.definition,
            "means_of_verification": s.means_of_verification,
            "data_collection_method": s.data_collection_method,
            "method_of_analysis": s.method_of_analysis
        }

    @staticmethod
    def logged_field_order():
        """
        This list determines the order in which result fields will be displayed in the change log.  Because it
        represents all fields that have ever been used in the Result form change log, it should never be
        shrunk, only expanded or reordered.
        """
        return [
            'name', 'definition', 'level', 'unit_of_measure', 'unit_of_measure_type', 'baseline_value',
            'baseline_na', 'direction_of_change', 'targets', 'lop_target', 'is_cumulative',
            'means_of_verification', 'data_collection_method', 'method_of_analysis',
        ]

    @property
    def get_target_frequency_label(self):
        if self.target_frequency:
            #  Need to lowercase the first letter to allow for word rearrangements due to translations.
            label = Indicator.TARGET_FREQUENCIES[self.target_frequency-1][1]
            label = label[0].lower() + label[1:]
            return label
        return None

    @property
    def get_unit_of_measure_type(self):
        if self.unit_of_measure_type == self.NUMBER:
            return _("#")
        elif self.unit_of_measure_type == self.PERCENTAGE:
            return _("%")
        return ""

    @property
    def is_cumulative_display(self):
        """Deprecated?  Could not find where this was used, but text is updated in both
        setup form and IPTT to read "Non-cumulative" """
        if self.is_cumulative:
            # Translators: referring to an indicator whose results accumulate over time
            return _("Cumulative")
        elif self.is_cumulative is None:
            return None
        else:
            # Translators: referring to an indicator whose results do not accumulate over time
            return _("Not cumulative")

    @property
    def get_direction_of_change(self):
        if self.direction_of_change == self.DIRECTION_OF_CHANGE_NEGATIVE:
            return _("-")
        elif self.direction_of_change == self.DIRECTION_OF_CHANGE_POSITIVE:
            return _("+")
        return None

    @property
    def get_result_average(self):
        avg = self.result_set.aggregate(models.Avg('achieved'))['achieved__avg']
        return avg

    @property
    def baseline_display(self):
        if self.baseline and self.unit_of_measure_type == self.PERCENTAGE:
            return u"{0}%".format(self.baseline)
        return self.baseline

    @property
    def calculated_lop_target(self):
        """
        We have always manually set the LoP target of an indicator manually via form input
        but now we are starting to compute it based on the PeriodicTarget values.

        This property returns the calculated value, which may be different than the stored value in the DB
        """
        periodic_targets = self.periodictargets.all()

        if not periodic_targets.exists():
            return None

        if self.is_cumulative:
            # return the last value in the sequence
            return periodic_targets.last().target
        else:
            # sum the values
            return sum(pt.target for pt in periodic_targets)

    @property
    def lop_target_stripped(self):
        """adding logic to strip trailing zeros in case of a decimal with superfluous zeros to the right of the ."""
        if self.lop_target:
            lop_stripped = str(self.lop_target)
            lop_stripped = lop_stripped.rstrip('0').rstrip('.') if '.' in lop_stripped else lop_stripped
            return lop_stripped
        return self.lop_target

    @property
    def lop_target_display(self):
        """Same as lop_target_stripped but with a trailing % if applicable"""
        if self.lop_target:
            lop_stripped = self.lop_target_stripped
            if self.unit_of_measure_type == self.PERCENTAGE:
                return u"{0}%".format(lop_stripped)
            return lop_stripped
        return self.lop_target

    def current_periodic_target(self, date_=None):
        """
        Return the periodic target with start/end date containing localdate() or specified date

        :return: A PeriodicTarget with start_date and end_date containing now(), or None
        if no PeriodicTargets are found matching that criteria such as MIDLINE/ENDLINE
        """
        today = date_ or timezone.localdate()
        return self.periodictargets.filter(start_date__lte=today, end_date__gte=today).first()

    @property
    def last_ended_periodic_target(self):
        """
        Returns the last periodic target if any, or None
        """
        return self.periodictargets.filter(end_date__lte=timezone.localdate()).last()

    @cached_property
    def cached_data_count(self):
        return self.result_set.count()

    @cached_property
    def leveltier_name(self):
        if self.level and self.level.leveltier:
            return _(self.level.leveltier.name)
        elif self.old_level and not self.results_framework:
            return _(self.old_level)
        return None

    @property
    def level_display_ontology(self):
        if self.level:
            return self.level.display_ontology
        return None

    @cached_property
    def leveltier_depth(self):
        if self.level:
            return self.level.level_depth
        return None

    @property
    def level_pk(self):
        if self.level:
            return self.level_id
        return None

    @property
    def level_order_display(self):
        """returns a-z for 0-25, then aa - zz for 26-676"""
        if self.level and self.level_order is not None and self.level_order < 26:
            return string.ascii_lowercase[int(self.level_order)]
        elif self.level and self.level_order and self.level_order >= 26:
            return string.ascii_lowercase[self.level_order // 26 - 1] + string.lowercase[self.level_order % 26]
        return ''

    @cached_property
    def number_display(self):
        if self.results_framework and self.auto_number_indicators and self.level and self.level.leveltier:
            return u'{0} {1}{2}'.format(
                str(self.leveltier_name), self.level.display_ontology, self.level_order_display
            )
        elif self.results_framework and not self.program.auto_number_indicators:
            return self.number
        elif self.results_framework:
            return None
        else:
            return self.number

    @property
    def form_title_level(self):
        if self.results_framework:
            return str(
                u'{} {}{}'.format(
                    str(self.leveltier_name) if self.leveltier_name else u'',
                    str(_('indicator')),
                    (u' {}'.format(self.results_aware_number) if self.results_aware_number else u'')
                )
            )
        else:
            return u'{} {}'.format(
                (str(_(self.old_level)) if self.old_level else u''),
                str(_('indicator'))
            )

    @property
    def results_aware_number(self):
        if self.results_framework and self.program.auto_number_indicators:
            return '{}{}'.format(self.level_display_ontology or '', self.level_order_display or '')
        else:
            return self.number

    @property
    def results_framework(self):
        if hasattr(self, 'using_results_framework'):
            return self.using_results_framework
        elif hasattr(self.program, 'using_results_framework'):
            return self.program.using_results_framework
        return self.program._using_results_framework != Program.NOT_MIGRATED

    @property
    def auto_number_indicators(self):
        if hasattr(self, '_auto_number_indicators'):
            return self._auto_number_indicators
        return self.program.auto_number_indicators

    @property
    def sort_number(self):
        number = getattr(self, 'number')
        if number is None or number == '':
            return Max
        search_pattern = r'([^\d]+)?(\d+)?(.*)?'
        number_search = re.compile(search_pattern)
        split = number.split('.')
        processed = []
        for element in split:
            matches = number_search.search(element)
            if matches is None:
                processed.append((Max, Max, Max))
            else:
                groups = matches.groups()
                processed.append((
                    groups[0] if groups[0] else Max,
                    int(groups[1]) if groups[1] else Max,
                    groups[2] if groups[2] else Min
                    ))
        return processed


@receiver(signals.pre_save, sender=Indicator)
def new_level_order(sender, instance, *args, **kwargs):
    try:
        original = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        # new indicator being created:
        if instance.level:
            # if the new indicator is being created with a level, give it a new sort order:
            instance.level_order = instance.level.next_sort_order
    else:
        # if the level didn't change, do nothing:
        if instance.level and original.level and instance.level.pk == original.level.pk:
            pass
        else:
            if instance.level:
                instance.level_order = instance.level.next_sort_order
            if original.level:
                # hang the original level pk on the instance for catching in the post save signal below:
                instance.old_level_pk = original.level.pk


@receiver(signals.post_save, sender=Indicator)
def reorder_former_level_on_update(sender, update_fields, created, instance, **kwargs):
    old_level_pk = getattr(instance, 'old_level_pk', None)
    if old_level_pk:
        try:
            level = Level.objects.get(pk=old_level_pk)
        except Level.DoesNotExist:
            pass
        else:
            level.update_level_order()
    elif instance.deleted and instance.level:
        # indicator is being deleted, reorder it's levels
        instance.level.update_level_order()


class PeriodicTarget(models.Model):
    LOP_PERIOD = _('Life of Program (LoP) only')
    LOP_LABEL = _('Life of Program')
    MIDLINE = _('Midline')
    ENDLINE = _('Endline')
    ANNUAL_PERIOD = _('Year')
    SEMI_ANNUAL_PERIOD = _('Semi-annual period')
    TRI_ANNUAL_PERIOD = _('Tri-annual period')
    QUARTERLY_PERIOD = _('Quarter')

    indicator = models.ForeignKey(
        Indicator, null=False, blank=False, on_delete=models.CASCADE,
        verbose_name=_("Indicator"), related_name="periodictargets"
    )

    # This field should never be referenced directly in the UI! See period_name below.
    period = models.CharField(
        _("Period"), max_length=255, null=True, blank=True
    )

    target = models.DecimalField(
        _("Target"), max_digits=20, decimal_places=2, default=Decimal('0.00'), validators=[MinValueValidator(Decimal('0.0'))]
    )

    start_date = models.DateField(
        _("Start date"), auto_now=False, auto_now_add=False, null=True,
        blank=True
    )

    end_date = models.DateField(
        _("End date"), auto_now=False, auto_now_add=False, null=True,
        blank=True
    )

    customsort = models.IntegerField(_("Customsort"), default=0)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        ordering = ('customsort', '-create_date')
        verbose_name = _("Periodic Target")
        unique_together = (('indicator', 'customsort'),)

    @property
    def target_display_str(self):
        """Return str of target decimal value, rounded if a whole number"""
        s = str(self.target)
        return s.rstrip('0').rstrip('.') if '.' in s else s

    @staticmethod
    def generate_monthly_period_name(start_date):
        return django.template.defaultfilters.date(start_date, 'F Y')

    @staticmethod
    def generate_event_period_name(event_name):
        return event_name

    @classmethod
    def generate_midline_period_name(cls):
        return cls.MIDLINE

    @classmethod
    def generate_endline_period_name(cls):
        return cls.ENDLINE

    @classmethod
    def generate_lop_period_name(cls):
        return cls.LOP_PERIOD

    @classmethod
    def generate_annual_quarterly_period_name(cls, target_frequency, period_seq_num):
        target_frequency_to_period_name = {
            Indicator.ANNUAL: cls.ANNUAL_PERIOD,
            Indicator.SEMI_ANNUAL: cls.SEMI_ANNUAL_PERIOD,
            Indicator.TRI_ANNUAL: cls.TRI_ANNUAL_PERIOD,
            Indicator.QUARTERLY: cls.QUARTERLY_PERIOD,
        }

        period_name = target_frequency_to_period_name.get(target_frequency)

        if period_name is None:
            raise Exception('Invalid target_frequency passed to generate_annual_quarterly_period_name()')

        return u"{period_name} {period_number}".format(
            period_name=period_name,
            period_number=period_seq_num,
        )

    @property
    def has_ended(self):
        """ returns whether the target period is considered 'ended" for purposes of aggregating e.g. in gauges """
        try:
            if self.indicator.is_target_frequency_time_aware: # for annual, semi/tri-annual, quarterly, monthly
                return self.end_date < timezone.localdate()
            elif self.indicator.target_frequency == Indicator.LOP: # LOP target ends when the program does
                return self.indicator.program.reporting_period_end < timezone.localdate()
            elif self.indicator.target_frequency in (Indicator.EVENT, Indicator.MID_END):
                # these are always included in aggregated results so they are always considered "ended"
                return True
            else:
                return False
        except TypeError: # some edge cases for time-aware targets created without dates
                return False

    @property
    def period_name(self):
        """returns a period name translated to the local language.
            - LOP target: see target definition above,
            - MID/END: uses customsort to pick from definitions above
            - ANNUAL/SEMI_ANNUAL/TRI_ANNUAL/QUARTERLY: "Year 1" / "Semi-Annual Period 2" / "Quarter 4"
            - MONTHLY: "Jan 2018"
            - EVENT: this (and only this) uses the 'period' field and customsort to be "period name 1"
        """
        target_frequency = self.indicator.target_frequency

        # used in the result modal to display options in the target period dropdown
        if target_frequency == Indicator.MID_END:
            # midline is the translated "midline" or "endline" based on customsort
            return self.generate_midline_period_name() if self.customsort == 0 else self.generate_endline_period_name()
        if target_frequency == Indicator.LOP:
            # lop always has translated lop value
            return self.generate_lop_period_name()

        # use locale specific month names
        if target_frequency == Indicator.MONTHLY:
            return self.generate_monthly_period_name(self.start_date)

        # Do nothing for events
        if target_frequency == Indicator.EVENT:
            return self.generate_event_period_name(self.period)

        # for time-based frequencies get translated name of period:
        return self.generate_annual_quarterly_period_name(target_frequency, self.customsort + 1)

    def __str__(self):
        """outputs the period name (see period_name docstring) followed by start and end dates

        used in result form"""
        period_name = self.period_name

        if period_name and self.start_date and self.end_date:
            # e.g "Year 1 (date - date)" or "Quarter 2 (date - date)"
            return u"{period_name} ({start_date} - {end_date})".format(
                period_name=period_name,
                start_date=l10n_date_medium(self.start_date).decode('utf-8'),
                end_date=l10n_date_medium(self.end_date).decode('utf-8'),
            )
        elif period_name:
            # if no date for some reason but time-based frequency:
            return str(period_name)

        return self.period

    @classmethod
    def generate_for_frequency(cls, frequency, short_form=False):
        """
        Returns a generator function to yield periods based on start and end dates for a given frequency

        WARNING: This function as it stands can return either a str() or a unicode() depending on the `frequency`

        It returns a str() in the case of:

            * ANNUAL
            * MONTHLY
            * SEMI_ANNUAL_PERIOD
            * TRI_ANNUAL_PERIOD
            * QUARTERLY_PERIOD

        It returns unicode() in the case of:

            * LOP_PERIOD
            * MID_END

        It's unclear how some of these ''.format() works, as some params are gettext_lazy() (unicode) values containing
        non-ASCII chars being plugged into a non-unicode string. This normally crashes but for some reason it works here.

        An example of something that crashes in the REPL but seemingly works here when using ugettext_lazy():

            '{year}'.format(year=u'Año')

        It's my hope one day to find out how this works, but for now I would be happy with this just returning unicode
        for all cases as a consolation prize
        """
        months_per_period = {
            Indicator.SEMI_ANNUAL: 6,
            Indicator.TRI_ANNUAL: 4,
            Indicator.QUARTERLY: 3,
            Indicator.MONTHLY: 1
        }
        if frequency == Indicator.ANNUAL:
            next_date_func = lambda x: date(x.year + 1, x.month, 1)
            name_func = lambda start, count: u'{period_name} {count}'.format(
                period_name=_(cls.ANNUAL_PERIOD), count=count)
        elif frequency in months_per_period:
            next_date_func = lambda x: date(
                x.year if x.month <= 12-months_per_period[frequency] else x.year + 1,
                x.month + months_per_period[frequency] if x.month <= 12 - months_per_period[frequency] \
                else x.month + months_per_period[frequency] - 12,
                1)
            if frequency == Indicator.MONTHLY:
                # TODO: strftime() does not work with Django i18n and will not give you localized month names
                # Could be: name_func = lambda start, count: cls.generate_monthly_period_name(start)
                # the above breaks things in other places though due to unicode encoding/decoding errors
                # UPDATE: Turns out the below still translates... strftime() still returns an english
                # month name, but since month names are translated elsewhere in the app, the _() turns it into
                # the correct language
                name_func = lambda start, count: u'{month_name} {year}'.format(
                    month_name=_(start.strftime('%B')),
                    year=start.strftime('%Y')
                    )
            else:
                period_name = {
                    Indicator.SEMI_ANNUAL: cls.SEMI_ANNUAL_PERIOD,
                    Indicator.TRI_ANNUAL: cls.TRI_ANNUAL_PERIOD,
                    Indicator.QUARTERLY: cls.QUARTERLY_PERIOD
                }[frequency]
                name_func = lambda start, count: u'{period_name} {count}'.format(
                    period_name=_(period_name), count=count)
        elif frequency == Indicator.LOP:
            return lambda start, end: [{
                'name': _(cls.LOP_LABEL),
                'start': start,
                'label': None,
                'end': end,
                'customsort': 0
                }]
        elif frequency == Indicator.MID_END:
            return lambda start, end: [
                {'name': _(cls.MIDLINE),
                 'start': start,
                 'label': None,
                 'end': end,
                 'customsort': 0},
                {'name': _(cls.ENDLINE),
                 'start': start,
                 'label': None,
                 'end': end,
                 'customsort': 1}
            ]
        else:
            next_date_func = None
            name_func = None

        def short_form_generator(start, end):
            count = 0
            while start < end:
                next_start = next_date_func(start)
                yield {
                    'start': start,
                    'end': end,
                    'customsort': count
                }
                count += 1
                start = next_start
        if short_form:
            return short_form_generator

        def period_generator(start, end):
            count = 0
            while start < end:
                next_start = next_date_func(start)
                yield {
                    'name': name_func(start, count+1),
                    'start': start,
                    'label': u'{0} – {1}'.format(
                        l10n_date_medium(start).decode('UTF-8'),
                        l10n_date_medium(next_start - timedelta(days=1)).decode('UTF-8')
                        ) if frequency != Indicator.MONTHLY else None,
                    'end': next_start - timedelta(days=1),
                    'customsort': count
                }
                count += 1
                start = next_start
        return period_generator


class PeriodicTargetAdmin(admin.ModelAdmin):
    list_display = ('period', 'target', 'customsort',)
    display = 'Indicator Periodic Target'
    list_filter = ('period',)


class ResultManager(models.Manager):
    def get_queryset(self):
        return super(ResultManager, self).get_queryset().prefetch_related(
            'site'
        ).select_related('program', 'indicator')


class Result(models.Model):
    data_key = models.UUIDField(
        default=uuid.uuid4, unique=True, help_text=" ", verbose_name=_("Data key")),

    periodic_target = models.ForeignKey(
        PeriodicTarget, null=True, blank=True, on_delete=models.SET_NULL, help_text=" ",
        verbose_name=_("Periodic target")
    )

    achieved = models.DecimalField(
        verbose_name=_("Actual"), max_digits=20, decimal_places=2,
        help_text=" ")

    comments = models.TextField(_("Comments"), blank=True, default='')

    indicator = models.ForeignKey(
        Indicator, help_text=" ", on_delete=models.CASCADE, verbose_name=_("Indicator"),
        db_index=True
    )

    # TODO: this should be deprecated as it duplicates the indicator__program link (with potentially conflicting data)
    program = models.ForeignKey(
        Program, blank=True, null=True, on_delete=models.SET_NULL, related_name="i_program",
        help_text=" ", verbose_name=_("Program"))

    date_collected = models.DateField(
        null=True, blank=True, help_text=" ", verbose_name=_("Date collected"))

    approved_by = models.ForeignKey(
        TolaUser, blank=True, null=True, on_delete=models.SET_NULL, verbose_name=_("Originated By"),
        related_name="approving_data", help_text=" ")

    record_name = models.CharField(max_length=135, null=True, blank=True, verbose_name=_("Record name"))
    evidence_url = models.CharField(max_length=255, null=True, blank=True, verbose_name=_("Evidence URL"))

    create_date = models.DateTimeField(null=True, blank=True, help_text=" ", verbose_name=_("Create date"))
    edit_date = models.DateTimeField(null=True, blank=True, help_text=" ", verbose_name=_("Edit date"))
    site = models.ManyToManyField(SiteProfile, blank=True, help_text=" ", verbose_name=_("Sites"))

    history = HistoricalRecords()
    objects = ResultManager()

    class Meta:
        ordering = ('indicator', 'date_collected')
        verbose_name_plural = "Indicator Output/Outcome Result"

    def __str__(self):
        return u'{}: {}'.format(self.indicator, self.periodic_target)

    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()
        super(Result, self).save()

    def achieved_sum(self):
        achieved = Result.targeted.filter(indicator__id=self)\
            .sum('achieved')
        return achieved

    @property
    def date_collected_formatted(self):
        # apparently unused?
        if self.date_collected:
            return formats.date_format(self.date_collected, "MEDIUM_DATE_FORMAT")
        return self.date_collected

    @property
    def disaggregated_values(self):
        return self.disaggregatedvalue_set.all().order_by(
            'category__disaggregation_type__standard',
            'category__disaggregation_type__disaggregation_type',
            'category__customsort'
        )

    @property
    def logged_fields(self):
        """
        If you change the composition of this property you may also want to update the logged_field_order property.
        """
        return {
            "id": self.id,
            "value": usefully_normalize_decimal(self.achieved),
            "date": self.date_collected,
            "target": self.periodic_target.period_name if self.periodic_target else 'N/A',
            "evidence_name": self.record_name,
            "evidence_url": self.evidence_url,
            "sites": ', '.join(site.name for site in self.site.all()) if self.site.exists() else '',
            "disaggregation_values": {
                dv.category.pk: {
                    "id": dv.category.pk,
                    "value": usefully_normalize_decimal(dv.value),
                    "name": dv.category.name,
                    "custom_sort": dv.category.customsort,
                    "type": dv.category.disaggregation_type.disaggregation_type,
                }
                for dv in self.disaggregated_values
            }
        }

    @staticmethod
    def logged_field_order():
        """
        This list determines the order in which result fields will be displayed in the change log.  Because it
        represents all fields that have ever been used in the Result form change log, it should never be
        shrunk, only expanded or reordered.
        """
        return [
            'id', 'date', 'target', 'value', 'disaggregation_values', 'evidence_url', 'evidence_name', 'sites']


class ResultAdmin(admin.ModelAdmin):
    list_display = ('indicator', 'date_collected', 'create_date', 'edit_date')
    list_filter = ['indicator__program__country__country']
    display = 'Indicator Output/Outcome Result'


class PinnedReport(models.Model):
    """
    A named IPTT report for a given program and user
    """
    name = models.CharField(max_length=50, verbose_name=_('Report Name'))
    tola_user = models.ForeignKey(TolaUser, on_delete=models.CASCADE)
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='pinned_reports')
    report_type = models.CharField(max_length=32)
    query_string = models.CharField(max_length=255)
    creation_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-creation_date']
        constraints = [
            models.UniqueConstraint(fields=['name', 'tola_user', 'program'], name='unique_pinned_report_name')
        ]

    def parse_query_string(self):
        return QueryDict(self.query_string)

    @property
    def report_url(self):
        """
        Return the fully parameterized IPTT report URL string
        """
        return "{}?{}".format(reverse('iptt_report', kwargs={
            'program': self.program_id,
            'reporttype': self.report_type
        }), self.query_string)

    @property
    def date_range_str(self):
        """
        A localized string showing the date range covered by the pinned report

        There are several types of pinned reports w/ regards to date ranges and report type:

          * A report with a fixed start/end date
            * Recent progress
            * Annual vs targets
          * A relative report (show previous N months/quarters/year relative to today)
            * Recent progress
            * Annual vs targets
          * Show all with a time period selected (annual/monthly)
            * Recent progress
            * Annual vs targets
          * Show all with LoP/Midline+Endline/Event
            * Annual vs targets

        Currently the query string is used to determine the date range type, and thus the returned string
        """
        qs = self.parse_query_string()

        start_period = qs.get('start_period')
        end_period = qs.get('end_period')

        time_frame = qs.get('timeframe')  # show all/most recent
        num_recent_periods = qs.get('numrecentperiods')  # "most recent" input
        time_periods = qs.get('timeperiods')  # quarters/months/years/etc (recent progress)
        target_periods = qs.get('targetperiods')  # LoP/Midline+Endline/Annual/Quarterly/etc (target vs actuals)

        df = lambda d: formats.date_format(dateparser.parse(d), 'MEDIUM_DATE_FORMAT')

        # Fixed start/end date
        if start_period and end_period:
            return u'{} – {}'.format(df(start_period), df(end_period))

        # from indicators.forms import ReportFormCommon

        # This is confusing but ReportFormCommon defines TIMEPERIODS_CHOICES
        # which is defined in terms of enum values in Indicators
        # Indicators also defines TARGET_FREQUENCIES which is also used by ReportFormCommon
        # Because of this, the enum values are interchangeable between ReportFormCommon and Indicators

        # Double-confusing update: reportform is now handled on front end, so the constants are
        # reproduced here:
        TIMEPERIODS_CHOICES = (
            (Indicator.ANNUAL, _("years")),
            (Indicator.SEMI_ANNUAL, _("semi-annual periods")),
            (Indicator.TRI_ANNUAL, _("tri-annual periods")),
            (Indicator.QUARTERLY, _("quarters")),
            (Indicator.MONTHLY, _("months"))
        )

        SHOW_ALL = 1
        MOST_RECENT = 2

        # TARGETPERIOD_CHOICES = [empty] +
        # TARGET_FREQUENCIES = (
        #     (LOP, _('Life of Program (LoP) only')),
        #     (MID_END, _('Midline and endline')),
        #     (ANNUAL, _('Annual')),
        #     (SEMI_ANNUAL, _('Semi-annual')),
        #     (TRI_ANNUAL, _('Tri-annual')),
        #     (QUARTERLY, _('Quarterly')),
        #     (MONTHLY, _('Monthly')),
        #     (EVENT, _('Event'))
        # )

        # time period strings are used for BOTH timeperiod and targetperiod values
        time_period_str_lookup = dict(TIMEPERIODS_CHOICES)

        time_or_target_period_str = None
        if time_periods:
            time_or_target_period_str = time_period_str_lookup.get(int(time_periods))
        if target_periods:
            time_or_target_period_str = time_period_str_lookup.get(int(target_periods))

        # A relative report (Recent progress || Target vs Actuals)
        if time_frame == str(MOST_RECENT) and num_recent_periods and time_or_target_period_str:
            #  Translators: Example: Most recent 2 Months
            return _('Most recent {num_recent_periods} {time_or_target_period_str}').format(
                num_recent_periods=num_recent_periods, time_or_target_period_str=time_or_target_period_str)

        # Show all (Recent progress || Target vs Actuals w/ time period (such as annual))
        if time_frame == str(SHOW_ALL) and time_or_target_period_str:
            # Translators: Example: Show all Years
            return _('Show all {time_or_target_period_str}').format(time_or_target_period_str=time_or_target_period_str)

        # Show all (Target vs Actuals LoP/Midline+End/Event)
        remaining_target_freq_set = {
            Indicator.LOP,
            Indicator.MID_END,
            Indicator.EVENT,
        }
        if time_frame == str(SHOW_ALL) and target_periods \
                and int(target_periods) in remaining_target_freq_set:
            return _('Show all results')

        # It's possible to submit bad input, but have the view "fix" it..
        if time_frame == str(MOST_RECENT) and num_recent_periods and not time_or_target_period_str:
            return _('Show all results')

        return ''


    @staticmethod
    def default_report(program_id):
        """
        Create a default hardcoded pinned report

        Shows recent progress for all indicators
        Does not exist in the DB
        """
        return PinnedReport(
            name=_('Recent progress for all indicators'),
            program_id=program_id,
            report_type='timeperiods',
            query_string='timeperiods=7&timeframe=2&numrecentperiods=2',
        )
