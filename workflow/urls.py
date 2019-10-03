from .views import *

from django.conf.urls import *

# place app url patterns here

urlpatterns = [
    url(r'^siteprofile_list/(?P<program_id>\w+)/(?P<activity_id>\w+)/$', SiteProfileList.as_view(), name='siteprofile_list'),
    url(r'^siteprofile_report/(?P<pk>\w+)/$', SiteProfileReport.as_view(), name='siteprofile_report'),
    url(r'^siteprofile_add', SiteProfileCreate.as_view(), name='siteprofile_add'),
    url(r'^siteprofile_update/(?P<pk>\w+)/$', SiteProfileUpdate.as_view(), name='siteprofile_update'),
    url(r'^siteprofile_delete/(?P<pk>\w+)/$', SiteProfileDelete.as_view(), name='siteprofile_delete'),

    url(r'^site_indicatordata/(?P<site_id>\w+)/$', IndicatorDataBySite.as_view(), name='site_indicatordata'),

    url(r'^report/export/$', Report.as_view(), name='report'),
    url(r'^report/(?P<pk>\w+)/(?P<status>[\w ]+)/$', Report.as_view(), name='report'),
    url(r'^report_table/(?P<pk>\w+)/(?P<status>[\w ]+)/$', ReportData.as_view(), name='report_data'),

    url(r'^country/(?P<country>[-\w]+)/country_json/', country_json, name='country_json'),

    #ajax calls
    url(r'^reportingperiod_update/(?P<pk>\w+)$', reportingperiod_update, name='reportingperiod_update'),
]
