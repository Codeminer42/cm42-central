import React from 'react';
import PropTypes from 'prop-types';

class Attachment extends React.Component {
  renderAttachmentContent() {
    const { type, link, publicId } = this.props;
    const imageSrc = link.replace('.pdf', '.png');

    return (
      <div className={`attachment--${type}`}>
        {
          type === 'image' ?
            <img
              src={imageSrc}
            />
            :
            <div>
              <i className="mi md-20">library_books</i>
              {publicId}
            </div>
        }
      </div>
    )
  }

  render() {
    const { link } = this.props;

    return (
      <div className='attachment'>
        <a
          href={link}
          target="blank"
        >
          {this.renderAttachmentContent()}
        </a>
      </div>
    );
  }
}

Attachment.PropTypes = {
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  publicLink: PropTypes.string.isRequired
}

export default Attachment;
