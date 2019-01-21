import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import AttachmentsList from '../attachment/AttachmentList';
import { upload, acceptedMimeTypes } from '../../../models/beta/fileUpload';

class ExpandedStoryAttachments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    }

    this.onFileDrop = this.onFileDrop.bind(this);
  }

  onFileDrop(files) {
    const newFile = files[0];
    const { onAdd } = this.props;

    this.setState({ loading: true },
      () => {
        upload(newFile)
          .then(attachment =>
            onAdd(attachment)
          )
          .then(() => this.setState({ loading: false }))
          .catch((error) => {
            console.error(error);
            this.setState({ loading: false });
          })
      }
    )
  }

  dropzoneClassName({ isDragActive, isDragReject }) {
    const className = 'attachments-dropzone'
    if (this.state.loading) {
      return `${className}--loading`
    }
    if (isDragReject) {
      return `${className}--reject`
    }
    if (isDragActive) {
      return `${className}--drag`
    }

    return null;
  }

  render() {
    const { story, onDelete } = this.props;
    return (
      <div className="Story__section">
        <div className="Story__section-title">
          {I18n.t('story.attachments')}
        </div>

        <div className="Story__section__attachments">
          <Dropzone
            onDrop={this.onFileDrop}
            accept={acceptedMimeTypes()}
            disabled={this.state.loading}
          >
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
            onDelete={onDelete}
          />
        </div>
      </div>
    );
  }
}

ExpandedStoryAttachments.PropTypes = {
  story: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired
};

export default ExpandedStoryAttachments;
