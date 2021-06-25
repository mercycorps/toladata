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

from rest_framework import routers
from rest_framework.authtoken import views as authtoken_views

from tola import views as tolaviews
from indicators.views import (
    program_page,
    old_program_page,
    views_program
)
from indicators.views.views_results_framework import (
    LevelViewSet,
    insert_new_level,
    save_leveltiers,
    reorder_indicators,
    save_custom_template,
    indicator_list
)
from workflow.views import dated_target_info

from django.urls import path, include

# Import i18n_patterns
from django.views.i18n import JavaScriptCatalog
from django.views.generic import TemplateView
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

admin.autodiscover()
admin.site.site_header = 'TolaData administration'

# REST FRAMEWORK
router = routers.DefaultRouter()
router.register(r'level', LevelViewSet)
router.register(r'programtargetfrequencies', ProgramTargetFrequencies, basename='programtargetfrequencies')

# tola admin
router.register(r'tola_management/user', UserAdminViewSet, basename='tolamanagementuser')
router.register(r'tola_management/organization', OrganizationAdminViewSet, basename='tolamanagementorganization')
router.register(r'tola_management/program', ProgramAdminViewSet, basename='tolamanagementprograms')
router.register(r'tola_management/country', CountryAdminViewSet, basename='tolamanagementcountry')
router.register(r'tola_management/countryobjective', CountryObjectiveViewset,
                basename='tolamanagementcountryobjective')
router.register(r'tola_management/countrydisaggregation', CountryDisaggregationViewSet,
                basename='tolamanagementcountrydisaggregation')

urlpatterns = []
if hasattr(settings, 'SILK_ENABLED') and settings.SILK_ENABLED:
    urlpatterns += [
        path('silk/', include('silk.urls', namespace='silk')),
    ]

urlpatterns += [
    path('jsi18n/', JavaScriptCatalog.as_view(), name='javascript-catalog'),

    # rest framework
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api-token-auth/', authtoken_views.obtain_auth_token),

    # enable admin documentation:
    path('admin/doc/', include('django.contrib.admindocs.urls')),

    # enable the admin:
    path('admin/', admin.site.urls),

    # api used  by reporting period modal
    path('datedtargetinfo/<int:pk>/', dated_target_info, name='datedtargetinfo'),

    # internationalization
    path('i18n/', include('django.conf.urls.i18n')),

    path('tola_management/', include('tola_management.urls')),
    path('saml_metadata/', tolaviews.saml_metadata_view, name="saml_metadata"),

    # Session Variable updates:
    path('update_user_session/', tolaviews.update_user_session, name='update_user_session'),

    # Site home page filtered by country
    path('<str:selected_country>/', tolaviews.index, name='index'),

    # Program page
    path('program/<int:program>/', program_page, name='program_page'),

    path('program/<int:program>/logframe/', views_program.logframe_view, name='logframe'),

    path('program/<int:program>/logframe_excel/', views_program.logframe_excel_view, name='logframe_excel'),

    # Results framework builder
    path('api/insert_new_level/', insert_new_level, name='insert_new_level'),
    path('api/save_leveltiers/', save_leveltiers, name='save_leveltiers'),
    path('api/reorder_indicators/', reorder_indicators, name='reorder_indicators'),
    path('api/indicator_list/<int:program_id>/', indicator_list, name='indicator_list'),
    path('api/save_custom_template/', save_custom_template, name='save_custom_template'),

    # url redirect for people with old bookmarks
    path('program/<int:program_id>/<int:indicator_id>/<int:indicator_type_id>/',
         old_program_page, name='old_program_page'),

    # app include of workflow urls
    path('workflow/', include('workflow.urls')),

    # app include of indicator urls
    path('indicators/', include('indicators.urls')),

    # url for updating fail mode api
    path('fail_mode_toggle', tolaviews.fail_mode_toggle, name='fail_mode_toggle'),

    # local login
    path('login/', tolaviews.TolaLoginView.as_view(), name='login'),
    path('accounts/login/', tolaviews.TolaLoginView.as_view(), name='login'),
    path('accounts/logout/', tolaviews.logout_view, name='logout'),

    # accounts
    path('accounts/profile/', tolaviews.profile, name='profile'),

    # Auth backend URL's
    path('accounts/invalid_user/', tolaviews.invalid_user_view, name='invalid_user'),
    path('accounts/invalid_user/okta/', TemplateView.as_view(template_name='registration/invalid_okta_user.html'),
         name='invalid_user_okta'),
    path('accounts/password_reset/', tolaviews.TolaPasswordResetView.as_view(), name='password_reset'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('', include('social_django.urls', namespace='social')),

    # Site home page
    path('', tolaviews.index, name='index'),


    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
    urlpatterns = [
        path('400/', TemplateView.as_view(template_name='400.html')),
        path('403/', TemplateView.as_view(template_name='403.html')),
        path('404/', TemplateView.as_view(template_name='404.html')),
        path('500/', TemplateView.as_view(template_name='500.html')),
    ] + urlpatterns
