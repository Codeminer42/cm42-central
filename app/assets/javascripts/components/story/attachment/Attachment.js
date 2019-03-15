import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

class Attachment extends React.Component {
  renderAttachmentContent() {
    const { type, link, publicId } = this.props;
    const imageSrc = link.replace(/\.pdf$/, '.png');

    return (
      <div className={`attachment--${type}`}>
        {
          type === 'image' ?
            <img
              src={imageSrc}
            />
            :
            <Fragment>
              <i className="mi md-20">library_books</i>
              {publicId}
            </Fragment>
        }
      </div>
    )
  }

  render() {
    const { link, children } = this.props;

    return (
      <div className='attachment'>
        <a
          href={link}
          target="blank"
        >
          { this.renderAttachmentContent() }
        </a>
        { children }
      </div>
    );
  }
}

Attachment.propTypes = {
  type: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  publicId: PropTypes.string.isRequired,
}

export default Attachment;
