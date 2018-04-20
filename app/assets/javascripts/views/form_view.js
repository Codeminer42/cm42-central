/* eslint camelcase:"off" */
/* eslint no-param-reassign:"off" */
/* eslint func-names:"off" */
/* eslint prefer-destructuring:"off" */
/* eslint one-var:"off" */
/* eslint no-multi-assign:"off" */
module.exports = Backbone.View.extend({
  tagName: 'form',

  label(elem_id, value) {
    value = value || this.model.humanAttributeName(elem_id);
    return this.make('label', { for: elem_id }, value);
  },

  textField(name, extra_opts) {
    const defaults = { type: 'text', name, value: this.model.get(name) };
    this.mergeAttrs(defaults, extra_opts);
    const el = this.make('input', defaults);
    this.bindElementToAttribute(el, name, 'keyup');
    return el;
  },

  hiddenField(name) {
    const el = this.make('input', { type: 'hidden', name, value: this.model.get(name) });
    this.bindElementToAttribute(el, name);
    return el;
  },

  textArea(name) {
    const el = this.make('textarea', { name, class: `form-control ${name}-textarea` }, this.model.get(name));
    $(el).attr('style', 'min-height:100px;');
    $(el).on('input', function () {
      this.style.height = 'auto';
      this.style.height = `${this.scrollHeight}px`;
    });

    this.bindElementToAttribute(el, name);
    return el;
  },

  select(name, select_options, options) {
    if (typeof options === 'undefined') {
      options = {};
    }

    options = _.defaults(options, { attrs: { class: [] } });

    options.attrs.class = `form-control input-sm ${options.attrs.class.join(' ')}`;

    const select = this.make('select', _.extend({ name }, options.attrs));

    const view = this;
    const model = this.model;


    if (options.blank) {
      $(select).append(this.make('option', { value: '' }, options.blank));
    }

    _.each(select_options, (option) => {
      let option_name,
        option_value;

      if (option instanceof Array) {
        option_name = option[0];
        option_value = option[1];
      } else {
        option_name = option_value = `${option}`;
      }
      const attr = { value: option_value };
      if (model.get(name) === option_value) {
        attr.selected = true;
      }
      $(select).append(view.make('option', attr, option_name));
    });
    this.bindElementToAttribute(select, name, 'change', options);
    return select;
  },

  checkBox(name) {
    const attr = { type: 'checkbox', name, value: 1 };
    if (this.model.get(name)) {
      attr.checked = 'checked';
    }
    const el = this.make('input', attr);
    this.bindElementToAttribute(el, name);
    return el;
  },

  bindElementToAttribute(el, name, eventType, { silent = true } = {}) {
    const that = this;
    eventType = typeof (eventType) !== 'undefined' ? eventType : 'change';
    $(el).on(eventType, () => {
      const obj = {};
      obj[name] = $(el).val();
      that.model.set(obj, { silent });
      return true;
    });
  },

  mergeAttrs(defaults, opts) {
    return jQuery.extend(defaults, opts);
  },
});
