import { fireEvent } from '@testing-library/react';
import ExpandedStoryNotes from 'components/story/ExpandedStory/ExpandedStoryNotes';
import React from 'react';
import storyFactory from '../../../support/factories/storyFactory';
import { renderWithProviders } from '../../setupRedux';

describe('<ExpandedStoryNotes />', () => {
  vi.spyOn(window.md, 'makeHtml').mockReturnValue('<p>Test</p>');

  const onCreate = vi.fn();
  const onDelete = vi.fn();

  const newStory = notes => ({
    ...storyFactory({ notes: notes || [] }),
    _editing: {
      ...storyFactory({ notes: notes || [] }),
    },
  });

  const renderComponent = props => {
    const defaultProps = {
      story: {
        ...storyFactory({ notes: [] }),
        _editing: {
          ...storyFactory({ notes: [] }),
        },
      },
      disabled: false,
    };

    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(<ExpandedStoryNotes {...mergedProps} />);
  };

  it('renders component title', () => {
    const props = {
      onCreate,
      onDelete,
    };

    const { container } = renderComponent(props);
    const title = container.querySelector('.Story__section-title');

    expect(title).toHaveTextContent(I18n.t('story.notes'));
  });

  it('renders component content', () => {
    const props = {
      onCreate,
      onDelete,
      story: {
        ...storyFactory({ notes: [{ username: 'foo' }] }),
        _editing: {
          ...storyFactory({ notes: [{ username: 'foo' }] }),
        },
      },
    };

    const { container } = renderComponent(props);
    const createNoteText = container.querySelector('.create-note-text');
    const createNoteButton = container.querySelector('.create-note-button');
    const storySectionNotes = container.querySelector('.Story__section__notes');
    const notelist = container.querySelector('.markdown-wrapper__text-right');

    expect(createNoteText).toBeInTheDocument();
    expect(createNoteButton).toBeInTheDocument();
    expect(storySectionNotes).toBeInTheDocument();
    expect(notelist).toBeInTheDocument();
  });

  describe('when component is enabled', () => {
    describe('when user create a new note', () => {
      it('triggers the onCreate callback passing the note', () => {
        const onCreateSpy = vi.fn();
        const change = 'newNote';
        const props = {
          onCreate: onCreateSpy,
          onDelete,
          disabled: false,
        };

        const { container } = renderComponent(props);
        const textArea = container.querySelector('.create-note-text');
        const button = container.querySelector('.create-note-button input');

        fireEvent.change(textArea, { target: { value: change } });
        fireEvent.click(button);

        expect(onCreateSpy).toHaveBeenCalledWith(change);
        expect(onCreateSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('disables the add note button if text area is empty', () => {
      const props = {
        onCreate,
        onDelete,
        disabled: false,
      };

      const { container } = renderComponent(props);
      const textArea = container.querySelector('.create-note-text');
      const button = container.querySelector('.create-note-button input');
      fireEvent.change(textArea, { target: { value: '' } });

      expect(button).toBeDisabled();
    });
  });

  describe('when component is disabled', () => {
    it('does not render a create note button', () => {
      const notes = [{ id: 0, note: 'foo' }];
      const story = newStory(notes);
      const props = {
        onCreate,
        onDelete,
        disabled: true,
        story,
      };

      const { container } = renderComponent(props);
      const createNoteButton = container.querySelector('.create-note-button');

      expect(createNoteButton).toBeNull();
    });

    it('does not render a create note text area', () => {
      const notes = [{ id: 0, note: 'foo' }];
      const story = newStory(notes);
      const props = {
        onCreate,
        onDelete,
        disabled: true,
        story,
      };

      const { container } = renderComponent(props);

      expect(container.querySelector('.create-note-text')).toBeNull();
    });

    describe('when there are no notes', () => {
      it('renders nothing', () => {
        const story = newStory();
        const props = {
          onCreate,
          onDelete,
          disabled: true,
          story,
        };

        const { container } = renderComponent(props);

        expect(container.innerHTML).toBe('');
      });
    });
  });
});
