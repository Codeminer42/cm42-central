require('libs');
require('./polyfills/objectAssign');
require('./extra/jasmine-sinon');
require('es6-promise/auto');
import 'raf/polyfill';
import 'core-js';
import './enzyme';

window.md = { makeHtml: function() {} };
var context = require.context('.', true, /.+_spec\.js$/);

context.keys().forEach(context);

module.exports = context;
