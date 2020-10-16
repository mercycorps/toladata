# -*- coding: utf-8 -*-

from django.db import models
from django.contrib import admin
from django.core.exceptions import SuspiciousOperation
from django.contrib.auth.models import User
from decimal import Decimal
import uuid

from django.utils.translation import ugettext_lazy as _

from django.conf import settings
from django.db.models import Count, Min, Subquery, OuterRef
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from tola.model_utils import generate_queryset
from simple_history.models import HistoricalRecords
from django.urls import reverse

try:
    from django.utils import timezone
except ImportError:
    from datetime import datetime as timezone

# New user created generate a token
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class Sector(models.Model):
    sector = models.CharField(_("Sector Name"), max_length=255, blank=True)
    create_date = models.DateTimeField(null=True, blank=True)
    edit_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = _("Sector")
        ordering = ('sector',)

    # on save add create date or update edit date
    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()
        super(Sector, self).save()

    # displayed in admin templates
    def __str__(self):
        return self.sector


class Organization(models.Model):
    MERCY_CORPS_ID = 1
    name = models.CharField(_("Organization Name"), max_length=255, blank=False, default="TolaData")
    description = models.TextField(_("Description/Notes"), max_length=765, null=True, blank=True)
    organization_url = models.CharField(_("Organization url"), blank=True, null=True, max_length=255)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    primary_address = models.CharField(_("Primary Address"), blank=False, null=True, max_length=255)
    primary_contact_name = models.CharField(_("Primary Contact Name"), blank=False, null=True, max_length=255)
    primary_contact_email = models.CharField(_("Primary Contact Email"), blank=False, null=True, max_length=255)
    primary_contact_phone = models.CharField(_("Primary Contact Phone"), blank=False, null=True, max_length=255)
    mode_of_contact = models.CharField(_("Primary Mode of Contact"), blank=True, null=True, max_length=255)
    is_active = models.BooleanField(default=1)
    sectors = models.ManyToManyField(Sector, related_name="organizations")

    class Meta:
        ordering = ('name',)
        verbose_name_plural = _("Organizations")
        app_label = 'workflow'

    # on save add create date or update edit date
    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()
        super(Organization, self).save()

    @property
    def logged_fields(self):
        o = self
        return {
            "name": o.name,
            "primary_address": o.primary_address,
            "primary_contact_name": o.primary_contact_name,
            "primary_contact_email": o.primary_contact_email,
            "primary_contact_phone": o.primary_contact_phone,
            "mode_of_contact": o.mode_of_contact,
            "is_active": o.is_active,
            "sectors": [sector.sector for sector in o.sectors.all()]
        }

    # displayed in admin templates
    def __str__(self):
        return self.name

    @classmethod
    def mercy_corps(cls):
        return cls.objects.get(pk=cls.MERCY_CORPS_ID)


class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'create_date', 'edit_date')
    display = 'Organization'


class Region(models.Model):
    name = models.CharField(_("Region Name"), max_length=255)
    gait_region_id = models.PositiveIntegerField(blank=True, null=True)


class Country(models.Model):
    country = models.CharField(_("Country Name"), max_length=255, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL,
                                     blank=True, null=True, verbose_name=_("organization"))
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, blank=True, null=True)
    code = models.CharField(_("2 Letter Country Code"), max_length=4, blank=True)
    description = models.TextField(_("Description/Notes"), max_length=765,blank=True)
    latitude = models.CharField(_("Latitude"), max_length=255, null=True, blank=True)
    longitude = models.CharField(_("Longitude"), max_length=255, null=True, blank=True)
    zoom = models.IntegerField(_("Zoom"), default=5)
    create_date = models.DateTimeField(_("Create date"), null=True, blank=True)
    edit_date = models.DateTimeField(_("Edit date"), null=True, blank=True)

    class Meta:
        ordering = ('country',)
        verbose_name_plural = _("Countries")
        app_label = 'workflow'

    # on save add create date or update edit date
    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()
        super(Country, self).save()

    # displayed in admin templates
    def __str__(self):
        return self.country

    @property
    def name(self):
        """Standardize Object.name as returning the object's name for all models"""
        return self.country

    @property
    def country_page(self):
        return reverse('index', kwargs={'selected_country': self.pk})

class TolaUser(models.Model):
    title = models.CharField(_("Title"), blank=True, null=True, max_length=50)
    name = models.CharField(_("Given Name"), blank=True, null=True, max_length=100)
    employee_number = models.IntegerField(_("Employee Number"), blank=True, null=True)
    user = models.OneToOneField(
        User, unique=True, null=True, related_name='tola_user', verbose_name=_("User"), on_delete=models.SET_NULL
    )
    organization = models.ForeignKey(
        Organization, null=True, on_delete=models.SET_NULL, verbose_name=_("Organization")
    )
    language = models.CharField(max_length=2, choices=settings.LANGUAGES, default='en')
    country = models.ForeignKey(Country, blank=True, null=True, on_delete=models.SET_NULL, verbose_name=_("Country"))
    active_country = models.ForeignKey(
        Country, blank=True, null=True, on_delete=models.SET_NULL,
        related_name='active_country', verbose_name=_("Active Country"))
    countries = models.ManyToManyField(
        Country,
        verbose_name=_("Accessible Countries"),
        related_name='users',
        blank=True,
        through='CountryAccess'
    )
    tables_api_token = models.CharField(blank=True, null=True, max_length=255)
    activity_api_token = models.CharField(blank=True, null=True, max_length=255)
    privacy_disclaimer_accepted = models.BooleanField(default=False)
    create_date = models.DateTimeField(null=True, blank=True)
    edit_date = models.DateTimeField(null=True, blank=True)
    mode_of_address = models.CharField(blank=True, null=True, max_length=255)
    mode_of_contact = models.CharField(blank=True, null=True, max_length=255)
    phone_number = models.CharField(blank=True, null=True, max_length=50)

    class Meta:
        verbose_name = _("Tola User")
        ordering = ('name',)

    def __str__(self):
        # Returning None breaks the Django Admin on models with a FK to TolaUser
        return self.name or u''

    @property
    def display_with_organization(self):
        if not self.organization:
            return str(self)
        return u'{0} ({1})'.format(self, self.organization)

    @property
    def countries_list(self):
        if self.organization_id != 1:
            return Country.objects.none()
        return ', '.join([x.code for x in self.countries.all()])


    def program_role(self, program_id):
        if self.user.is_superuser:
            return 'high'

        program = Program.objects.get(id=program_id)
        access_level = None

        for p_country in program.country.all():
            if p_country in self.countries.all():
                access_level = 'low'

        try:
            # Use the highest level role the user has for this program
            for access_grant in ProgramAccess.objects.filter(tolauser=self, program=program):
                if PROGRAM_ROLE_INT_MAP[access_grant.role] > PROGRAM_ROLE_INT_MAP[access_level]:
                    access_level = access_grant.role
        except Exception as e:
            print(e)
        return access_level

    @property
    def has_admin_management_access(self):
        #circular import avoidance
        from tola_management.permissions import (
            user_has_basic_or_super_admin
        )

        return user_has_basic_or_super_admin(self.user)

    # on save add create date or update edit date
    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()
        self.name = self.user.first_name + u' ' + self.user.last_name
        super(TolaUser, self).save()

    # update active country
    def update_active_country(self, country):
        self.active_country = country
        super(TolaUser, self).save()

    # generic has access function (countries, programs, etc.?  currently program_id implemented):
    def has_access(self, **kwargs):
        if 'program_id' in kwargs:
            return Program.objects.filter(
                country__in=self.countries.all()
                ).filter(pk=kwargs.get('program_id')).exists()
        return False

    @property
    def managed_countries(self):
        if self.user.is_superuser:
            return Country.objects.all()
        elif self.organization_id != 1:
            return Country.objects.none()
        else:
            return Country.objects.filter(
                id__in=self.countryaccess_set.filter(role='basic_admin').values('country_id')
            )

    @property
    def managed_programs(self):
        return Program.objects.filter(country__in=self.managed_countries)

    @property
    def available_countries(self):
        if self.user.is_superuser:
            return Country.objects.all()
        else:
            if self.country is not None:
                return (
                    self.countries.all()
                    | Country.objects.filter(id__in=ProgramAccess.objects.filter(tolauser=self).values('country_id'))
                    | Country.objects.filter(id=self.country.id)
                ).distinct()
            else:
                return (
                    self.countries.all()
                    | Country.objects.filter(id__in=ProgramAccess.objects.filter(tolauser=self).values('country_id'))
                ).distinct()

    @property
    def available_programs(self):
        if self.user.is_superuser:
            return Program.objects.all()
        else:
            if self.country is not None:
                return (
                    Program.objects.filter(country__in=self.countries.all())
                    | self.programs.all()
                    | self.country.program_set.all()
                ).distinct()
            else:
                return (
                    Program.objects.filter(country__in=self.countries.all())
                    | self.programs.all()
                ).distinct()

    @property
    def logged_fields(self):
        return {
            "title": self.title,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "user": self.user.username,
            "mode_of_address": self.mode_of_address,
            "mode_of_contact": self.mode_of_contact,
            "phone_number": self.phone_number,
            "email": self.user.email,
            "organization": self.organization.name if self.organization else _('No Organization for this user'),
            "active": self.user.is_active
        }

    @property
    def logged_program_fields(self):
        country_access = {}
        if self.country:
            country_access[self.country.id] = {"country": self.country.country, "role": 'user'}
            base_country = {"pk": self.country.pk, "country": self.country.country}
        else:
            base_country = {"pk": None, "country": None}
        country_access.update({
            access.country_id: {"country": access.country.country, "role": access.role}
            for access in self.countryaccess_set.all()
        })

        program_access = {
            (str(access.country_id)+'_'+str(access.program_id)): {
                "role": access.role,
                "program": access.program.name,
                "country": access.country.country
                }
            for access in self.programaccess_set.all()
        }

        return {
            "countries": country_access,
            "programs": program_access,
            "base_country": base_country,
        }

    @property
    def access_data(self):
        country_access = {}
        if self.country:
            country_access[self.country.id] = {"role": 'user'}
        country_access.update({
            country.country_id: {"role": country.role}
            for country in self.countryaccess_set.all()
        })

        program_access = [
            {"role": access.role, "program": access.program_id, "country": access.country_id}
            for access in self.programaccess_set.all()
        ]

        return {
            "countries": country_access,
            "programs": program_access
        }


COUNTRY_ROLE_CHOICES = (
    ('user', _('User (all programs)')),
    ('basic_admin', _('Basic Admin (all programs)')),
)

class CountryAccess(models.Model):
    tolauser = models.ForeignKey(TolaUser, on_delete=models.CASCADE)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    role = models.CharField(max_length=100, choices=COUNTRY_ROLE_CHOICES, default='user')

    def save(self, *args, **kwargs):
        #requirements that country access be given only to mercy corps users (id = 1)
        if self.id is None and self.tolauser.organization_id != 1:
            raise SuspiciousOperation(_("Only Mercy Corps users can be given country-level access"))
        super(CountryAccess, self).save(*args, **kwargs)

    class Meta:
        db_table = 'workflow_tolauser_countries'
        unique_together = ('tolauser', 'country')


class TolaUserProxy(TolaUser):

    class Meta:
        verbose_name, verbose_name_plural = u"Report Tola User", u"Report Tola Users"
        proxy = True


class CountryAccessInline(admin.TabularInline):
    model = CountryAccess
    ordering = ('country',)

class TolaUserAdmin(admin.ModelAdmin):

    list_display = ('name', 'country')
    display = 'Tola User'
    list_filter = ('country', 'user__is_staff',)
    search_fields = ('name', 'country__country', 'title')
    inlines = (CountryAccessInline, )


class SectorAdmin(admin.ModelAdmin):
    list_display = ('sector', 'create_date', 'edit_date')
    display = 'Sector'


class ActiveProgramsMixin:
    """eliminates all non active programs"""
    qs_name = 'ActivePrograms'
    filter_methods = ['hide_inactive']

    def hide_inactive(self):
        """Only programs with funding status Funded or funded"""
        return self.filter(
            funding_status__iexact='Funded'
        )

class RFProgramsMixin:
    """annotates for a simple boolean indicating whether program is using the results framework/auto-numbering"""
    qs_name = 'RFAware'
    annotate_methods = ['is_using_results_framework', 'is_manual_numbering']

    def is_using_results_framework(self):
        return self.annotate(
            using_results_framework=models.Case(
                models.When(
                    _using_results_framework=Program.NOT_MIGRATED,
                    then=models.Value(False)
                ),
                default=models.Value(True),
                output_field=models.BooleanField()
            )
        )

    def is_manual_numbering(self):
        return self.annotate(
            using_manual_numbering=models.Case(
                models.When(
                    models.Q(
                        models.Q(using_results_framework=False) |
                        models.Q(auto_number_indicators=False)
                    ),
                    then=models.Value(True)
                ),
                default=models.Value(False),
                output_field=models.BooleanField()
            )
        )

class ProgramPageProgramsMixin:
    """annotates a program for whether additional target periods are needed"""
    qs_name = 'ProgramPage'
    annotate_methods = ['needs_additional_target_periods']

    def needs_additional_target_periods(self):
        return self.annotate(
            needs_additional_target_periods=models.Case(
                models.When(
                    reporting_period_end__gt=models.Subquery(
                        Indicator.program_page_objects.filter(
                            program=models.OuterRef('pk')
                        ).annotate(
                            newest_end_date=models.Subquery(
                                PeriodicTarget.objects.filter(
                                    indicator=models.OuterRef('pk')
                                ).order_by('-end_date').values('end_date')[:1])
                        ).order_by('newest_end_date').values('newest_end_date')[:1],
                        output_field=models.DateField()
                    ),
                    then=models.Value(True)
                ),
                default=models.Value(False),
                output_field=models.BooleanField()
            )
        )

class Program(models.Model):
    NOT_MIGRATED = 1 # programs created before satsuma release which have not switched over yet
    MIGRATED = 2 # programs created before satsuma which have switched to new RF levels
    RF_ALWAYS = 3 # programs created after satsuma release - on new RF levels with no option

    gaitid = models.CharField(_("ID"), max_length=255, null=True, blank=True)
    name = models.CharField(_("Program Name"), max_length=255, blank=True)
    funding_status = models.CharField(_("Funding Status"), max_length=255, blank=True)
    cost_center = models.CharField(_("Fund Code"), max_length=255, blank=True, null=True)
    description = models.TextField(_("Program Description"), max_length=765, null=True, blank=True)
    sector = models.ManyToManyField(Sector, blank=True, verbose_name=_("Sector"))
    create_date = models.DateTimeField(null=True, blank=True)
    edit_date = models.DateTimeField(null=True, blank=True)
    budget_check = models.BooleanField(_("Enable Approval Authority"), default=False)
    country = models.ManyToManyField(Country, verbose_name=_("Country"))
    user_access = models.ManyToManyField(
        TolaUser,
        blank=True,
        related_name="programs",
        through="ProgramAccess",
        through_fields=('program', 'tolauser')
    )
    public_dashboard = models.BooleanField(_("Enable Public Dashboard"), default=False)
    start_date = models.DateField(_("Program Start Date"), null=True, blank=True)
    end_date = models.DateField(_("Program End Date"), null=True, blank=True)
    reporting_period_start = models.DateField(_("Reporting Period Start Date"), null=True, blank=True)
    reporting_period_end = models.DateField(_("Reporting Period End Date"), null=True, blank=True)
    auto_number_indicators = models.BooleanField(
        # Translators: This is an option that users can select to use the new "results framework" option to organize their indicators.
        _("Auto-number indicators according to the results framework"),
        default=True, blank=False
    )
    _using_results_framework = models.IntegerField(
        _("Group indicators according to the results framework"),
        default=RF_ALWAYS, blank=False
    )

    objects = models.Manager()
    rf_aware_objects = generate_queryset(ActiveProgramsMixin, RFProgramsMixin).as_manager()
    program_page_objects = generate_queryset(
        ActiveProgramsMixin,
        RFProgramsMixin,
        ProgramPageProgramsMixin
    ).as_manager()

    class Meta:
        verbose_name = _("Program")
        ordering = ('name',)

    # on save add create date or update edit date
    def save(self, *args, **kwargs):
        if 'force_insert' not in kwargs:
            kwargs['force_insert'] = False
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()
        super(Program, self).save()

    @property
    def rf_aware_indicators(self):
        return self.indicator_set(manager='rf_aware_objects')

    @property
    def countries(self):
        return ', '.join([x.country for x in self.country.all()])

    @property
    def has_started(self):
        return self.reporting_period_start is not None and self.reporting_period_start <= timezone.localdate()

    @property
    def has_ended(self):
        try:
            return self.reporting_period_end < timezone.localdate()
        except TypeError: # esp. if there's no reporting dates
            return False

    @property
    def percent_complete(self):
        if not self.reporting_period_end or not self.reporting_period_start:
            return -1
        if not self.has_started:
            return 0
        if self.has_ended:
            return 100
        total_days = (self.reporting_period_end - self.reporting_period_start).days
        complete = (timezone.localdate() - self.reporting_period_start).days
        return int(round(complete*100/total_days))

    # displayed in admin templates
    def __str__(self):
        return self.name

    @property
    def program_page_url(self):
        """used in place of get_absolute_url() because program page isn't strictly an absolute url (no editing) but
            gives a single point of reference on the model for the program page url, used in linking in various places
        """
        return reverse('program_page', kwargs={'program': self.pk})

    @property
    def gait_url(self):
        """if program has a gait ID, returns url https://gait.mercycorps.org/editgrant.vm?GrantID=####
        otherwise returns false
        """
        if self.gaitid is None:
            return None

        try:
            gaitid = int(self.gaitid)
        except ValueError:
            gaitid = False
        if gaitid and gaitid != 0 and len(str(gaitid)) > 2 and len(str(gaitid)) < 5:
            # gaitid exists, is numeric, is nonzero, and is a 3 or 4 digit number:
            return 'https://gait.mercycorps.org/editgrant.vm?GrantID={gaitid}'.format(
                gaitid=gaitid)
        return None

    def get_sites(self):
        indicator_ids = Indicator.objects.filter(program__in=[self.id]).values_list('id')
        results = Result.objects.filter(indicator__id__in=indicator_ids)
        return SiteProfile.objects.filter(result__id__in=results).distinct()

    @property
    def collected_record_count(self):
        return Program.objects.filter(pk=self.pk).annotate(num_data=Count('indicator__result')) \
                    .values('id', 'num_data')[0]['num_data']

    @property
    def does_it_need_additional_target_periods(self):
        newest_targetperiod = PeriodicTarget.objects.filter(indicator=OuterRef('pk')).order_by('-end_date')
        min_end_date_across_all_indicators = Indicator.objects.filter(program__in=[self.pk]).annotate(
            newest_end_date=Subquery(newest_targetperiod.values('end_date')[:1])).aggregate(Min('newest_end_date'))
        # print("min_end_date_across_all_indicators={}".format(min_end_date_across_all_indicators))
        if self.reporting_period_end is None or min_end_date_across_all_indicators['newest_end_date__min'] is None:
            return False

        if self.reporting_period_end > min_end_date_across_all_indicators['newest_end_date__min']:
            return True
        return False

    @property
    def do_periodictargets_match_reporting_date(self):
        min_starts = Indicator.objects.filter(program__in=[self.pk]) \
                .annotate(minstarts=Min('periodictargets__start_date')) \
                .values_list('minstarts', flat=True).distinct().exclude(minstarts=None).order_by('minstarts')
        # print("min_starts.count()={}, min_starts[0]={}, self.reporting_period_start={}, self.does_it_need_additional_target_periods={}".format(min_starts.count(), min_starts.first(), self.reporting_period_start, self.does_it_need_additional_target_periods))
        if min_starts and (
                min_starts.count() > 1 or
                min_starts.first() != self.reporting_period_start):
            return False
        return True

    @property
    def get_indicators_in_need_of_targetperiods_fixing(self):
        indicators = Indicator.objects.filter(program__in=[self.pk]) \
            .annotate(minstarts=Min('periodictargets__start_date')) \
            .exclude(minstarts=self.reporting_period_start) \
            .distinct() \
            .values('pk', 'number', 'name', 'target_frequency', 'minstarts') \
            .order_by('number', 'target_frequency')

        return indicators

    @property
    def has_time_aware_targets(self):
        """returns true if this program has any indicators which have a time-aware target frequency - used in program
        reporting period date validation"""
        return self.indicator_set.filter(
            target_frequency__in=Indicator.REGULAR_TARGET_FREQUENCIES
            ).exists()

    @property
    def last_time_aware_indicator_start_date(self):
        """returns None if no time aware indicators, otherwise returns the most recent start date of all targets for
        indicators with a time-aware frequency - used in program reporting period date validation"""
        most_recent = PeriodicTarget.objects.filter(
            indicator__program=self,
            indicator__target_frequency__in=Indicator.REGULAR_TARGET_FREQUENCIES
        ).order_by('-start_date').first()
        return most_recent if most_recent is None else most_recent.start_date


    def get_periods_for_frequency(self, frequency):
        period_generator = PeriodicTarget.generate_for_frequency(frequency)
        return period_generator(self.reporting_period_start, self.reporting_period_end)

    def get_short_form_periods_for_frequency(self, frequency):
        period_generator = PeriodicTarget.generate_for_frequency(frequency, short_form=True)
        return period_generator(self.reporting_period_start, self.reporting_period_end)

    @property
    def target_frequencies(self):
        return self.indicator_set.all().order_by().values('target_frequency').distinct().values_list('target_frequency', flat=True)

    @property
    def admin_logged_fields(self):
        return {
            'gaitid': self.gaitid,
            'name': self.name,
            'funding_status': self.funding_status,
            'cost_center': self.cost_center,
            'description': self.description,
            'sectors': ','.join([s.sector for s in self.sector.all()]),
            'countries': ','.join([c.country for c in self.country.all()])
        }

    @property
    def dates_for_logging(self):
        start_date = None
        if self.reporting_period_start is not None:
            start_date = self.reporting_period_start.strftime('%Y-%m-%d')

        end_date = None
        if self.reporting_period_end is not None:
            end_date = self.reporting_period_end.strftime('%Y-%m-%d')

        return {
            "start_date": start_date,
            "end_date": end_date
        }

    @property
    def rf_chain_sort_label(self):
        """Many pages ask whether you sort indicators "by Level" or "by <second tier name> chain"

            This helper method provides the second option label"""
        tier = self.level_tiers.filter(tier_depth=2).first() if self.results_framework else None
        if tier:
            tier_name = _(tier.name)
            # Translators: this labels a filter to sort indicators, for example, "by Outcome chain":
            return _('by %(level_name)s chain') % {'level_name': tier_name}
        return None

    @property
    def rf_chain_group_label(self):
        """IPTT labels filter options as "<second tier name> chains"
        """
        tier = self.level_tiers.filter(tier_depth=2).first() if self.results_framework else None
        if tier:
            tier_name = _(tier.name)
            # Translators: this labels a filter to sort indicators, for example, "by Outcome chain":
            return _('%(level_name)s chains') % {'level_name': tier_name}
        return None

    @property
    def results_framework(self):
        if hasattr(self, 'using_results_framework'):
            return self.using_results_framework
        return self._using_results_framework != self.NOT_MIGRATED

    @property
    def manual_numbering(self):
        if hasattr(self, 'using_manual_numbering'):
            return self.using_manual_numbering
        return not self.results_framework or not self.auto_number_indicators



PROGRAM_ROLE_CHOICES = (
    # Translators: Refers to a user permission role with limited access to view data only
    ('low', _('Low (view only)')),
    # Translators: Refers to a user permission role with limited access to add or edit result data
    ('medium', _('Medium (add and edit results)')),
    # Translators: Refers to a user permission role with access to edit any data
    ('high', _('High (edit anything)'))
)

PROGRAM_ROLE_INT_MAP = {
    None: 0,
    'low': 10,
    'medium': 20,
    'high': 30,
}

class ProgramAccess(models.Model):
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    tolauser = models.ForeignKey(TolaUser, on_delete=models.CASCADE)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    role = models.CharField(max_length=100, choices=PROGRAM_ROLE_CHOICES, default='low')

    class Meta:
        db_table = 'workflow_program_user_access'
        unique_together = ('program', 'tolauser', 'country')


class ProfileType(models.Model):
    profile = models.CharField(_("Profile Type"), max_length=255, blank=True)
    create_date = models.DateTimeField(null=True, blank=True)
    edit_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = _("Profile Type")
        ordering = ('profile',)

    # on save add create date or update edit date
    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()
        super(ProfileType, self).save()

    # displayed in admin templates
    def __str__(self):
        return self.profile


class ProfileTypeAdmin(admin.ModelAdmin):
    list_display = ('profile', 'create_date', 'edit_date')
    display = 'ProfileType'


# Add land classification - 'Rural', 'Urban', 'Peri-Urban', tola-help issue #162
class LandType(models.Model):
    classify_land = models.CharField(_("Land Classification"), help_text=_("Rural, Urban, Peri-Urban"), max_length=100, blank=True)
    create_date = models.DateTimeField(null=True, blank=True)
    edit_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name=_("Land Type")
        ordering = ('classify_land',)

    # on save add create date or update edit date
    def save(self, *args, **kwargs):
        if self.create_date is None:
            self.create_date = timezone.now()
        self.edit_date = timezone.now()
        super(LandType, self).save()

    # displayed in admin templates
    def __str__(self):
        return self.classify_land


class LandTypeAdmin(admin.ModelAdmin):
    list_display = ('classify_land', 'create_date', 'edit_date')
    display = 'Land Type'


class SiteProfileManager(models.Manager):
    def get_queryset(self):
        return super(SiteProfileManager, self).get_queryset().prefetch_related().select_related('country','type')


class SiteProfile(models.Model):
    profile_key = models.UUIDField(default=uuid.uuid4, unique=True),
    name = models.CharField(_("Site Name"), max_length=255, blank=False)
    type = models.ForeignKey(ProfileType, blank=True, null=True, on_delete=models.SET_NULL, verbose_name=_("Type"))
    contact_leader = models.CharField(_("Contact Name"), max_length=255, blank=True, null=True)
    date_of_firstcontact = models.DateTimeField(_("Date of First Contact"), null=True, blank=True)
    contact_number = models.CharField(_("Contact Number"), max_length=255, blank=True, null=True)
    num_members = models.CharField(_("Number of Members"), max_length=255, blank=True, null=True)
    info_source = models.CharField(_("Data Source"),max_length=255, blank=True, null=True)
    total_num_households = models.IntegerField(_("Total # Households"), help_text="", null=True, blank=True)
    avg_household_size = models.DecimalField(_("Average Household Size"), decimal_places=14,max_digits=25, default=Decimal("0.00"))
    male_0_5 = models.IntegerField(_("Male age 0-5"), null=True, blank=True)
    female_0_5 = models.IntegerField(_("Female age 0-5"), null=True, blank=True)
    male_6_9 = models.IntegerField(_("Male age 6-9"), null=True, blank=True)
    female_6_9 = models.IntegerField(_("Female age 6-9"), null=True, blank=True)
    male_10_14 = models.IntegerField(_("Male age 10-14"), null=True, blank=True)
    female_10_14 = models.IntegerField(_("Female age 10-14"), null=True, blank=True)
    male_15_19 = models.IntegerField(_("Male age 15-19"), null=True, blank=True)
    female_15_19 = models.IntegerField(_("Female age 15-19"), null=True, blank=True)
    male_20_24 = models.IntegerField(_("Male age 20-24"), null=True, blank=True)
    female_20_24 = models.IntegerField(_("Female age 20-24"), null=True, blank=True)
    male_25_34 = models.IntegerField(_("Male age 25-34"), null=True, blank=True)
    female_25_34 = models.IntegerField(_("Female age 25-34"), null=True, blank=True)
    male_35_49 = models.IntegerField(_("Male age 35-49"), null=True, blank=True)
    female_35_49 = models.IntegerField(_("Female age 35-49"), null=True, blank=True)
    male_over_50 = models.IntegerField(_("Male Over 50"), null=True, blank=True)
    female_over_50 = models.IntegerField(_("Female Over 50"), null=True, blank=True)
    total_population = models.IntegerField(null=True, blank=True, verbose_name=_("Total population"))
    total_male = models.IntegerField(null=True, blank=True, verbose_name=_("Total male"))
    total_female = models.IntegerField(null=True, blank=True, verbose_name=_("Total female"))
    classify_land = models.ForeignKey(
        LandType, blank=True, null=True, on_delete=models.SET_NULL, verbose_name=_("Classify land"))
    total_land = models.IntegerField(_("Total Land"), help_text="In hectares/jeribs", null=True, blank=True)
    total_agricultural_land = models.IntegerField(
        _("Total Agricultural Land"), help_text="In hectares/jeribs", null=True, blank=True)
    total_rainfed_land = models.IntegerField(
        _("Total Rain-fed Land"), help_text="In hectares/jeribs", null=True, blank=True)
    total_horticultural_land = models.IntegerField(
        _("Total Horticultural Land"), help_text="In hectares/jeribs", null=True, blank=True)
    total_literate_peoples = models.IntegerField(_("Total Literate People"), help_text="", null=True, blank=True)
    literate_males = models.IntegerField(_("% of Literate Males"), help_text="%", null=True, blank=True)
    literate_females = models.IntegerField(_("% of Literate Females"), help_text="%", null=True, blank=True)
    literacy_rate = models.IntegerField(_("Literacy Rate (%)"), help_text="%", null=True, blank=True)
    populations_owning_land = models.IntegerField(_("Households Owning Land"), help_text="(%)", null=True, blank=True)
    avg_landholding_size = models.DecimalField(
        _("Average Landholding Size"), decimal_places=14,max_digits=25,
        help_text=_("In hectares/jeribs"), default=Decimal("0.00"))
    households_owning_livestock = models.IntegerField(
        _("Households Owning Livestock"), help_text="(%)", null=True, blank=True)
    animal_type = models.CharField(
        _("Animal Types"), help_text=_("List Animal Types"), max_length=255, null=True, blank=True)
    country = models.ForeignKey(Country, null=True, on_delete=models.SET_NULL, verbose_name=_("Country"))
    latitude = models.DecimalField(
        _("Latitude (Decimal Coordinates)"), decimal_places=16,max_digits=25, default=Decimal("0.00"))
    longitude = models.DecimalField(
        _("Longitude (Decimal Coordinates)"), decimal_places=16,max_digits=25, default=Decimal("0.00"))
    status = models.BooleanField(_("Site Active"), default=True)
    approval = models.CharField(_("Approval"), default=_("in progress"), max_length=255, blank=True, null=True)
    approved_by = models.ForeignKey(
        TolaUser,help_text=_('This is the Provincial Line Manager'), blank=True, null=True, on_delete=models.SET_NULL,
        related_name="comm_approving", verbose_name=_("Approved by"))
    filled_by = models.ForeignKey(
        TolaUser, help_text=_('This is the originator'), blank=True, null=True, on_delete=models.SET_NULL,
        related_name="comm_estimate", verbose_name=_("Filled by"))
    location_verified_by = models.ForeignKey(
        TolaUser, help_text=_('This should be GIS Manager'), blank=True, null=True, on_delete=models.SET_NULL,
        related_name="comm_gis", verbose_name=_("Location verified by"))
    create_date = models.DateTimeField(null=True, blank=True)
    edit_date = models.DateTimeField(null=True, blank=True)
    history = HistoricalRecords()
    #optimize query
    objects = SiteProfileManager()

    class Meta:
        ordering = ('name',)
        verbose_name_plural = "Site Profiles"

    # on save add create date or update edit date
    def save(self, *args, **kwargs):

        # Check if a create date has been specified. If not, display today's date in create_date and edit_date
        if self.create_date is None:
            self.create_date = timezone.now()
            self.edit_date = timezone.now()

        super(SiteProfile, self).save()

    # displayed in admin templates
    def __str__(self):
        new_name = self.name
        return new_name


class SiteProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'country', 'cluster', 'longitude', 'latitude', 'create_date', 'edit_date')
    list_filter = ('country__country')
    search_fields = ('code', 'country__country')
    display = 'SiteProfile'



# importing at the bottom of the file so that there is not circular imports
from indicators.models import Indicator, PeriodicTarget, Result
