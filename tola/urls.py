from feed.views import (
    ProgramTargetFrequencies,
)
from tola_management.views import (
    UserAdminViewSet,
    OrganizationAdminViewSet,
)
from tola_management.programadmin import (
    ProgramAdminViewSet,
)
from tola_management.countryadmin import (
    CountryAdminViewSet,
    CountryObjectiveViewset,
    CountryDisaggregationViewSet,
)
from django.conf.urls import include, url
# Import i18n_patterns
from django.views.i18n import JavaScriptCatalog
from django.views.generic import TemplateView
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from rest_framework.authtoken import views as authtoken_views


from tola import views as tolaviews
from indicators.views import program_page, old_program_page
from indicators.views.views_results_framework import (
    LevelViewSet, insert_new_level, save_leveltiers, reorder_indicators, save_custom_tiers, save_custom_template, indicator_list)
from indicators.views import views_program
from workflow.views import dated_target_info

admin.autodiscover()
admin.site.site_header = 'Tola Activity administration'

#REST FRAMEWORK
router = routers.DefaultRouter()
router.register(r'level', LevelViewSet)
router.register(r'programtargetfrequencies', ProgramTargetFrequencies, base_name='programtargetfrequencies')

#tola admin
router.register(r'tola_management/user', UserAdminViewSet, base_name='tolamanagementuser')
router.register(r'tola_management/organization', OrganizationAdminViewSet, base_name='tolamanagementorganization')
router.register(r'tola_management/program', ProgramAdminViewSet, base_name='tolamanagementprograms')
router.register(r'tola_management/country', CountryAdminViewSet, base_name='tolamanagementcountry')
router.register(r'tola_management/countryobjective', CountryObjectiveViewset,
                base_name='tolamanagementcountryobjective')
router.register(r'tola_management/countrydisaggregation', CountryDisaggregationViewSet,
                base_name='tolamanagementcountrydisaggregation')


urlpatterns = [
    url(r'^jsi18n/$', JavaScriptCatalog.as_view(), name='javascript-catalog'),

    # rest framework
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api-token-auth/', authtoken_views.obtain_auth_token),

    # enable the admin:
    url(r'^admin/', admin.site.urls),

    # enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # api used  by reporting period modal
    url(r'^datedtargetinfo/(?P<pk>\w+)/$', dated_target_info, name='datedtargetinfo'),

    # internationalization
    url(r'^i18n/', include('django.conf.urls.i18n')),

    url(r'^tola_management/', include('tola_management.urls')),
    url(r'^saml_metadata/$', tolaviews.saml_metadata_view, name="saml_metadata"),

    # Site home page filtered by country
    url(r'^(?P<selected_country>\w+)/$', tolaviews.index, name='index'),

    # Program page
    url(r'^program/(?P<program>\d+)/$', program_page, name='program_page'),

    url(r'^program/(?P<program>\d+)/logframe/$',
        views_program.logframe_view, name='logframe'),

    url(r'^program/(?P<program>\d+)/logframe_excel/$',
        views_program.logframe_excel_view, name='logframe_excel'),

    # Results framework builder
    url(r'^api/insert_new_level', insert_new_level, name='insert_new_level'),
    url(r'^api/save_leveltiers', save_leveltiers, name='save_leveltiers'),
    url(r'^api/reorder_indicators', reorder_indicators, name='reorder_indicators'),
    url(r'^api/indicator_list/(?P<program_id>\d+)/$', indicator_list, name='indicator_list'),
    url(r'^api/save_custom_tiers', save_custom_tiers, name='save_custom_tiers'),
    url(r'^api/save_custom_template', save_custom_template, name='save_custom_template'),

    # url redirect for people with old bookmarks
    url(r'^program/(?P<program_id>\d+)/(?P<indicator_id>\d+)/(?P<indicator_type_id>\d+)/$',
        old_program_page, name='old_program_page'),

    # app include of workflow urls
    url(r'^workflow/', include('workflow.urls')),

    # app include of indicator urls
    url(r'^indicators/', include('indicators.urls')),


    # app include of workflow urls
    url(r'^formlibrary/', include('formlibrary.urls')),

    # local login
    url(r'^login/$', tolaviews.TolaLoginView.as_view(), name='login'),
    url(r'^accounts/login/$', tolaviews.TolaLoginView.as_view(), name='login'),
    url(r'^accounts/logout/$', tolaviews.logout_view, name='logout'),

    # accounts
    url(r'^accounts/profile/$', tolaviews.profile, name='profile'),

    # Auth backend URL's
    url(r'^accounts/invalid_user/$', tolaviews.invalid_user_view, name='invalid_user'),
    url(r'^accounts/invalid_user/okta/$', TemplateView.as_view(template_name='registration/invalid_okta_user.html'),
        name='invalid_user_okta'),
    url(r'^accounts/password_reset/$', tolaviews.TolaPasswordResetView.as_view(), name='password_reset'),
    url(r'accounts/', include('django.contrib.auth.urls')),
    url('', include('social_django.urls', namespace='social')),

    #url(r'^oauth/', include('social_django.urls', namespace='social')),
    # Site home page
    url(r'^$', tolaviews.index, name='index'),


    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
    urlpatterns = [
        url(r'^500/$', TemplateView.as_view(template_name='500.html')),
        url(r'^404/$', TemplateView.as_view(template_name='404.html')),
    ] + urlpatterns
