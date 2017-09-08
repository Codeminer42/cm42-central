module.exports = Backbone.View.extend({

  className: 'velocity_override_container',

  events: {
    "click button[name=apply]": "changeVelocity",
    "click button[name=revert]": "revertVelocity",
    "keydown input[name=override]": "keyCapture"
  },

  template: require('templates/project_velocity_override.ejs'),

  render: function() {
    this.$el.html(this.template({project: this.model}));
    this.delegateEvents();
    this.clickOverlayOn();
    return this;
  },

  changeVelocity: function() {
    this.model.velocity(this.requestedVelocityValue());
    this.clickOverlayOff();
    return false;
  },

  revertVelocity: function() {
    this.model.revertVelocity();
    this.clickOverlayOff();
    return false;
  },

  requestedVelocityValue: function() {
    return parseInt(this.$("input[name=override]").val(), 10);
  },

  keyCapture: function(e) {
    if(e.keyCode === '13') {
      this.changeVelocity();
    }
  },

  clickOverlayOn: function() {
    var that = this;
    var clickOverlay = this.$('.click-overlay')
    this.$('#velocity').css('z-index', 2000);
    clickOverlay.on('click', function() {
      that.clickOverlayOff();
    }, this);
    clickOverlay.show();
  },

  clickOverlayOff: function() {
    var clickOverlay = this.$('.click-overlay')
    clickOverlay.off('click');
    this.$el.remove();
    clickOverlay.hide();
  }
});
