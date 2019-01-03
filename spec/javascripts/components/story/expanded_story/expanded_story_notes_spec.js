import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryNotes from 'components/story/ExpandedStory/ExpandedStoryNotes';

describe('<ExpandedStoryNotes />', () => {
  let onCreate;
  let onDelete;

  beforeEach(() => {
    onCreate = sinon.stub();
    onDelete = sinon.stub();
  })

  it('renders component title', () => {
    const story = { notes: [] };

    const wrapper = shallow(
      <ExpandedStoryNotes
        story={story}
        onCreate={onCreate}
        onDelete={onDelete}
      />
    );

    expect(wrapper.text()).toContain(I18n.t('story.notes'));
  });

  it('renders component content', ()=>{
    const story = { notes: [] };

    const wrapper = shallow(
      <ExpandedStoryNotes
        story={story}
        onCreate={onCreate}
        onDelete={onDelete}
      />
    );

    expect(wrapper.exists('.create-note-text')).toBe(true);
    expect(wrapper.exists('.create-note-button')).toBe(true);
    expect(wrapper.exists('.Story__section__notes')).toBe(true);
    expect(wrapper.exists('NotesList')).toBe(true);
  });

  describe('when user create a new note', () => {
    it('triggers the onCreate callback passing the note', () => {
      const story = {
        notes: []
      };

      const change = 'newNote';

      const onCreateSpy = sinon.spy();

      const wrapper = shallow(
        <ExpandedStoryNotes
          story={story}
          onCreate={onCreateSpy}
          onDelete={onDelete}
        />
      );

      const textArea = wrapper.find('.create-note-text');
      const button = wrapper.find('.create-note-button input');

      textArea.simulate('change', { target: { value: change } });
      button.simulate('click');

      expect(onCreateSpy).toHaveBeenCalledWith(change);
    });
  });
});
