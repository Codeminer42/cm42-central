import React from 'react';
import { shallow, mount } from 'enzyme';
import ExpandedStoryNotes from 'components/story/ExpandedStory/ExpandedStoryNotes';
import storyFactory from '../../../support/factories/storyFactory';

describe('<ExpandedStoryNotes />', () => {
  let onCreate;
  let onDelete;

  const newStory = (notes) => ({
    ...storyFactory({ notes: notes || [] }),
    _editing: {
      ...storyFactory({ notes: notes || [] }),
    },
  });

  beforeEach(() => {
    onCreate = sinon.stub();
    onDelete = sinon.stub();
  });

  it('renders component title', () => {
    const story = newStory();

    const wrapper = mount(
      <ExpandedStoryNotes
        story={story}
        onCreate={onCreate}
        onDelete={onDelete}
        disabled={false}
      />
    );

    expect(wrapper.find('.Story__section-title').text())
      .toContain(I18n.t('story.notes'));
  });

  it('renders component content', () => {
    const story = newStory();

    const wrapper = mount(
      <ExpandedStoryNotes
        story={story}
        onCreate={onCreate}
        onDelete={onDelete}
        disabled={false}
      />
    );

    expect(wrapper.find('.create-note-text')).toExist();
    expect(wrapper.find('.create-note-button')).toExist();
    expect(wrapper.find('.Story__section__notes')).toExist();
    expect(wrapper.find('NotesList')).toExist();
  });

  describe('when component is enabled', () => {
    describe('when user create a new note', () => {
      it('triggers the onCreate callback passing the note', () => {
        const story = newStory();
  
        const change = 'newNote';
  
        const onCreateSpy = sinon.spy();
  
        const wrapper = mount(
          <ExpandedStoryNotes
            story={story}
            onCreate={onCreateSpy}
            onDelete={onDelete}
            disabled={false}
          />
        );
  
        const textArea = wrapper.find('.create-note-text');
        const button = wrapper.find('.create-note-button input');
  
        textArea.simulate('change', { target: { value: change } });
        button.simulate('click');
  
        expect(onCreateSpy).toHaveBeenCalledWith(change);
      });
    });

    it('disables the add note button if text area is empty', () => {
      const story = newStory();

      const wrapper = shallow(
        <ExpandedStoryNotes
          story={story}
          onCreate={onCreate}
          onDelete={onDelete}
          disabled={false}
        />
      );

      const textArea = wrapper.find('.create-note-text');
      const button = wrapper.find('.create-note-button input');

      textArea.simulate('change', { target: { value: '' } });
      expect(button.prop('disabled')).toBe(true);
    });
  });

  describe('when component is disabled', () => {
    it('does not render a create note button', () => {
      const notes = [{ id: 0, note: 'foo' }];
      const story = newStory(notes);

      const wrapper = shallow(
        <ExpandedStoryNotes
          story={story}
          onCreate={onCreate}
          onDelete={onDelete}
          disabled={true}
        />
      );

      expect(wrapper.exists('.create-note-button')).toBe(false);
    });

    it('does not render a create note text area', () => {
      const notes = [{ id: 0, note: 'foo' }];
      const story = newStory(notes);

      const wrapper = shallow(
        <ExpandedStoryNotes
          story={story}
          onCreate={onCreate}
          onDelete={onDelete}
          disabled={true}
        />
      );

      expect(wrapper.exists('.create-note-text')).toBe(false);
    });

    describe('when there are no notes', () => {
      it('renders nothing', () => {
        const story = newStory();

        const wrapper = shallow(
          <ExpandedStoryNotes
            story={story}
            onCreate={onCreate}
            onDelete={onDelete}
            disabled={true}
          />
        );

        expect(wrapper.html()).toBeNull();
      });
    });
  });
});
