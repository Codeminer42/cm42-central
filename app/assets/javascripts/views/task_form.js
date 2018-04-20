/* eslint no-undef: "off" */
/* eslint no-unused-vars: "off" */
const FormView = require('./form_view');

module.exports = FormView.extend({

  tagName: 'div',

  className: 'task_form',

  events: {
    'click input[type=button]': 'saveTask',
  },

  render() {
    const div = this.make('div', { class: 'clearfix' });

    $(div).append(this.textField('name', { class: 'form-control input-sm' }));

    const submit = this.make('input', {
      id: 'task_submit',
      type: 'button',
      value: I18n.t('add task'),
      class: 'add-task btn btn-default btn-xs',
    });

    $(div).append(submit);

    this.$el.html(div);

    return this;
  },

  saveTask() {
    this.disableForm();

    const view = this;

    this.model.save(null, {
      success(model, response) {
      },

      error(model, response) {
        if (!response.responseText.trim()) return;

        const json = $.parseJSON(response.responseText);
        view.enableForm();
        model.set({ errors: json.task.errors });
        window.projectView.notice({
          title: I18n.t('save error', { defaultValue: 'Save error' }),
          text: model.errorMessages(),
        });
      },
    });
  },

  // Makes the note for uneditable during save
  disableForm() {
    this.$('input,text').attr('disabled', 'disabled');
    this.$('input[type="button"]').addClass('saving');
  },

  // Re-enables the note form once save is complete
  enableForm() {
    this.$('input,text').removeAttr('disabled');
    this.$('input[type="button"]').removeClass('saving');
  },

});
