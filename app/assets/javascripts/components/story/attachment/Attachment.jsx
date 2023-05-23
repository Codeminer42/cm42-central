import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Attachment = ({
  link,
  children,
  type,
  publicId
}) => (
  <div className='attachment'>
    <a
      href={link}
      target="blank"
    >
      <AttachmentContent
        type={type}
        publicId={publicId}
        link={link}
      />
    </a>
    { children }
  </div>
)

const AttachmentContent = ({
  type,
  link,
  publicId
}) => (
  <div className={`attachment--${type}`}>
  {
    type === 'image' ?
      <img
        src={link.replace(/\.pdf$/, '.png')}
      />
      :
      <Fragment>
        <i className="mi md-20">library_books</i>
        { publicId }
      </Fragment>
  }
  </div>
)

Attachment.propTypes = {
  type: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  publicId: PropTypes.string.isRequired,
}

export default Attachment;
