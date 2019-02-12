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
    ...story._editing,
    documents: [
      ...story._editing.documents,
      attachment
    ]
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
