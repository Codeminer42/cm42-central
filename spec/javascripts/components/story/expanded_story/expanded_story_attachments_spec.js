import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryAttachments from 'components/story/ExpandedStory/ExpandedStoryAttachments';

describe('<ExpandedStoryAttachments />', () => {
  let onAdd;
  let onDelete;

  beforeEach(() => {
    onAdd = sinon.stub();
    onDelete = sinon.stub();
  })

  it('renders component title', () => {
    const story = { _editing: { documents: [] } };

    const wrapper = shallow(
      <ExpandedStoryAttachments
        story={story}
        onAdd={onAdd}
        onDelete={onDelete}
      />
    );

    expect(wrapper.text()).toContain(I18n.t('story.attachments'));
  });

  it('renders attachments list with documents prop', () => {
    const story = {
      _editing: {
        documents: [
          { id: 1 },
          { id: 2 }
        ]
      }
    };

    const wrapper = shallow(
      <ExpandedStoryAttachments
        story={story}
        onAdd={onAdd}
        onDelete={onDelete}
      />
    );
    const AttachmentsList = wrapper.find('AttachmentsList');

    expect(AttachmentsList).toExist();
    expect(AttachmentsList.prop('files')).toEqual(story._editing.documents)
  });
});
