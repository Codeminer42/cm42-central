import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const StoryCopyIdClipboard = ({ id }) => (
  <CopyToClipboard text={I18n.t('story.events.copy_id')}>
    <p>#{id}</p>
  </CopyToClipboard>
);

export default StoryCopyIdClipboard;
