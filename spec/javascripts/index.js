import 'libs';
import './polyfills/objectAssign';
import './extra/jasmine-sinon';
import 'es6-promise/auto';
import 'raf/polyfill';
import 'core-js';
import './enzyme';

window.md = { makeHtml: function() {} };
var context = require.context('.', true, /.+_spec\.js$/);

context.keys().forEach(context);

export default context;
