import React from 'react';

class StoryAttachment extends React.Component {
  constructor(props) {
    super(props);
    this.saveInput = (input) => { this.filesInput = input };
    this.random = (Math.floor(Math.random() * 10000) + 1);
    this.progressElementId = "documents_progress_" + this.random;
    this.finishedElementId = "documents_finished_" + this.random;
    this.attachinaryContainerId = "attachinary_container_" + this.random;
  }

  componentDidMount() {
    const $filesInput = $(this.filesInput);
    $filesInput.off('fileuploadprogressall');
    $filesInput.on('fileuploadprogressall', (function(_this, _progressElementId, _finishedElementId) {
      return function(e, data) {
        var $progress = $('#' + _progressElementId);
        if ( $progress.is(":hidden") ) {
          $progress.show();
        }

        var progress = parseInt(data.loaded / data.total * 100, 10);
        $progress.css('width', progress + "%");

        if (progress === 100) {
          $progress.css('width', "1px");
          $progress.hide();

          $('#' + _finishedElementId).show();
        }
      };
    })(this, this.progressElementId, this.finishedElementId));
  }

  makeAttachinaryProps(name, progress_element_id, finished_element_id, attachinary_container_id, filesModel) {
    const field_name = name + ( ATTACHINARY_OPTIONS.html.multiple ? '[]' : '' );
    let files = filesModel;

    if(files) {
      files = files.map(function(d) { return d.file });
    }

    const options = $.extend(ATTACHINARY_OPTIONS.attachinary, {
      files_container_selector: '#' + attachinary_container_id,
      'files': files
    });
    const dataAttachinary = JSON.stringify(options);
    const dataFormData = JSON.stringify(ATTACHINARY_OPTIONS.html.data.form_data);
    const dataUrl = ATTACHINARY_OPTIONS.html.data.url;
    const multiple = (ATTACHINARY_OPTIONS.html.multiple) ? 'multiple' : '';

    return {
      dataAttachinary: dataAttachinary,
      dataFormData: dataFormData,
      dataUrl: dataUrl,
      multiple: multiple
    };
  }

  renderAttachmentInput() {
    const { name, filesModel } = this.props;
    let attachinary = this.makeAttachinaryProps(
      'documents',
      this.progressElementId,
      this.finishedElementId,
      this.attachinaryContainerId,
      filesModel
    );

    return(
      <input
        type='file'
        name={name}
        className='attachinary-input'
        ref={this.saveInput}
        multiple={attachinary.multiple}
        data-attachinary={attachinary.dataAttachinary}
        data-form-data={attachinary.dataFormData}
        data-url={attachinary.dataUrl}
      />
    );
  }

  renderProgressBar() {
    return(
      <div
        id={this.progressElementId}
        className='attachinary_progress_bar'
      />
    );
  }

  render() {
    const { name, isReadonly } = this.props;
    return(
      <div className="uploads">
        <label htmlFor={name}>{ I18n.t(`story.${name}`) }</label>
        { (!isReadonly) ? this.renderAttachmentInput() : null }
        { (!isReadonly) ? this.renderProgressBar() : null }
        <div id={this.attachinaryContainerId} />
      </div>
    );
  }
}

export default StoryAttachment;
