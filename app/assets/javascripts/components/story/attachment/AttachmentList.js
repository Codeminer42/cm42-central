import React from 'react';
import PropTypes from 'prop-types';
import Attachment from './Attachment';

const AttachmentsList = ({ files, publicLink }) =>
  <div>
    {
      files.map(file => {
        const link = `http://res.cloudinary.com/${publicLink}/${file.resourceType}/upload/${file.path}`

        return <Attachment
          id={file.id}
          key={file.id}
          link={link}
          publicId={file.publicId}
          type={file.resourceType}
        />
      })
    }
  </div>

AttachmentsList.PropTypes = {
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  publicLink: PropTypes.string.isRequired
}

export default AttachmentsList;

