from django import template
from django.utils.translation import (
    ugettext_lazy as _,
    get_language
)
from django.utils.safestring import mark_safe

register = template.Library()


@register.simple_tag
def form_guidance(form):
    """Returns the form guidance link code for a given form"""
    try:
        url = form.get_form_guidance_url(get_language())
        window_title = 'Form Help/Guidance'
        link_title = _('Help')
    except AttributeError:
        pass
    return mark_safe(
        """<div class="text-muted"><span>
            <a onclick="newPopup('%s','%s'); return false;" href="#" class="btn btn-link help-link">%s</a>
        </span></div>""" % (url, window_title, link_title)
    )
