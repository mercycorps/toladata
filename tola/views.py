import json
import urllib
import logging
from social_django.utils import load_strategy, load_backend

from django.contrib import messages
from django.contrib.auth import logout
from django.contrib.auth import views as authviews
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, get_object_or_404
from django.urls import reverse_lazy, reverse
from django.db.models import Q
from django.utils.translation import gettext as _
from django.core.exceptions import PermissionDenied
from django.contrib.admin.views.decorators import staff_member_required

from workflow.models import SiteProfile, Country, TolaUser
from tola.forms import ProfileUpdateForm
from indicators.queries import ProgramWithMetrics


logger = logging.getLogger(__name__)

@login_required(login_url='/accounts/login/')
def index(request, selected_country=None):
    """
    Home page
    """

    # Find the active country
    user = request.user.tola_user
    user_countries = user.available_countries # all countries whose programs are available to the user
    user_country_codes = json.dumps(
        {country.code: country.country_page for country in user_countries})
    if selected_country:  # from URL
        if not user.available_countries.filter(id=selected_country).exists():
            raise PermissionDenied

        active_country = Country.objects.filter(id=selected_country)[0]
        user.update_active_country(active_country)
    else:
        try:
            # default to first country in user's accessible countries
            active_country = user.active_country if user.active_country else user_countries[0]
        except IndexError:
            # ... or failing that, to their "home" country
            active_country = user.country
            # ... failing all of this, the homepage will be blank. Sorry!

    active_country_id = None
    if active_country:
        active_country_id = active_country.id
        programs_with_metrics = ProgramWithMetrics.home_page.with_annotations().filter(
            Q(country__in=user.countries.filter(id=active_country_id)) |
            Q(programaccess__tolauser=user, programaccess__country=active_country) |
            Q(country=user.country),
            country=active_country,
            funding_status="Funded"
        ).distinct()
    else:
        programs_with_metrics = ProgramWithMetrics.objects.none()


    sites_with_results = SiteProfile.objects.all()\
        .prefetch_related('country') \
        .filter(Q(result__program__country=active_country))\
        .filter(status=1)

    sites_without_results = SiteProfile.objects.all() \
        .prefetch_related('country') \
        .filter(Q(country=active_country) & ~Q(result__program__country=active_country)) \
        .filter(status=1)

    return render(request, 'home.html', {
        'user_countries': user_countries,
        'user_country_codes': user_country_codes,
        'active_country': active_country,
        'programs': programs_with_metrics,
        'no_programs': programs_with_metrics.count(),
        'sites_without_results': sites_without_results,
        'sites_with_results': sites_with_results,
    })


class TolaLoginView(authviews.LoginView):
    def get(self, request, *args, **kwargs):
        if request.is_ajax():
            # Some places of our code loads HTML directly into a modal via $.load()
            # loading the login page (which uses base.html) blows up a lot of things
            # so avoid this by sending back a simple string instead
            response = HttpResponse(_('You are not logged in.'))
            # Header that jQuery AJAX can look for to see if a request was 302 redirected
            # responseURL could also be used but is not supported in older browsers
            response['Login-Screen'] = 'Login-Screen'
            return response

        return super(TolaLoginView, self).get(request, *args, **kwargs)

    def get_context_data(self, *args, **kwargs):
        context = super(TolaLoginView, self).get_context_data(*args, **kwargs)
        context['okta_url'] = u"{base}?{params}".format(
            base=reverse('social:begin', kwargs={'backend': 'saml'}),
            params=urllib.parse.urlencode({'next': '/', 'idp': 'okta'})
        )
        return context


class TolaPasswordResetView(authviews.PasswordResetView):

    def dispatch(self, request, *args, **kwargs):
        hostname = request.get_host()
        scheme = request.scheme
        self.extra_email_context = {
            'scheme': scheme,
            'hostname': hostname
        }
        return super(TolaPasswordResetView, self).dispatch(request, *args, **kwargs)





@login_required(login_url='/accounts/login/')
def profile(request):
    """
    Update a User profile using built in Django Users Model if the user is logged in
    otherwise redirect them to registration version
    """
    obj = get_object_or_404(TolaUser, user=request.user)
    form = ProfileUpdateForm(request.POST or None, instance=obj, user=request.user)

    if request.method == 'POST':
        if form.is_valid():
            form.save()
            messages.error(request, _('Your profile has been updated.'), fail_silently=False,
                           extra_tags='success')
            # immediately redirect so user sees language change
            return HttpResponseRedirect(reverse_lazy('profile'))
    return render(request, "registration/profile.html", {
        'form': form, 'helper': ProfileUpdateForm.helper
    })


@login_required(login_url='/accounts/login/')
@staff_member_required
def saml_metadata_view(request):
    complete_url = reverse('social:complete', args=("saml", ))
    saml_backend = load_backend(
        load_strategy(request),
        "saml",
        redirect_uri=complete_url,
    )
    metadata, errors = saml_backend.generate_metadata_xml()
    print(errors)
    if not errors:
        return HttpResponse(content=metadata, content_type='text/xml')
    else:
        return HttpResponse(status=500)


def logout_view(request):
    """
    Logout a user
    """
    logout(request)
    # Redirect to a success page.
    return HttpResponseRedirect("/")

def invalid_user_view(request):
    return render(request, 'registration/invalid_user.html')


@login_required
def update_user_session(request):
    """
    Update user session variables
        - expects a PUT with data being a JSON object of session keys and values
        - updates the user's currently active session with the new values
        - returns 202 "Accepted" on success
    """
    if request.is_ajax() and request.method == "PUT":
        error = None
        try:
            body = json.loads(request.body)
            for session_key, session_value in body.items():
                request.session[session_key] = session_value
            return HttpResponse(status=202)
        except json.decoder.JSONDecodeError as err:
            error = "Error processing session variable update request: {0} (request body {1})".format(err, body)
        except:
            error = "Error updating session variables (request body {0})".format(body)
        if error is not None:
            logger.error(error)
            return HttpResponse(error, status=500)
        return HttpResponse(status=204)
    logger.warning(
        "Attempted to access update_user_session with method: %s / %s, and payload: %s",
        request.method, "AJAX" if request.is_ajax() else "synchronous", request.body
    )
    return HttpResponseRedirect("/")
