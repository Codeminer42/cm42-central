import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Note from 'components/story/note/Note';

describe('<Note/>', () => {
  const note = {
    id: 42,
    note: 'test Note',
    userName: 'foo',
    createdAt: '27/08/2018',
  };

  const setup = propOverrides => {
    const onDeleteSpy = vi.fn();

    const { container: wrapper } = render(
      <Note
        note={note}
        onDelete={onDeleteSpy}
        disabled={false}
        {...propOverrides}
      />
    );

    const deleteButton = wrapper.querySelector('.delete-note-button');

    return { wrapper, deleteButton, onDeleteSpy };
  };

  beforeAll(() => {
    vi.spyOn(window.md, 'makeHtml').mockReturnValue('<p>Test</p>');
  });

  describe('when component is enabled', () => {
    it('allows editing', () => {
      const { deleteButton } = setup();

      expect(deleteButton).toBeInTheDocument();
    });

    describe('when user deletes a note', () => {
      it('triggers onDelete callback', () => {
        const { deleteButton, onDeleteSpy } = setup();

        fireEvent.click(deleteButton);

        expect(onDeleteSpy).toHaveBeenCalled();
      });
    });
  });

  describe('when component is disabled', () => {
    it('does not allow deleting', () => {
      const { deleteButton } = setup({ disabled: true });

      expect(deleteButton).not.toBeInTheDocument();
    });
  });
});
