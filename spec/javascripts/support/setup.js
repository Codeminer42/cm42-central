import 'libs/index';
import 'raf/polyfill';
import './enzyme';
import 'jest-enzyme';

import * as JestDom from '@testing-library/jest-dom';

const { toHaveStyle: toHaveDomStyle, ...jestDomRest } = JestDom;

expect.extend({ toHaveDomStyle, ...jestDomRest });

window.sinon = require('sinon');
window.md = { makeHtml: function() {} };
window.process.env.CLOUDINARY_URL = 'cloudinary://username:password@localhost';
window.process.env.CLOUDINARY_UPLOAD_PRESET = '';
