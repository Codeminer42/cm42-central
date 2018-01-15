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
    this.state = {
      attachinaryOptions: {}
    }
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
    const field_name = name + ( this.state.attachinaryOptions.html.multiple ? '[]' : '' );
    let files = filesModel;

    if(files) {
      files = files.map(function(d) { return d.file });
    }

    const options = $.extend(this.state.attachinaryOptions.attachinary, {
      files_container_selector: '#' + attachinary_container_id,
      'files': files
    });
    const dataAttachinary = JSON.stringify(options);

    const dataFormData = JSON.stringify(this.state.attachinaryOptions.html.data.form_data);
    const dataUrl = this.state.attachinaryOptions.html.data.url;
    const multiple = (this.state.attachinaryOptions.html.multiple) ? 'multiple' : '';

    return {
      dataAttachinary: dataAttachinary,
      dataFormData: dataFormData,
      dataUrl: dataUrl,
      multiple: multiple
    };
  }

  componentWillMount() {
    this.setAttachinaryOptions();
  }

  setAttachinaryOptions() {
    this.getUpdatedSignature()
      .then((response) => {
        this.setState({
          attachinaryOptions: response,
        })
      })
  }

  updateSignature() {
    latestTimestamp = this.state.attachinaryOptions.html.data.form_data.timestamp * 1000;
    currentTimestamp = new Date().getTime();
    elapsedTime = currentTimestamp - latestTimestamp;
    timeToInvalidate = 3600000;
    if(elapsedTime >= timeToInvalidate){
      this.setAttachinaryOptions();
    }
  }

  getUpdatedSignature() {
    const options = {
      type: 'GET',
      dataType: 'json',
      url: '/attachments/signature'
    }

    return $.ajax(options);
  }

  renderAttachmentInput() {
    if (isEmpty(this.state.attachinaryOptions)) {
      return;
    }

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
        onClick={() => { this.updateSignature() }}

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
