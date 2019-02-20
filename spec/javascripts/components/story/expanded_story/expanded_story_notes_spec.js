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

    expect(wrapper.find('.Story__section-title').text())
      .toContain(I18n.t('story.notes'));
  });

  it('renders component content', () => {
    const story = { notes: [] };

    const wrapper = shallow(
      <ExpandedStoryNotes
        story={story}
        onCreate={onCreate}
        onDelete={onDelete}
      />
    );

    expect(wrapper.find('.create-note-text')).toExist();
    expect(wrapper.find('.create-note-button')).toExist();
    expect(wrapper.find('.Story__section__notes')).toExist();
    expect(wrapper.find('NotesList')).toExist();
  });

  it('disables the add note button if text area is empty', ()=>{
    const story = { notes: [] };

    const wrapper = shallow(
      <ExpandedStoryNotes
        story={story}
        onCreate={onCreate}
        onDelete={onDelete}
      />
    );
    
    const textArea = wrapper.find('.create-note-text');
    const button = wrapper.find('.create-note-button input');

    textArea.simulate('change', { target: { value: '' } });
    expect(button.prop('disabled')).toBe(true);
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
