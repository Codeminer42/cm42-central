import axios from 'axios';
import changeCase from 'change-object-case';
import * as AttachmentUrl from './attachmentUrl';
import * as Attachment from './attachment';

const uploadPreset = AttachmentUrl.uploadPreset();
const url = AttachmentUrl.uploadUrl();

export const upload = (file) => {
  const data = new FormData();

  data.append('upload_preset', uploadPreset);
  data.append('file', file);

  return axios.post(url, data)
    .then(({ data }) => changeCase.camelKeys(data, { recursive: true, arrayRecursive: true }))
    .then(Attachment.deserialize)
    .catch(err => {
      console.error(err)

      throw (err)
    })
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

