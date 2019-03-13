import { setLoadingValue } from './story';
import PropTypes from 'prop-types';

export const deserialize = ({
  publicId,
  version,
  format,
  resourceType
}) =>
  (
    {
      publicId,
      version,
      format,
      resourceType,
      path: `v${version}/${publicId}.${format}`
    }
  )

export const addAttachment = (story, attachment) => ({
  ...story,
  _editing: {
    ...setLoadingValue(story._editing, false),
    documents: [
      ...story._editing.documents,
      attachment
    ],
  }
});

export const removeAttachment = (story, attachmentId) => {
  const attachments = story._editing.documents.filter(attachment =>
    attachment.id !== attachmentId
  );

  return {
    ...story,
    _editing: {
      ...story._editing,
      documents: attachments,
      _isDirty: true
    }
  }
}

export const attachmentPropTypesShape = PropTypes.shape({
  publicId: PropTypes.string,
  version: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  format: PropTypes.string,
  resourceType: PropTypes.string,
  path: PropTypes.string
});
