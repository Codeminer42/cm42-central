import 'libs/index';
import 'raf/polyfill';
import './enzyme';
import '@testing-library/jest-dom/extend-expect';

window.sinon = require('sinon');
window.md = { makeHtml: function() {} };
window.process.env.CLOUDINARY_URL = 'cloudinary://username:password@localhost';
window.process.env.CLOUDINARY_UPLOAD_PRESET = '';
