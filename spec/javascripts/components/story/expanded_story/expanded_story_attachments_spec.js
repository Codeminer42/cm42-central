import React from 'react';
import { shallow, mount } from 'enzyme';
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

    const wrapper = mount(
      <ExpandedStoryAttachments
        story={story}
        onAdd={onAdd}
        onDelete={onDelete}
        disabled={false}
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
        disabled={false}
      />
    );
    const AttachmentsList = wrapper.find('AttachmentsList');

    expect(AttachmentsList).toExist();
    expect(AttachmentsList.prop('files')).toEqual(story._editing.documents)
  });

  describe('when enabled', () => {
    it('renders dropzone', () => {
      const story = { _editing: { documents: [] } };

      const wrapper = mount(
        <ExpandedStoryAttachments
          story={story}
          onAdd={onAdd}
          onDelete={onDelete}
          disabled={false}
        />
      );

      expect(wrapper.exists('Dropzone')).toBe(true);
    });
  });

  describe('when disabled', () => {    
    it('does not render dropzone', () => {
      const documents = [{id: 1}];
      const story = { documents, _editing: { documents } };

      const wrapper = mount(
        <ExpandedStoryAttachments
          story={story}
          onAdd={onAdd}
          onDelete={onDelete}
          disabled={true}
        />
      );

      expect(wrapper.exists('Dropzone')).toBe(false);
    });

    describe('when there are no attachments', () => {
      it('renders nothing', () => {
        const documents = [];
        const story = { documents, _editing: { documents } };

        const wrapper = mount(
          <ExpandedStoryAttachments
            story={story}
            onAdd={onAdd}
            onDelete={onDelete}
            disabled={true}
          />
        );

        expect(wrapper.html()).toBeNull();
      });
    });
  });
});
