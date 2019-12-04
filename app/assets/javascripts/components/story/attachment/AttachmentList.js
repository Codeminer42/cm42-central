import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Attachment from './Attachment';
import * as AttachmentURL from '../../../models/beta/attachmentUrl';
import AttachmentPropTypes from '../../shapes/attachment';

const AttachmentsList = ({ files, onDelete, disabled }) =>
  <Fragment>
    {
      files.map(file => {
        const link = AttachmentURL.getFileLink(file.resourceType, file.path);
        return (
          <Attachment
            id={file.id}
            key={file.publicId}
            link={link}
            publicId={file.publicId}
            type={file.resourceType}
            key={file.id}
          >
            {
              !disabled && (
                <button
                  onClick={() => onDelete(file.id)}
                  className="btn btn-danger btn-xs"
                >
                  <i className="mi md-18">delete</i>
                  {I18n.t('delete')}
                </button>
              )
            }
          </Attachment>
        )
      })
    }
  </Fragment>

AttachmentsList.propTypes = {
  files: PropTypes.arrayOf(AttachmentPropTypes.isRequired),
  onDelete: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
}

export default AttachmentsList;
