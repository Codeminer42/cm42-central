/* eslint global-require:"off" */
module.exports = Backbone.View.extend({

  className: 'velocity_override_container',

  events: {
    'click button[name=apply]': 'changeVelocity',
    'click button[name=revert]': 'revertVelocity',
    'keydown input[name=override]': 'keyCapture',
  },

  template: require('templates/project_velocity_override.ejs'),

  render() {
    this.$el.html(this.template({ project: this.model }));
    this.delegateEvents();
    this.clickOverlayOn();
    return this;
  },

  changeVelocity() {
    this.model.velocity(this.requestedVelocityValue());
    this.clickOverlayOff();
    return false;
  },

  revertVelocity() {
    this.model.revertVelocity();
    this.clickOverlayOff();
    return false;
  },

  requestedVelocityValue() {
    return parseInt(this.$('input[name=override]').val(), 10);
  },

  keyCapture(e) {
    if (e.keyCode === '13') {
      this.changeVelocity();
    }
  },

  clickOverlayOn() {
    const that = this;
    const clickOverlay = this.$('.click-overlay');
    this.$('#velocity').css('z-index', 2000);
    clickOverlay.on('click', () => {
      that.clickOverlayOff();
    }, this);
    clickOverlay.show();
  },

  clickOverlayOff() {
    const clickOverlay = this.$('.click-overlay');
    clickOverlay.off('click');
    this.$el.remove();
    clickOverlay.hide();
  },
});
