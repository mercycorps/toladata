""" Tests for endpoints in indicators.urls for access depending on access level
indicators/
    indicator_create/<program> indicator_create
    indicator_update/<pk> indicator_update
    indicator_delete/<pk> indicator_delete
    periodic_target_delete/<pk> pt_delete
    periodic_target_deleteall/<indicator>/<deleteall> pt_deleteall
    result_add/<indicator> result_add
    result_update/<pk> result_update
    result_delete/<pk> result_delete
"""
from django import test
from django.urls import reverse
from tola.test.endpoint_permissions_test_utils import EndpointTestBase
from factories import django_models as d_factories
import unittest


@test.tag('slow')
class TestIndicatorCreateEndpoint(EndpointTestBase, test.TestCase):
    url = 'indicator_create'
    url_kwargs = {'program': None}
    access_level = None # access level changes get / post
    post_data = {
        'name': 'endpoint test indicator',
    }

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.access_level = 'low'
        self.run_get_tests()
        self.access_level = 'high'
        self.run_post_tests()


@test.tag('slow')
class TestIndicatorUpdateEndpoint(EndpointTestBase, test.TestCase):
    url = 'indicator_update'
    url_kwargs = {'pk': 'indicator'}
    access_level = None # access level changes get / post
    post_data = {
        'name': 'endpoint test indicator name change'
    }

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.access_level = 'low'
        self.run_get_tests()
        self.access_level = 'high'
        self.run_post_tests()


@test.tag('slow')
class TestIndicatorDeleteEndpoint(EndpointTestBase, test.TestCase):
    url = 'indicator_delete'
    url_kwargs = {'pk': 'indicator'}
    access_level = 'high'
    post_data = {
        'rationale': 'end point test deletion'
    }
    delete = 'indicator'

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_post_tests()


@test.tag('slow')
class TestPeriodTargetDeleteEndpoint(EndpointTestBase, test.TestCase):
    url = 'pt_delete'
    url_kwargs = {'pk': 'periodic_target'}
    access_level = 'high'
    delete = 'periodic_target'

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_post_tests()


@test.tag('slow')
class TestPeriodicTargetDeleteAllEndpoint(EndpointTestBase, test.TestCase):
    url = 'pt_deleteall'
    url_kwargs = {'indicator': None}
    access_level = 'high'
    delete = 'periodic_target'

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_post_tests()


@test.tag('slow')
class TestResultCreateEndpoint(EndpointTestBase, test.TestCase):
    url = 'result_add'
    url_kwargs = {'indicator': None}
    access_level = 'medium'
    post_data = {
        'achieved': 100
    }

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_get_tests()
        self.run_post_tests()


@test.tag('slow')
class TestResultUpdateEndpoint(EndpointTestBase, test.TestCase):
    url = 'result_update'
    url_kwargs = {'pk': 'result'}
    access_level = None # varies
    post_data = {
        'achieved': 80
    }

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.access_level = 'low'
        self.run_get_tests()
        self.access_level = 'medium'
        self.run_post_tests()


@test.tag('slow')
class TestResultDeleteEndpoint(EndpointTestBase, test.TestCase):
    url = 'result_delete'
    url_kwargs = {'pk': 'result'}
    access_level = 'medium'
    delete = 'result'

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_post_tests()


@test.tag('slow')
class TestDisaggregationReportEndpoint(EndpointTestBase, test.TestCase):
    url = 'disrep'
    url_kwargs = {'program': None}
    access_level = 'low'

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_get_tests()
        self.run_post_tests()


@unittest.skip('endpoint being removed')
class TestDisaggregationPrintReportEndpoint(EndpointTestBase, test.TestCase):
    url = 'disrepprint'
    url_kwargs = {'program': None}
    access_level = 'low'

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_get_tests()
        self.run_post_tests()


@test.tag('slow')
class TestIndicatorPlanEndpoint(EndpointTestBase, test.TestCase):
    url = 'indicator_plan'
    url_kwargs = {'program': None}
    access_level = 'low'

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_get_tests()
        self.run_post_tests()


@test.tag('slow')
class TestIndicatorPlanExportEndpoint(EndpointTestBase, test.TestCase):
    url = 'indicator_export'
    url_kwargs  = {'program': None}
    access_level = 'low'

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_get_tests()
        self.run_post_tests()


@test.tag('slow')
class TestServiceJsonEndpoint(EndpointTestBase, test.TestCase):
    url = 'service_json'
    url_kwargs = {'service': None}
    access_level = 'high'

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_get_tests(skip_out_country=True)


@test.tag('slow')
class TestResultTableEndpoint(EndpointTestBase, test.TestCase):
    url = 'result_view'
    url_kwargs = {'indicator': None}
    access_level = 'low'

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_get_tests()
        self.run_post_tests()


@test.tag('slow')
class TestIPTTQuickstartEndpoint(test.TestCase):
    def setUp(self):
        self.user = d_factories.UserFactory(
            first_name='i am',
            last_name='a user'
        )
        self.client = test.Client()

    def test_anonymous_user_redirected(self):
        self.client.logout()
        response = self.client.get(reverse('iptt_quickstart'))
        self.assertRedirects(response, reverse('login') + '?next=' + reverse('iptt_quickstart'),
                             msg_prefix='anonymous user should redirect from iptt quickstart')

    def test_logged_in_user_not_redirected(self):
        self.client.logout()
        self.client.force_login(self.user)
        response = self.client.get(reverse('iptt_quickstart'))
        self.assertEqual(response.status_code, 200, 'logged in user should not be redirected')


@unittest.skip('endpoint being reworked')
class TestIPTTReportEndpoint(EndpointTestBase, test.TestCase):
    url = 'iptt_report'
    url_kwargs = {'program': None,
                  'reporttype': 'targetperiods'}
    access_level = 'low'
    post_data = {
        'program': None
    }


    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_get_tests()
        self.run_post_tests()


@unittest.skip('endpoint being reworked')
class TestIPTTExcelEndpoint(EndpointTestBase, test.TestCase):
    url = 'iptt_excel'
    url_kwargs = {'program': None,
                  'reporttype': 'targetperiods'}
    access_level = 'low'
    post_data = {
        'program': None
    }

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_get_tests()
        self.run_post_tests()


@test.tag('slow')
class TestPinnedReportEndpoint(EndpointTestBase, test.TestCase):
    url = 'create_pinned_report'
    url_kwargs = {}
    access_level = 'low'
    post_data = {
        'name': 'Test',
        'program': None,
        'query_string': 'test',
        'report_type': 'test'
    }

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_post_tests()


@test.tag('slow')
class TestPinnedReportDeleteEndpoint(EndpointTestBase, test.TestCase):
    url = 'delete_pinned_report'
    url_kwargs = {}
    access_level = 'low'
    post_data = {
        'pinned_report_id': None
    }
    delete = 'pinned_report'

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_post_tests()


@test.tag('slow')
class TestAPIIndicatorViewEndpoint(EndpointTestBase, test.TestCase):
    url = 'api_indicator_view'
    url_kwargs = {'indicator': None}
    access_level = 'low'

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_get_tests()
        self.run_post_tests()


@test.tag('slow')
class TestProgramTargetFrequenciesFeedEndpoint(EndpointTestBase, test.TestCase):
    url = 'programtargetfrequencies-list'
    url_kwargs = {}
    get_params = {
        'program_id': None
    }
    access_level = 'low'
    no_login_redirect = True

    def setUp(self):
        self.init()

    def test_http_methods(self):
        self.run_get_tests()
