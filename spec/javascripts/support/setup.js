import 'libs/index';
import 'raf/polyfill';

import * as JestDom from '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

const { toHaveStyle: toHaveDomStyle, ...jestDomRest } = JestDom;

expect.extend({ toHaveDomStyle, ...jestDomRest });

export const user = userEvent.setup();

window.md = { makeHtml: function () {} };
window.process.env.CLOUDINARY_URL = 'cloudinary://username:password@localhost';
window.process.env.CLOUDINARY_UPLOAD_PRESET = '';
