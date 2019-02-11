require('libs');
require('./polyfills/objectAssign');
require('./extra/jasmine-sinon');
require('./extra/jasmine-jquery');
require('es6-promise/auto');
require('core-js/shim');

var context = require.context('.', true, /.+_spec\.js$/);

context.keys().forEach(context);

module.exports = context;
