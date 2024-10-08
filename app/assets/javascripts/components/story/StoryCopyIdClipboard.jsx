import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const StoryCopyIdClipboard = ({ id }) => (
  <CopyToClipboard text={id}>
    <p>#{id}</p>
  </CopyToClipboard>
);

export default StoryCopyIdClipboard;
