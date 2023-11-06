import jQuery from 'jquery';
import I18nJs from 'i18n-js';
import Underscore from 'underscore';
import Markdown from 'vendor/Markdown.Converter';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import Charkick from 'chartkick';
import CoreJsMap from 'core-js/library/fn/map';
import CoreJsSet from 'core-js/library/fn/set';
import Backbone from 'backbone';

window.$ = window.jQuery = jQuery;

window.Backbone = Backbone;

window.I18n = I18nJs;

window._ = Underscore;

window.md = new Markdown.Converter();

window.Chart = Chart;
window.Chartkick = Charkick;

window.Map = CoreJsMap;
window.Set = CoreJsSet;
