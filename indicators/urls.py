"""URLS for the Indicators app in the Tola project"""
from indicators import views
from django.conf.urls import url


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

    url(r'^result_table/(?P<indicator>\d+)/',
        views.result_view, name='result_view'),

    url(r'^iptt_quickstart/', views.IPTTQuickstart.as_view(), name='iptt_quickstart'),
    url(r'^iptt_report/(?P<program>\d+)/(?P<reporttype>\w+)/$', views.IPTTReport.as_view(), name='iptt_report'),
    url(r'^iptt_report_data/$', views.IPTTReportData.as_view(), name='iptt_ajax'),
    url(r'iptt_api/iptt_excel/$', views.IPTTExcelReport.as_view(), name='iptt_excel'),

    # CSV endpoint (still in Alpha) GH ticket: #1854
    url(r'^programs_rollup_export', views.programs_rollup_export, name='programs_rollup_export'),

    url(r'^pinned_report/$', views.create_pinned_report, name='create_pinned_report'),
    url(r'^pinned_report/delete/$', views.delete_pinned_report, name='delete_pinned_report'),

    # Results framework builder
    url(r'^results_framework_builder/(?P<program_id>\d+)', views.ResultsFrameworkBuilder.as_view(),
        name='results_framework_builder'),

    # API call for program page
    url(r'^api/indicator/(?P<indicator>\d+)', views.api_indicator_view, name='api_indicator_view'),
    url(r'^api/indicators/(?P<program>\d+)', views.api_indicators_list, name='api_indicators_list'),
]
