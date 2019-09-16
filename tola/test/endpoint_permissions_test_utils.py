"""Utilities for testing endpoints for permissions

To use, import and create class:
class Test<YourEndpointName>Endpoints(EndpointTestBase, test.TestCase):
    def setUp(self):
        self.init()
    
    # call self.get_in_program_id() to get program_id that people _should_ have access to
    # call self.get_out_program_id() to get program_id that people _should not_ have access to
    # call self.run_passing_urls(urls) with a list of urls that everyone should view
    # call self.run_failing_urls(urls) with a list of urls that everyone should not view
"""

import datetime
from django import test
from django.urls import reverse
from factories import (
    workflow_models as w_factories,
    django_models as d_factories,
    indicators_models as i_factories
    )
from indicators.models import Indicator
from workflow.models import Organization, PROGRAM_ROLE_CHOICES, COUNTRY_ROLE_CHOICES

class EndpointTestContext(object):
    def init(self):
        self.home_country = w_factories.CountryFactory(
            country='HOME country',
            code='HM'
        )
        self.in_country = w_factories.CountryFactory(
            country='IN country',
            code='IN'
        )
        self.out_country = w_factories.CountryFactory(
            country='OUT country',
            code='OUT'
        )
        self.program_in_country = w_factories.ProgramFactory(
            name='program in IN country',
            gaitid='inpr',
            country=self.in_country,
            reporting_period_start=datetime.date(2016, 1, 1),
            reporting_period_end=datetime.date(2016, 12, 31)
        )
        self.program_in_country.country.add(self.in_country)
        self.program_out_of_country = w_factories.ProgramFactory(
            name='program in OUT country',
            gaitid='outpr',
            country=self.out_country,
            reporting_period_start=datetime.date(2016, 1, 1),
            reporting_period_end=datetime.date(2016, 12, 31)
        )
        self.program_out_of_country.country.clear()
        self.program_out_of_country.country.add(self.out_country)
        self.add_indicators()
        self.add_results()
        if Organization.objects.filter(pk=1).count() == 1:
            self.mercy_corps_organization = Organization.objects.get(pk=1)
        else:
            self.mercy_corps_organization = w_factories.OrganizationFactory(
                pk=1
            )
        self.partner_organization = w_factories.OrganizationFactory(
            name="Partner Org"
        )
        user = d_factories.UserFactory(
            first_name='mercy corps',
            last_name='country low'
        )
        self.mercy_corps_country_low = w_factories.TolaUserFactory(
            name="mercy corps country low",
            organization=self.mercy_corps_organization,
            country=self.home_country,
            user=user
        )
        w_factories.grant_country_access(self.mercy_corps_country_low, self.in_country,
                                         COUNTRY_ROLE_CHOICES[0][0])
        user = d_factories.UserFactory(
            first_name='mercy corps',
            last_name='country admin'
        )
        self.mercy_corps_country_admin = w_factories.TolaUserFactory(
            name="mercy corps country admin",
            organization=self.mercy_corps_organization,
            country=self.home_country,
            user=user
        )
        w_factories.grant_country_access(self.mercy_corps_country_admin, self.in_country,
                                         COUNTRY_ROLE_CHOICES[1][0])
        user = d_factories.UserFactory(
            first_name='mercy corps',
            last_name='program low'
        )
        self.mercy_corps_low = w_factories.TolaUserFactory(
            name="mercy corps low",
            organization=self.mercy_corps_organization,
            country=self.home_country,
            user=user
        )
        w_factories.grant_program_access(self.mercy_corps_low, self.program_in_country,
                                         self.in_country, PROGRAM_ROLE_CHOICES[0][0])
        user = d_factories.UserFactory(
            first_name='mercy corps',
            last_name='program medium'
        )
        self.mercy_corps_medium = w_factories.TolaUserFactory(
            name="mercy corps medium",
            organization=self.mercy_corps_organization,
            country=self.home_country,
            user=user
        )
        w_factories.grant_program_access(self.mercy_corps_medium, self.program_in_country,
                                         self.in_country, PROGRAM_ROLE_CHOICES[1][0])
        user = d_factories.UserFactory(
            first_name='mercy corps',
            last_name='program high'
        )
        self.mercy_corps_high = w_factories.TolaUserFactory(
            name="mercy corps high",
            organization=self.mercy_corps_organization,
            country=self.home_country,
            user=user
        )
        w_factories.grant_program_access(self.mercy_corps_high, self.program_in_country,
                                         self.in_country, PROGRAM_ROLE_CHOICES[2][0])
        user = d_factories.UserFactory(
            first_name='mercy corps',
            last_name='super admin'
        )
        self.mercy_corps_super_admin = w_factories.TolaUserFactory(
            name="mercy corps super admin",
            organization=self.mercy_corps_organization,
            country=self.home_country,
            user=user
        )
        self.mercy_corps_super_admin.user.is_superuser = True
        self.mercy_corps_super_admin.user.save()
        user = d_factories.UserFactory(
            first_name='non mercy corps',
            last_name='program low'
        )
        self.non_mercy_corps_low = w_factories.TolaUserFactory(
            name="non-MC low",
            organization=self.partner_organization,
            country=self.home_country,
            user=user
        )
        w_factories.grant_program_access(self.non_mercy_corps_low, self.program_in_country,
                                         self.in_country, PROGRAM_ROLE_CHOICES[0][0])
        user = d_factories.UserFactory(
            first_name='non mercy corps',
            last_name='program medium'
        )
        self.non_mercy_corps_medium = w_factories.TolaUserFactory(
            name="non-MC medium",
            organization=self.partner_organization,
            country=self.home_country,
            user=user
        )
        w_factories.grant_program_access(self.non_mercy_corps_medium, self.program_in_country,
                                         self.in_country, PROGRAM_ROLE_CHOICES[1][0])
        user = d_factories.UserFactory(
            first_name='non mercy corps',
            last_name='program high'
        )
        self.non_mercy_corps_high = w_factories.TolaUserFactory(
            name="non-MC medium",
            organization=self.partner_organization,
            country=self.home_country,
            user=user
        )
        w_factories.grant_program_access(self.non_mercy_corps_high, self.program_in_country,
                                         self.in_country, PROGRAM_ROLE_CHOICES[2][0])

        self.external_service = i_factories.ExternalServiceFactory()

    def add_indicators(self):
        self.indicator_in_country = i_factories.IndicatorFactory(
            program=self.program_in_country,
            target_frequency=Indicator.LOP
        )
        self.indicator_out_of_country = i_factories.IndicatorFactory(
            program=self.program_out_of_country,
            target_frequency=Indicator.LOP
        )

        self.indicator_in_country_target_frequency_type_event = i_factories.IndicatorFactory(
            program=self.program_in_country,
            target_frequency=Indicator.EVENT
        )

        self.indicator_out_of_country_target_frequency_type_event = i_factories.IndicatorFactory(
            program=self.program_out_of_country,
            target_frequency=Indicator.EVENT
        )

    def add_periodic_targets(self):
        self.pt_out_of_country = i_factories.PeriodicTargetFactory(
            indicator=self.indicator_out_of_country,
            start_date=self.program_out_of_country.reporting_period_start,
            end_date=self.program_out_of_country.reporting_period_end
        )
        self.pt_in_country = i_factories.PeriodicTargetFactory(
            indicator=self.indicator_in_country,
            start_date=self.program_in_country.reporting_period_start,
            end_date=self.program_in_country.reporting_period_end
        )

    def add_results(self):
        self.result_out_of_country = i_factories.ResultFactory(
            indicator=self.indicator_out_of_country,
            program=self.program_out_of_country,
            achieved=100
        )
        self.result_in_country = i_factories.ResultFactory(
            indicator=self.indicator_in_country,
            program=self.program_in_country,
            achieved=100
        )

    def add_pinned_report(self, tolauser, out=True):
        program = self.program_out_of_country if out else self.program_in_country
        pinned_report = i_factories.PinnedReportFactory(
            tola_user=tolauser,
            program=program
        )
        return pinned_report.pk

    @property
    def high_users(self):
        for user in [self.mercy_corps_high,
                     self.non_mercy_corps_high,
                     self.mercy_corps_super_admin]:
            yield user

    @property
    def non_high_users(self):
        for user in [self.mercy_corps_low,
                     self.mercy_corps_medium,
                     self.mercy_corps_country_low,
                     self.mercy_corps_country_admin,
                     self.non_mercy_corps_low,
                     self.non_mercy_corps_medium]:
            yield user

    @property
    def all_non_superadmin_users(self):
        for user in [self.mercy_corps_low,
                     self.mercy_corps_medium,
                     self.mercy_corps_high,
                     self.mercy_corps_country_low,
                     self.mercy_corps_country_admin,
                     self.non_mercy_corps_low,
                     self.non_mercy_corps_medium,
                     self.non_mercy_corps_high]:
            yield user

    @property
    def all_users(self):
        for user in [u for u in self.all_non_superadmin_users] + [self.mercy_corps_super_admin,]:
            yield user

class EndpointTestBase(object):
    url = None
    url_kwargs = {}
    access_level = None
    post_data = {}
    get_params = {}
    delete = None
    redirect = False
    no_login_redirect = False

    def init(self):
        self.context = EndpointTestContext()
        self.context.init()
        self.client = test.Client()

    def get_permissioned_users(self):
        users = []
        if self.access_level in ['high', 'medium', 'low']:
            users.append((self.context.mercy_corps_high, 'MC high'))
            users.append((self.context.non_mercy_corps_high, 'Non MC high'))
        if self.access_level in ['medium', 'low']:
            users.append((self.context.mercy_corps_medium, 'MC medium'))
            users.append((self.context.non_mercy_corps_medium, 'Non MC medium'))
        if self.access_level == 'low':
            users.append((self.context.mercy_corps_low, 'MC low'))
            users.append((self.context.non_mercy_corps_low, 'Non MC low'))
            users.append((self.context.mercy_corps_country_low, 'MC country-based low'))
        if self.access_level == 'admin':
            users.append((self.context.mercy_corps_country_admin, 'MC admin'))
        return users

    def get_non_permissioned_users(self):
        users = []
        if self.access_level == 'high':
            users.append((self.context.mercy_corps_medium, 'MC medium'))
            users.append((self.context.non_mercy_corps_medium, 'Non MC medium'))
        if self.access_level in ['high', 'medium']:
            users.append((self.context.mercy_corps_low, 'MC low'))
            users.append((self.context.non_mercy_corps_low, 'Non MC low'))
            users.append((self.context.mercy_corps_country_low, 'MC country-based low'))
        return users

    def get_all_users(self):
        return self.context.all_non_superadmin_users

    def get_out_url(self):
        kwargs = {}
        if 'program' in self.url_kwargs:
            kwargs['program'] = self.context.program_out_of_country.pk
        if 'indicator' in self.url_kwargs:
            if self.url_kwargs['indicator'] == 'event':
                kwargs['indicator'] = self.context.indicator_out_of_country_target_frequency_type_event.pk
            else:
                kwargs['indicator'] = self.context.indicator_out_of_country.pk
        if 'pk' in self.url_kwargs and self.url_kwargs['pk'] == 'indicator':
            kwargs['pk'] = self.context.indicator_out_of_country.pk
        if 'pk' in self.url_kwargs and self.url_kwargs['pk'] == 'periodic_target':
            kwargs['pk'] = self.context.pt_out_of_country.pk
        if 'pk' in self.url_kwargs and self.url_kwargs['pk'] == 'result':
            kwargs['pk'] = self.context.result_out_of_country.pk
        if 'deleteall' in self.url_kwargs:
            kwargs['deleteall'] = self.url_kwargs['deleteall']
        if 'reporttype' in self.url_kwargs:
            kwargs['reporttype'] = self.url_kwargs['reporttype']
        if 'service' in self.url_kwargs:
            kwargs['service'] = self.context.external_service.id
        if 'program_id' in self.get_params:
            self.get_params['program_id'] = self.context.program_out_of_country.pk
        return reverse(self.url, kwargs=kwargs)

    def get_in_url(self):
        kwargs = {}
        if 'program' in self.url_kwargs:
            kwargs['program'] = self.context.program_in_country.pk
        if 'indicator' in self.url_kwargs:
            if self.url_kwargs['indicator'] == 'event':
                kwargs['indicator'] = self.context.indicator_in_country_target_frequency_type_event.pk
            else:
                kwargs['indicator'] = self.context.indicator_in_country.pk
        if 'pk' in self.url_kwargs and self.url_kwargs['pk'] == 'indicator':
            kwargs['pk'] = self.context.indicator_in_country.pk
        if 'pk' in self.url_kwargs and self.url_kwargs['pk'] == 'periodic_target':
            kwargs['pk'] = self.context.pt_in_country.pk
        if 'pk' in self.url_kwargs and self.url_kwargs['pk'] == 'result':
            kwargs['pk'] = self.context.result_in_country.pk
        if 'deleteall' in self.url_kwargs:
            kwargs['deleteall'] = self.url_kwargs['deleteall']
        if 'reporttype' in self.url_kwargs:
            kwargs['reporttype'] = self.url_kwargs['reporttype']
        if 'service' in self.url_kwargs:
            kwargs['service'] = self.context.external_service.id
        if 'program_id' in self.get_params:
            self.get_params['program_id'] = self.context.program_in_country.pk
        return reverse(self.url, kwargs=kwargs)

    def fetch_get_response(self, tolauser, url):
        self.client.logout()
        if tolauser is not None:
            self.client.force_login(tolauser.user)
        return self.client.get(url, self.get_params)

    def fetch_post_response(self, tolauser, url):
        self.client.logout()
        if tolauser is not None:
            self.client.force_login(tolauser.user)
        return self.client.post(url, self.post_data)

    def fetch_delete_response(self, tolauser, url):
        self.client.logout()
        if tolauser is not None:
            self.client.force_login(tolauser.user)
        return self.client.delete(url, self.post_data)

    def assert_passes(self, response, msg):
        self.assertEqual(response.status_code, 200,
                         '{msg} but got response status code {code}'.format(
                            msg=msg, code=response.status_code
                         ))

    def assert_post_passes(self, response, msg):
        # assert not 403 (some posts redirect (302) and some succeed (200) but should not be forbidden)
        self.assertNotEqual(response.status_code, 403,
                         '{msg} but got response status code {code}'.format(
                            msg=msg, code=response.status_code))

    def assert_forbidden(self, response, msg):
        if self.redirect:
            self.assertRedirects(response, reverse('index'), msg_prefix=msg)
        else:
            self.assertEqual(response.status_code, 403,
                             '{msg} but got response {code}'.format(msg=msg, code=response.status_code))

    def assert_redirects_to_login(self, response, msg, url):
        # for AJAX views where "continue on after login" makes no sense:
        if self.no_login_redirect:
            self.assertEqual(response.status_code, 403,
                             msg + "anonymous user should get 403 at this endpoint, got {}".format(
                                response.status_code))
        # otherwise:
        else:
            self.assertRedirects(response, reverse('login') + '?next=' + url, msg_prefix=msg)

    def run_get_tests(self, skip_out_country=False):
        if not skip_out_country:
            # get out of country url:
            url = self.get_out_url()
            # ensure superuser can access:
            response = self.fetch_get_response(self.context.mercy_corps_super_admin, url)
            self.assert_passes(response, 'superuser should have access to {}'.format(url))
            # ensure all users cannot access:
            for user in self.get_all_users():
                response = self.fetch_get_response(user, url)
                self.assert_forbidden(
                    response, 'user not assigned to country should redirect from {}'.format(url))
            # ensure anonymous user cannot access:
            response = self.fetch_get_response(None, url)
            self.assert_redirects_to_login(response, 'anonymous user should redirect from {}'.format(url), url)
        # get in country url:
        url = self.get_in_url()
        # ensure superuser can access:
        response = self.fetch_get_response(self.context.mercy_corps_super_admin, url)
        self.assert_passes(response, 'superuser should have access to {}'.format(url))
        # ensure all users with appropriate access can access:
        for user, level in self.get_permissioned_users():
            response = self.fetch_get_response(user, url)
            self.assert_passes(response, 'user level {0} should have access to {1}'.format(
                level, url
            ))
        # ensure users without appropriate access cannot access:
        for user, level in self.get_non_permissioned_users():
            response = self.fetch_get_response(user, url)
            self.assert_forbidden(response, 'user level {0} should not have access to {1}'.format(
                level, url))
        # ensure anonymous user cannot access:
        response = self.fetch_get_response(None, url)
        self.assert_redirects_to_login(response, 'anonymous user should redirect from {}'.format(url), url)

    def run_post_tests(self, method='post'):
        if method == 'post':
            fetch_method = self.fetch_post_response
        elif method == 'delete':
            fetch_method = self.fetch_delete_response
        else:
            raise ValueError('invalid method {}'.format(method))
        if self.delete == 'indicator':
            self.context.add_indicators()
        if self.delete == 'periodic_target':
            self.context.add_periodic_targets()
        if self.delete == 'result':
            self.context.add_results()
        if 'program' in self.post_data:
            self.post_data['program'] = self.context.program_out_of_country.pk
        if self.delete == 'pinned_report':
            self.post_data['pinned_report_id'] = self.context.add_pinned_report(
                self.context.mercy_corps_super_admin, True)
        response = fetch_method(self.context.mercy_corps_super_admin, self.get_out_url())
        self.assert_post_passes(response, 'superuser should be able to {0} to {1}'.format(method, self.get_out_url()))
        # ensure all users cannot access:
        for user in self.get_all_users():
            if self.delete == 'indicator':
                self.context.add_indicators()
            if self.delete == 'periodic_target':
                self.context.add_periodic_targets()
            if self.delete == 'result':
                self.context.add_results()
            if self.delete == 'pinned_report':
                self.post_data['pinned_report_id'] = self.context.add_pinned_report(user, True)
            response = fetch_method(user, self.get_out_url())
            self.assert_forbidden(
                response, 'user not assigned to country should redirect from {}'.format(self.get_out_url()))
        # ensure anonymous user cannot access:
        if self.delete == 'indicator':
            self.context.add_indicators()
        if self.delete == 'periodic_target':
            self.context.add_periodic_targets()
        if self.delete == 'result':
            self.context.add_results()
        response = fetch_method(None, self.get_out_url())
        self.assert_redirects_to_login(response, 'anonymous user should redirect from {}'.format(
            self.get_out_url()), self.get_out_url())
        # ensure superuser can access:
        if self.delete == 'indicator':
            self.context.add_indicators()
        if self.delete == 'periodic_target':
            self.context.add_periodic_targets()
        if self.delete == 'result':
            self.context.add_results()
        if 'program' in self.post_data:
            self.post_data['program'] = self.context.program_in_country.pk
        if self.delete == 'pinned_report':
            self.post_data['pinned_report_id'] = self.context.add_pinned_report(
                self.context.mercy_corps_super_admin, False
            )
        response = fetch_method(self.context.mercy_corps_super_admin, self.get_in_url())
        self.assert_post_passes(response, 'superuser should be able to {0} to {1}'.format(
            method, self.get_in_url()))
        # ensure all users with appropriate access can access:
        for user, level in self.get_permissioned_users():
            if self.delete == 'indicator':
                self.context.add_indicators()
            if self.delete == 'periodic_target':
                self.context.add_periodic_targets()
            if self.delete == 'result':
                self.context.add_results()
            if self.delete == 'pinned_report':
                self.post_data['pinned_report_id'] = self.context.add_pinned_report(user, False)
            response = fetch_method(user, self.get_in_url())
            self.assert_post_passes(response, 'user level {0} should have {1} access to {2}'.format(
                level, method, self.get_in_url()))
        for user, level in self.get_non_permissioned_users():
            if self.delete == 'indicator':
                self.context.add_indicators()
            if self.delete == 'periodic_target':
                self.context.add_periodic_targets()
            if self.delete == 'result':
                self.context.add_results()
            if self.delete == 'pinned_report':
                self.post_data['pinned_report_id'] = self.context.add_pinned_report(user, False)
            response = fetch_method(user, self.get_in_url())
            self.assert_forbidden(response, 'user level {0} should not have {1} access to {2}'.format(
                level, method, self.get_in_url()))
        # ensure anonymous user cannot acccess:
        if self.delete == 'indicator':
            self.context.add_indicators()
        if self.delete == 'periodic_target':
            self.context.add_periodic_targets()
        if self.delete == 'result':
            self.context.add_results()
        response = fetch_method(None, self.get_in_url())
        self.assert_redirects_to_login(response, 'anonymous user should redirect from {}'.format(
            self.get_in_url()), self.get_in_url())
