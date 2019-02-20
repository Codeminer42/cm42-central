import keycutViewTemplate from 'templates/keycut_view.ejs';

const KeycutView = Backbone.View.extend({
  template: keycutViewTemplate,
  tagName: 'div',
  id: 'keycut-help',

  events:  {
    'click a.close' : 'closeWindow'
  },

  render: function() {
    var that = this;
    that.$ = $;
    that.$('#main').append($(this.el).html(this.template));
    return this;
  },

  closeWindow: function() {
    $('#' + this.id).fadeOut(
      function() {
        $('#'+this.id).remove();
      }
    );
  }
});

export default KeycutView;
