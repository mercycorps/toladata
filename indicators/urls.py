"""URLS for the Indicators app in the Tola project"""
from indicators import views
from django.urls import path, include

apipatterns = [
    # results table html string for one indicator (Program Page and IPTT):
    path('result_table/<int:indicator>/', views.result_view, name='result_view'),
    # program-wide ordering update (program page):
    path('program/ordering/<int:program>/', views.api_program_ordering, name='program_ordering'),
    # program by-level ordering update (IPTT):
    path('program/level_ordering/<int:program>/', views.api_program_ordering, name='level_ordering'),
    # program page indicator update (with included orderin update):
    path('program_page/indicator/<int:pk>/', views.api_program_page_indicator, name='program_page_indicator'),
    # program page all indicators update:
    path('program_page/<int:program>/', views.api_program_page, name='api_program_page'),
    path('iptt/<int:program>/filter_data/', views.api_iptt_filter_data, name='api_iptt_filter_data'),
    path('iptt/<int:program>/report_data/', views.api_iptt_report_data, name='api_iptt_report_data'),
    # indicator update (program page):
    path('indicator/<int:indicator>', views.api_indicator_view, name='api_indicator_view'),
    # all indicators update (program page):
    path('indicators/<int:program>', views.api_indicators_list, name='api_indicators_list'),
    path('pinned_report/', views.create_pinned_report, name='create_pinned_report'),
    path('bulk_import_indicators/<int:program_id>/',
         views.BulkImportIndicatorsView.as_view(),
         name='bulk_import_indicators'),
    path('get_feedback_bulk_import_template/<int:program_id>/',
         views.get_feedback_bulk_import_template,
         name='get_feedback_bulk_import_template'),
    path('save_bulk_import_data/<int:program_id>/',
         views.save_bulk_import_data,
         name='save_bulk_import_data')
]

urlpatterns = [
    path('periodic_targets_form/<int:program>/', views.periodic_targets_form, name='periodic_targets_form'),

    path('indicator_create/<int:program>/', views.IndicatorCreate.as_view(), name='indicator_create'),

    path('indicator_update/<int:pk>/', views.IndicatorUpdate.as_view(), name='indicator_update'),

    path('indicator_delete/<int:pk>/', views.IndicatorDelete.as_view(), name='indicator_delete'),

    path('periodic_target_delete/<int:pk>/', views.PeriodicTargetDeleteView.as_view(), name='pt_delete'),# delete event

    path('periodic_target_deleteall/<int:indicator>/',  # delete all targets button
         views.PeriodicTargetDeleteAllView.as_view(), name='pt_deleteall'),

    path('result_add/<int:indicator>/', views.ResultCreate.as_view(), name='result_add'),

    path('result_update/<int:pk>/', views.ResultUpdate.as_view(), name='result_update'),

    path('result_delete/<int:pk>/', views.ResultDelete.as_view(), name='result_delete'),

    path('disrep_quickstart/', views.DisaggregationReportQuickstart.as_view(), name='disrep_quickstart'),
    path('disrep/<int:program>/', views.DisaggregationReport.as_view(), name='disrep'),

    path('disrepprint/<int:program>/', views.DisaggregationPrint.as_view(), name='disrepprint'),

    path('indicator_plan/<int:program>/', views.indicator_plan, name='indicator_plan'),

    path('indicator_plan/export/<int:program>/', views.IndicatorExport.as_view(), name='indicator_export'),

    path('service/<str:service>/service_json/', views.service_json, name='service_json'),

    path('iptt_quickstart/', views.IPTTQuickstart.as_view(), name='iptt_quickstart'),
    path('iptt_report/<int:program>/<str:reporttype>/', views.IPTTReport.as_view(), name='iptt_report'),
    path('iptt_api/iptt_excel/', views.IPTTExcelReport.as_view(), name='iptt_excel'),

    # JSON endpoint (still in Alpha) GH ticket: #1854
    path('programs_rollup_export/', views.programs_rollup_export, name='programs_rollup_export'),

    # CSV endpoint (still in Alpha)
    path('programs_rollup_export_csv/', views.programs_rollup_export_csv, name='programs_rollup_export_csv'),

    path('pinned_report/delete/', views.delete_pinned_report, name='delete_pinned_report'),

    # Results framework builder
    path('results_framework_builder/<int:program_id>', views.ResultsFrameworkBuilder.as_view(),
         name='results_framework_builder'),

    path('results_framework_export/<int:program>/', views.results_framework_export, name='rf_export'),

    # API (serializer-based) calls for program page / IPTT
    path('api/', include(apipatterns)),

]
