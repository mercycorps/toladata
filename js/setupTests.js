// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'babel-polyfill';
import '@root/test_helpers/django_i18n_stubs';

import $ from 'jquery';
global.$ = global.jQuery = $;

import PNotify from 'pnotify/dist/es/PNotify.js'
global.PNotify = PNotify;

// this allows react components that call for bootstrap popovers as part of their lifecycle to be mounted for testing
$.fn.extend({
    popover: function() {return; },
})


configure({ adapter: new Adapter() });
