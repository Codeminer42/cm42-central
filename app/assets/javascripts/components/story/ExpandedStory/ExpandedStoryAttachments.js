import React from 'react';
import PropTypes from 'prop-types';
import * as AttachmentUrl from '../../../models/beta/attachmentUrl';

class ExpandedStoryAttachments extends React.Component {
  render() {
    const { story } = this.props;

    return (
      <div className="Story__section">
        <div className="Story__section-title">
          {I18n.t('story.attachments')}
        </div>

        <div className="Story__section__attachments">
          <AttachmentsList
            files={story.documents}
            publicLink={AttachmentUrl.cloudnaryPublicLink()}
          />
        </div>
      </div>
    );
  }
};

const AttachmentsList = ({ files, publicLink }) => {
  return (
    <div>
      {
        files.map(file => {
          const link = `http://res.cloudinary.com/${publicLink}/${file.resourceType}/upload/${file.path}`
          return (<Attachment
            id={file.id}
            key={file.id}
            link={link}
          />)
        })
      }
    </div>
  );
}

const Attachment = ({ link }) => (
  <div className="attachment">
    <a
      href={link}
      target="blank">
      <img
        src={link}
      />
    </a>
  </div>
);

ExpandedStoryAttachments.PropTypes = {
  story: PropTypes.object.isRequired
};

export default ExpandedStoryAttachments;
