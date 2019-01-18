import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import * as AttachmentUrl from '../../../models/beta/attachmentUrl';
import AttachmentsList from '../attachment/AttachmentList';
import { upload } from '../../../models/beta/fileUpload';

class ExpandedStoryAttachments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    }
  }

  dropzoneClassName({ isDragActive, isDragReject }) {
    const className = 'attachments-dropzone'
    if (this.state.loading) {
      return `${className}--loading`
    }
    else if (isDragReject) {
      return `${className}--reject`
    }
    else if (isDragActive) {
      return `${className}--drag`
    }

    return null;
  }

  render() {
    const { story, onEdit } = this.props;

    return (
      <div className="Story__section">
        <div className="Story__section-title">
          {I18n.t('story.attachments')}
        </div>

        <div className="Story__section__attachments">
          <Dropzone disabled={this.state.loading}>
            {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
              const className = this.dropzoneClassName({ isDragActive, isDragReject })

              return (
                <div
                  {...getRootProps()}
                  className={`btn btn-success attachments-dropzone ${className}`}
                >
                  <input {...getInputProps()} />
                  <i className="mi md-20">cloud_upload</i>
                  <div>
                    {!isDragReject ?
                      I18n.t('upload new file') :
                      I18n.t('reject new file')}
                  </div>
                </div>
              )
            }}
          </Dropzone>

          <AttachmentsList
            files={story._editing.documents}
            cloudName={AttachmentUrl.cloudName()}
            onDelete={onEdit}
          />
        </div>
      </div>
    );
  }
}

ExpandedStoryAttachments.PropTypes = {
  story: PropTypes.object.isRequired
};

export default ExpandedStoryAttachments;
