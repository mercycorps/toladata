
/*
  Functions imported outside of webpack in main app for translations in Django
 */

window.gettext = jest.fn(s => s);
window.ngettext = jest.fn(s => s);
window.pgettext = jest.fn((c, s) => s);
window.npgettext = jest.fn(s => s);
window.interpolate = jest.fn(s => s);

window.userLang = window.userLang || 'en';