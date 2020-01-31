import React from 'react';
import { shallow, mount } from 'enzyme';
import ExpandedStoryAttachments from 'components/story/ExpandedStory/ExpandedStoryAttachments';
import storyFactory from '../../../support/factories/storyFactory';

describe('<ExpandedStoryAttachments />', () => {
  const defaultProps = overrideProps => ({
    disabled: false,
    documents: [],
    onAdd: sinon.stub(),
    onDelete: sinon.stub(),
    story: storyFactory({
      _editing: { documents: [] }
    }),
    ...overrideProps
  });

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
          {
            id: '1',
            publicId: '1',
            resourceType: 'resource type'
          },
          {
            id: '2',
            publicId: '2',
            resourceType: 'resource type'
          },
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

      expect(wrapper.exists('[data-id="dropzone"]')).toBe(true);
    });
  });

  describe('when disabled', () => {
    it('does not render dropzone', () => {
      const documents = [
        {
          id: '1',
          publicId: '1',
          resourceType: 'resource type'
        },
        {
          id: '2',
          publicId: '2',
          resourceType: 'resource type'
        },
      ];
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

  describe('when needs to save', () => {
    it('renders <ExpandedStoryAttachmentsInfo />', () => {
      const props = defaultProps({ needsToSave: true });

      const wrapper = mount(
        <ExpandedStoryAttachments {...props} />
      );

      expect(wrapper.find('[data-id="attachments-info"]')).toExist();
    });
  });

  describe('when does not need to save', () => {
    it('does not render <ExpandedStoryAttachmentsInfo />', () => {
      const props = defaultProps({ needsToSave: false });

      const wrapper = mount(
        <ExpandedStoryAttachments {...props} />
      );

      expect(wrapper.find('[data-id="attachments-info"]')).not.toExist();
    });
  });
});
