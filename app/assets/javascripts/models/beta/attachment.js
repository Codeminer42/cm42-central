import { setLoadingValue } from './story';
import PropTypes from 'prop-types';
import * as AttachmentUrl from './attachmentUrl';
import changeCase from 'change-object-case';
import httpService from '../../services/httpService';

export const deserialize = (data) => {
  const file = changeCase.camelKeys(data, {
    recursive: true,
    arrayRecursive: true
  })

  return {
    publicId: file.publicId,
    version: file.version,
    format: file.format,
    resourceType: file.resourceType,
    path: `v${file.version}/${file.publicId}.${file.format}`
  }
}

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

export const upload = async (file) => {
  const uploadPreset = AttachmentUrl.uploadPreset();
  const url = AttachmentUrl.uploadUrl();

  const newFile = new FormData();
  newFile.append('upload_preset', uploadPreset);
  newFile.append('file', file);

  const { data } = await httpService.post(url, newFile);

  return deserialize(data);
}

export const acceptedMimeTypes = () => [
  "text/*",
  "image/jpeg",
  "image/png",
  "image/psd",
  "image/vnd.adobe.photoshop",
  "application/x-photoshop",
  "application/photoshop",
  "application/psd",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.ms-excel",
  "application/pdf",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.text-master",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.graphics",
  "application/vnd.oasis.opendocument.presentation",
  "application/vnd.oasis.opendocument.database"
];
