// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'babel-polyfill';
import '@root/test_helpers/django_i18n_stubs';

configure({ adapter: new Adapter() });
