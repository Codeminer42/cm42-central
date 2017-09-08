module.exports = Backbone.View.extend({
  tagName: 'form',

  label: function(elem_id, value) {
    value = value || this.model.humanAttributeName(elem_id);
    return this.make('label', {'for': elem_id}, value);
  },

  textField: function(name, extra_opts) {
    var defaults = {type: "text", name: name, value: this.model.get(name)}
    this.mergeAttrs(defaults, extra_opts);
    var el = this.make('input', defaults);
    this.bindElementToAttribute(el, name, "keyup");
    return el;
  },

  hiddenField: function(name) {
    var el = this.make('input', {type: "hidden", name: name, value: this.model.get(name)});
    this.bindElementToAttribute(el, name);
    return el;
  },

  textArea: function(name) {
    var el = this.make('textarea', {name: name, class: `form-control ${name}-textarea` }, this.model.get(name));
    $(el).attr('style', 'min-height:100px;');
    $(el).on('input', function () {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });

    this.bindElementToAttribute(el, name);
    return el;
  },

  select: function(name, select_options, options) {
    if (typeof options === 'undefined') {
      options = {};
    }

    options = _.defaults(options, { attrs: { class: [] } });

    options.attrs.class = 'form-control input-sm ' +options.attrs.class.join(' ');

    var select = this.make('select', _.extend({name: name}, options.attrs));

    var view = this;
    var model = this.model;


    if (options.blank) {
      $(select).append(this.make('option', {value: ''}, options.blank));
    }

    _.each(select_options, function(option) {
      var option_name, option_value;

      if (option instanceof Array) {
        option_name = option[0];
        option_value = option[1];
      } else {
        option_name = option_value = option + '';
      }
      var attr = {value: option_value};
      if (model.get(name) === option_value) {
        attr.selected = true;
      }
      $(select).append(view.make('option', attr, option_name));
    });
    this.bindElementToAttribute(select, name, 'change', options);
    return select;
  },

  checkBox: function(name) {
    var attr = {type: "checkbox", name: name, value: 1};
    if (this.model.get(name)) {
      attr.checked = "checked";
    }
    var el = this.make('input', attr);
    this.bindElementToAttribute(el, name);
    return el;
  },

  bindElementToAttribute: function(el, name, eventType, { silent = true } = {}) {
    var that = this;
    eventType = typeof(eventType) !== 'undefined' ? eventType : 'change';
    $(el).on(eventType, function() {
      var obj = {};
      obj[name] = $(el).val();
      that.model.set(obj, { silent });
      return true;
    });
  },

  mergeAttrs: function(defaults, opts) {
    return jQuery.extend(defaults, opts);
  }
});
