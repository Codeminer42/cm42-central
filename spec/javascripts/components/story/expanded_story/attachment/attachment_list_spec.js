import React from 'react';
import { shallow } from 'enzyme';
import AttachmentList from 'components/story/attachment/AttachmentList';

describe('<AttachmentList/>', () => {
  const attachments = [{ id: 1 }, { id: 2 }, { id: 3 }];

  it('render all attachments in a <Attachment> component', () => {
    const onDelete = sinon.stub();

    const wrapper = shallow(
      <AttachmentList
        files={attachments}
        onDelete={onDelete}
      />
    );

    expect(wrapper.find('Attachment').length).toBe(attachments.length)
  });

  it('click on delete button calls onDelete with attachment id', () => {
    const onDelete = sinon.stub();
    const attachments = [{ id: 1 }, { id: 2 }]

    const deletedAttachment = attachments[0];

    const wrapper = shallow(
      <AttachmentList
        files={attachments}
        onDelete={onDelete}
      />
    );

    const firstAttachment = wrapper.find('Attachment')
      .findWhere(att =>
        att.prop('id') === deletedAttachment.id
      );

    const button = firstAttachment.find('button');

    button.simulate('click');
    expect(onDelete).toHaveBeenCalledWith(deletedAttachment.id)
  });
});
