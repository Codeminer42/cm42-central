import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const StoryCopyIdClipboard = ({ id, onCopy }) => (
  <CopyToClipboard text={`#${id}`} onCopy={onCopy}>
    <p>#{id}</p>
  </CopyToClipboard>
);

export default StoryCopyIdClipboard;
