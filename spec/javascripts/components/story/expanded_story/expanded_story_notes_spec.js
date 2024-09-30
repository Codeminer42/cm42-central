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
        ...storyFactory({ notes: [{ username: 'foo', id: 1 }] }),
        _editing: {
          ...storyFactory({ notes: [{ username: 'foo', id: 2 }] }),
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
    const onCreateSpy = vi.fn();
    const props = {
      onCreate: onCreateSpy,
      onDelete,
      disabled: false,
    };
    const change = 'newNote';

    describe('when user create a new note', () => {
      it('triggers the onCreate callback passing the note', () => {
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
      const { container } = renderComponent(props);
      const textArea = container.querySelector('.create-note-text');
      const button = container.querySelector('.create-note-button input');
      fireEvent.change(textArea, { target: { value: '' } });

      expect(button).toBeDisabled();
    });
  });

  describe('when component is disabled', () => {
    const props = {
      onCreate,
      onDelete,
      disabled: true,
      story: newStory([{ id: 0, note: 'foo' }]),
    };

    it('does not render a create note button', () => {
      const { container } = renderComponent(props);
      const createNoteButton = container.querySelector('.create-note-button');

      expect(createNoteButton).toBeNull();
    });

    it('does not render a create note text area', () => {
      const { container } = renderComponent(props);

      expect(container.querySelector('.create-note-text')).toBeNull();
    });

    describe('when there are no notes', () => {
      it('renders nothing', () => {
        const { container } = renderComponent({ ...props, story: newStory() });

        expect(container.innerHTML).toBe('');
      });
    });
  });
});
