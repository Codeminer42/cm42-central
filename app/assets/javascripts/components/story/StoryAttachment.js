import React from 'react';
import { isEmpty } from 'underscore';

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
    $('.story-attachments').append($.cloudinary.unsigned_upload_tag(process.env.PRESET_CLOUD, 
      {cloud_name: process.env.CLOUD_NAME, tags: 'browser_uploads'},
      {multiple: true})
    );
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

  buildProps(args) {
    const {
      name, progressElementId,
      finishedElementId, attachinaryContainerId,
      filesModel, options
    } = args;
    let files = filesModel;

    files = _.reject(filesModel, _.isEmpty).map(function(d) { return d.file });

    const extendedOptions = $.extend(options.attachinary, {
      files_container_selector: '#' + attachinaryContainerId,
      'files': files
    });
    const dataAttachinary = JSON.stringify(extendedOptions);
    const dataFormData = JSON.stringify(options.html.data.form_data);
    const dataUrl = options.html.data.url;
    const multiple = (options.html.multiple) ? 'multiple' : '';
    return {
      dataAttachinary: dataAttachinary,
      dataFormData: dataFormData,
      dataUrl: dataUrl,
      multiple: multiple
    };
  }

  renderAttachmentInput() {
    const { name, filesModel, options } = this.props;

    if(isEmpty(options)){
      return;
    }
    let inputProps = this.buildProps({
      name: 'documents',
      progressElementId: this.progressElementId,
      finishedElementId: this.finishedElementId,
      attachinaryContainerId: this.attachinaryContainerId,
      filesModel: filesModel,
      options: options,
    });

    return(
      <input
        type='file'
        name={name}
        className='attachinary-input'
        ref={this.saveInput}
        multiple={inputProps.multiple}
        data-attachinary={inputProps.dataAttachinary}
        data-form-data={inputProps.dataFormData}
        data-url={inputProps.dataUrl}
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
