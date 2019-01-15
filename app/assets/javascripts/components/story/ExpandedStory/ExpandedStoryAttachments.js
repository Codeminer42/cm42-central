import React from 'react';
import PropTypes from 'prop-types';
import * as AttachmentUrl from '../../../models/beta/attachmentUrl';
import AttachmentsList from '../attachment/AttachmentList';

const ExpandedStoryAttachments = ({ story }) =>
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


ExpandedStoryAttachments.PropTypes = {
  story: PropTypes.object.isRequired
};

export default ExpandedStoryAttachments;
