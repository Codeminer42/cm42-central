module.exports = Backbone.View.extend({
  template: require('templates/keycut_view.ejs'),
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
