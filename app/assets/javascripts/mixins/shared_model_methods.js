/* eslint no-param-reassign:"off" */
/* eslint no-undef:"off" */
module.exports = {

  // Returns the translated name of an attribute
  humanAttributeName(attribute) {
    attribute = attribute.replace(/_id$/, '');
    return I18n.t(attribute, { scope: this.i18nScope });
  },

  errorMessages() {
    return _.map(this.get('errors'), (errors, field) => _.map(errors, error => `${field} ${error}`).join(', ')).join(', ');
  },

  hasErrors() {
    return (!_.isUndefined(this.get('errors')));
  },

  errorsOn(field) {
    if (!this.hasErrors()) {
      return false;
    }
    return (!_.isUndefined(this.get('errors')[field]));
  },
};
