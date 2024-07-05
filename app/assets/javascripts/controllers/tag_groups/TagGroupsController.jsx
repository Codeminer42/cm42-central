import React from 'react';
import ReactDOM from 'react-dom';
import ColorPicker from 'components/tag_groups/ColorPicker';

export default () => {
  const bgColor = $('[name=bg-color]').data('current-color') || '#F17013';

  ReactDOM.render(
    <ColorPicker color={bgColor} />,
    document.getElementById('tag_group_color')
  );

  $(document).ajaxError(function (event, jqxhr, settings, thrownError) {
    $('#new_tag_group').renderFormErrors($.parseJSON(jqxhr.responseText));
  });

  $.fn.modalSuccess = function () {
    // close modal
    this.modal('hide');

    // clear form input elements
    // todo/note: handle textarea, select, etc
    this.find('form input[type="text"]').val('');

    // clear error state
    this.clearPreviousErrors();
  };

  $.fn.renderFormErrors = function (errors) {
    let $form = this,
      model = $form.data('model');

    // show error messages in input form-group help-block
    $.each(errors, function (field, messages) {
      let $input = $('input[name="' + model + '[' + field + ']"]');
      $input
        .closest('.form-group')
        .addClass('has-error')
        .find('.help-block')
        .html(messages.join(' & '));
    });
  };

  $.fn.clearPreviousErrors = function () {
    $('.form-group.has-error', this).each(function () {
      $('.help-block', $(this)).html('');
      $(this).removeClass('has-error');
    });
  };
};
