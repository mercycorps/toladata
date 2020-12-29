from workflow.views import (
    SiteProfileList,
    SiteProfileCreate,
    SiteProfileUpdate,
    SiteProfileDelete,
    IndicatorDataBySite,
    reportingperiod_update
)

from django.urls import path

urlpatterns = [
    path('siteprofile_list/<int:program_id>/<int:activity_id>/', SiteProfileList.as_view(), name='siteprofile_list'),
    path('siteprofile_add/', SiteProfileCreate.as_view(), name='siteprofile_add'),
    path('siteprofile_update/<int:pk>/', SiteProfileUpdate.as_view(), name='siteprofile_update'),
    path('siteprofile_delete/<int:pk>/', SiteProfileDelete.as_view(), name='siteprofile_delete'),

    path('site_indicatordata/<int:site_id>/', IndicatorDataBySite.as_view(), name='site_indicatordata'),

    #ajax calls
    path('reportingperiod_update/<int:pk>/', reportingperiod_update, name='reportingperiod_update'),
]
