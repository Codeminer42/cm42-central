import 'libs/index';
import 'raf/polyfill';
import './enzyme';
import '@testing-library/jest-dom/extend-expect';

window.sinon = require('sinon');
window.md = { makeHtml: function() {} };
