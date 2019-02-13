import React from 'react';
import { shallow } from 'enzyme';
import Attachment from 'components/story/attachment/Attachment';

describe('<Attachment/>', () => {
  describe('when the attachment is a image', () => {
    let attachment;

    beforeEach(() => {
      attachment = {
        id: 42,
        type: 'image',
        publicId: 'attach1',
        link: 'attach.png'
      };
    })

    it('renders a image with link on src', () => {
      const wrapper = shallow(
        <Attachment
          id={attachment.id}
          type={attachment.type}
          publicId={attachment.publicId}
          link={attachment.link}
        />
      );

      const image = wrapper.find('img');

      expect(image).toExist();
      expect(image.prop('src')).toBe(attachment.link);
    });

    it('changes link from .pdf to .png to create a thumbnail', () => {
      attachment.link = 'document.pdf';
      const expectedLink = 'document.png'

      const wrapper = shallow(
        <Attachment
          id={attachment.id}
          type={attachment.type}
          publicId={attachment.publicId}
          link={attachment.link}
        />
      );

      const image = wrapper.find('img');
      expect(image.prop('src')).toBe(expectedLink);
    });
  });

  describe('when the attachment is a document', () => {
    let attachment;

    beforeEach(() => {
      attachment = {
        id: 42,
        type: 'raw',
        publicId: 'attach1',
        link: 'attach.docx'
      };
    })

    it('renders a document with a icon and the publicId', () => {
      const wrapper = shallow(
        <Attachment
          id={attachment.id}
          type={attachment.type}
          publicId={attachment.publicId}
          link={attachment.link}
        />
      );

      const attachmentDocument = wrapper.find(`.attachment--${attachment.type}`);

      expect(attachmentDocument.text()).toContain(attachment.publicId);
      expect(attachmentDocument.find('i')).toExist();
    });
  });
});
