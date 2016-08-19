window.$ = window.jQuery = require('jquery');
require('jquery-ujs');
require('jquery-ui');
require('gritter');
require('jquery.scrollto');
require('bootstrap');
require('cloudinary_js/js/jquery.ui.widget');
require('cloudinary_js/js/jquery.iframe-transport');
require('cloudinary_js/js/jquery.fileupload');
require('cloudinary_js');
require('vendor/tag-it');

$(function() {
  $('.tag-tooltip').tooltip();
  return executeAttachinary();
});

window.executeAttachinary = function executeAttachinary() {
  return $('.attachinary-input').attachinary({
    template: "<ul>\n  <% for(var i=0; i<files.length; i++){ %>\n    <li>\n      <% if(files[i] && files[i].resource_type == \"raw\") { %>\n        <div class=\"raw-file\"><a href=\"<%= $.cloudinary.url(files[i].public_id, { resource_type: 'raw' }) %>\" target=\"_blank\"><%= files[i].public_id %></a></div>\n      <% } else { %>\n        <a href=\"<%= $.cloudinary.url(files[i].public_id) %>\" target=\"_blank\"><img\n          src=\"<%= $.cloudinary.url(files[i].public_id, { \"version\": files[i].version, \"format\": 'jpg', \"crop\": 'fill', \"width\": 75, \"height\": 75 }) %>\"\n          alt=\"\" width=\"75\" height=\"75\" /></a>\n      <% } %>\n      <a href=\"#\" data-remove=\"<%= files[i].public_id %>\">Remove</a>\n    </li>\n  <% } %>\n</ul>"
  });
}