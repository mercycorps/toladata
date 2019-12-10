"""URLS for the Indicators app in the Tola project"""
from indicators import views
from django.conf.urls import url, include

apipatterns = [
    # results table html string for one indicator (Program Page and IPTT):
    url(r'^result_table/(?P<indicator>\d+)/', views.result_view, name='result_view'),
    # program-wide ordering update (program page):
    url(r'^program/ordering/(?P<program>\d+)/', views.api_program_ordering, name='program_ordering'),
    # program by-level ordering update (IPTT):
    url(r'^program/level_ordering/(?P<program>\d+)/', views.api_program_level_ordering, name='level_ordering'),
    # program page indicator update (with included orderin update):
    url(r'^program_page/indicator/(?P<pk>\d+)/',
        views.api_program_page_indicator, name='program_page_indicator'),
    # program page all indicators update:
    url(r'^program_page/(?P<program>\d+)/', views.api_program_page, name='api_program_page'),
    url(r'^iptt/(?P<program>\d+)/filter_data/', views.api_iptt_filter_data, name='api_iptt_filter_data'),
    url(r'^iptt/(?P<program>\d+)/report_data/', views.api_iptt_report_data, name='api_iptt_report_data'),
    # indicator update (program page):
    url(r'^indicator/(?P<indicator>\d+)', views.api_indicator_view, name='api_indicator_view'),
    # all indicators update (program page):
    url(r'^indicators/(?P<program>\d+)', views.api_indicators_list, name='api_indicators_list'),
    url(r'^pinned_report/$', views.create_pinned_report, name='create_pinned_report')
]

urlpatterns = [
    url(r'^periodic_targets_form/(?P<program>\d+)/$', views.periodic_targets_form, name='periodic_targets_form'),

    url(r'^indicator_create/(?P<program>\d+)/$', views.IndicatorCreate.as_view(), name='indicator_create'),

    url(r'^indicator_update/(?P<pk>\d+)/$', views.IndicatorUpdate.as_view(), name='indicator_update'),

    url(r'^indicator_delete/(?P<pk>\d+)/$', views.IndicatorDelete.as_view(), name='indicator_delete'),

    url(r'^periodic_target_delete/(?P<pk>\d+)/$', views.PeriodicTargetDeleteView.as_view(), name='pt_delete'),  # delete event

    url(r'^periodic_target_deleteall/(?P<indicator>\d+)/$',  # delete all targets button
        views.PeriodicTargetDeleteAllView.as_view(), name='pt_deleteall'),

    url(r'^result_add/(?P<indicator>\d+)/$', views.ResultCreate.as_view(), name='result_add'),

    url(r'^result_update/(?P<pk>\d+)/$', views.ResultUpdate.as_view(), name='result_update'),

    url(r'^result_delete/(?P<pk>\d+)/$', views.ResultDelete.as_view(), name='result_delete'),

    url(r'^disrep_quickstart/$', views.DisaggregationReportQuickstart.as_view(), name='disrep_quickstart'),
    url(r'^disrep/(?P<program>\d+)/$', views.DisaggregationReport.as_view(), name='disrep'),

    url(r'^disrepprint/(?P<program>\d+)/$', views.DisaggregationPrint.as_view(), name='disrepprint'),

    url(r'^indicator_plan/(?P<program>\d+)/$', views.indicator_plan, name='indicator_plan'),

    url(r'^indicator_plan/export/(?P<program>\d+)/$',
        views.IndicatorExport.as_view(), name='indicator_export'),

    url(r'^service/(?P<service>[-\w]+)/service_json/', views.service_json, name='service_json'),

    url(r'^iptt_quickstart/', views.IPTTQuickstart.as_view(), name='iptt_quickstart'),
    url(r'^iptt_report/(?P<program>\d+)/(?P<reporttype>\w+)/$', views.IPTTReport.as_view(), name='iptt_report'),
    #url(r'^iptt_report_data/$', views.IPTTReportData.as_view(), name='iptt_ajax'),
    url(r'iptt_api/iptt_excel/$', views.IPTTExcelReport.as_view(), name='iptt_excel'),

    # JSON endpoint (still in Alpha) GH ticket: #1854
    url(r'^programs_rollup_export/$', views.programs_rollup_export, name='programs_rollup_export'),

    # CSV endpoint (still in Alpha)
    url(r'^programs_rollup_export_csv/$', views.programs_rollup_export_csv, name='programs_rollup_export_csv'),

    #url(r'^pinned_report/$', views.create_pinned_report, name='create_pinned_report'),
    url(r'^pinned_report/delete/$', views.delete_pinned_report, name='delete_pinned_report'),

    # Results framework builder
    url(r'^results_framework_builder/(?P<program_id>\d+)', views.ResultsFrameworkBuilder.as_view(),
        name='results_framework_builder'),
    url(r'^api/', include(apipatterns)),
    # API call for program page
    #url(r'^api/indicator/(?P<indicator>\d+)', views.api_indicator_view, name='api_indicator_view'),
    #url(r'^api/indicators/(?P<program>\d+)', views.api_indicators_list, name='api_indicators_list'),
    # url(r'^api/program.ordering/(?P<program>\d+)', views.)
]
