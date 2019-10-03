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


    url(r'^monitor_list/(?P<pk>\w+)/$', MonitorList.as_view(), name='monitor_list'),
    url(r'^monitor_add/(?P<id>\w+)/$', MonitorCreate.as_view(), name='monitor_add'),
    url(r'^monitor_update/(?P<pk>\w+)/$', MonitorUpdate.as_view(), name='monitor_update'),
    url(r'^monitor_delete/(?P<pk>\w+)/$', MonitorDelete.as_view(), name='monitor_delete'),

    url(r'^benchmark_add/(?P<id>\w+)/$', BenchmarkCreate.as_view(), name='benchmark_add'),
    url(r'^benchmark_update/(?P<pk>\w+)/$', BenchmarkUpdate.as_view(), name='benchmark_update'),
    url(r'^benchmark_delete/(?P<pk>\w+)/$', BenchmarkDelete.as_view(), name='benchmark_delete'),

    url(r'^benchmark_complete_add/(?P<id>\w+)/$', BenchmarkCreate.as_view(), name='benchmark_add'),
    url(r'^benchmark_complete_update/(?P<pk>\w+)/$', BenchmarkUpdate.as_view(), name='benchmark_update'),
    url(r'^benchmark_complete_delete/(?P<pk>\w+)/$', BenchmarkDelete.as_view(), name='benchmark_delete'),

    url(r'^checklistitem_list/(?P<pk>\w+)/$', ChecklistItemList.as_view(), name='checklistitem_list'),
    url(r'^checklistitem_add/(?P<id>\w+)/$', ChecklistItemCreate.as_view(), name='checklistitem_add'),
    url(r'^checklistitem_update/(?P<pk>\w+)/$', ChecklistItemUpdate.as_view(), name='checklistitem_update'),
    url(r'^checklist_update_link/(?P<pk>\w+)/(?P<type>\w+)/(?P<value>\w+)/$', checklist_update_link, name='checklist_update_link'),
    url(r'^checklistitem_delete/(?P<pk>\w+)/$', ChecklistItemDelete.as_view(), name='checklistitem_delete'),

    url(r'^budget_list/(?P<pk>\w+)/$', BudgetList.as_view(), name='budget_list'),
    url(r'^budget_add/(?P<id>\w+)/$', BudgetCreate.as_view(), name='budget_add'),
    url(r'^budget_update/(?P<pk>\w+)/$', BudgetUpdate.as_view(), name='budget_update'),
    url(r'^budget_delete/(?P<pk>\w+)/$', BudgetDelete.as_view(), name='budget_delete'),

    url(r'^report/export/$', Report.as_view(), name='report'),
    url(r'^report/(?P<pk>\w+)/(?P<status>[\w ]+)/$', Report.as_view(), name='report'),
    url(r'^report_table/(?P<pk>\w+)/(?P<status>[\w ]+)/$', ReportData.as_view(), name='report_data'),

    url(r'^country/(?P<country>[-\w]+)/country_json/', country_json, name='country_json'),

    #ajax calls
    url(r'^reportingperiod_update/(?P<pk>\w+)$', reportingperiod_update, name='reportingperiod_update'),
]
