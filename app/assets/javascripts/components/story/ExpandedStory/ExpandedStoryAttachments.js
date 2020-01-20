import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import AttachmentsList from '../attachment/AttachmentList';
import { upload, acceptedMimeTypes } from '../../../models/beta/attachment';
import { editingStoryPropTypesShape } from '../../../models/beta/story';
import ExpandedStorySection from './ExpandedStorySection';
import classname from 'classnames';
import { isEmpty } from 'underscore';
import ExpandedStoryAttachmentsInfo from './ExpandedStoryAttachmentsInfo';

const ExpandedStoryAttachments = ({
  onAdd,
  startLoading,
  onFailure,
  story,
  onDelete,
  disabled,
  needsToSave
}) => {
  const [ loading, setLoading ] = useState(false);

  const onFileDrop = (files, rejectedFiles) => {
    if (!isEmpty(rejectedFiles)) return;

    const [ newFile ] = files;

    setLoading(true)
    startLoading();

    upload(newFile)
      .then(onAdd)
      .then(() => setLoading(false))
      .catch((error) => {
        onFailure(error)
        console.error(error);
        setLoading(false)
      })
  }

  if (disabled && isEmpty(story.documents)) return null;

  return (
    <ExpandedStorySection
      title={I18n.t('story.attachments')}
      identifier="attachments"
    >
      {
        !disabled && (
          <Dropzone
            onDrop={onFileDrop}
            accept={acceptedMimeTypes()}
            disabled={loading}
            multiple={false}
            data-id="dropzone"
          >
            {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
              const className = classname(
                'btn btn-info attachments-dropzone',
                {
                  'attachments-dropzone--loading': loading,
                  'attachments-dropzone--reject': isDragReject,
                  'attachments-dropzone--drag': isDragActive
                }
              );

              return (
                <div
                  {...getRootProps()}
                  className={className}
                >
                  <input {...getInputProps()} />
                  <i className="mi md-20">cloud_upload</i>
                  <div>
                    {!isDragReject ?
                      I18n.t('upload_new_file') :
                      I18n.t('reject_new_file')}
                  </div>
                </div>
              )
            }}
          </Dropzone>
        )
      }
      {
        needsToSave && <ExpandedStoryAttachmentsInfo data-id="attachments-info" />
      }
      <AttachmentsList
        files={story._editing.documents}
        onDelete={onDelete}
        disabled={disabled}
      />
    </ExpandedStorySection>
  );
}

ExpandedStoryAttachments.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

ExpandedStoryAttachments.defaultProps = {
  needsToSave: false
}

export default ExpandedStoryAttachments;
