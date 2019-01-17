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

      throw(err)
    })
}
