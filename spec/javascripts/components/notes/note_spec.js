import React from 'react';
import { render } from "@testing-library/react";
import { screen } from '@testing-library/dom';
import userEvent from "@testing-library/user-event";
import NoteComponent from 'components/notes/Note';
import Note from 'models/note.js';

global.document.createRange = () => ({
  setStart: () => { },
  setEnd: () => { },
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

describe('<Note />', () => {
  beforeEach(() => {
    window.document.getSelection = jest.fn();
    jest.spyOn(I18n, 't');
    jest.spyOn(window.md, 'makeHtml');
  });

  const setup = (data) => {
    let note;

    note = new Note({ note: 'Test Note' });
    const onDelete = jest.fn();

    render(<NoteComponent note={note} disabled={data?.disabled} onDelete={onDelete}/>);

    return { onDelete };
  }

  afterEach(() => {
    I18n.t.mockClear();
    window.md.makeHtml.mockClear();
  });

  it("should have its content parsed", () => {
    setup();
    const expectedNote = 'Test Note';
    expect(window.md.makeHtml).toHaveBeenCalledWith(expectedNote);
  });

  it("should be able to call onDelete", async () => {
    const { onDelete } = setup();
    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    await userEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalled();
  });

  describe("when not disabled", () => {

    it("should have an delete button", () => {
      setup();
      const deleteButton = screen.getByRole("button", { name: /Delete/i });
      expect(deleteButton).toBeInTheDocument();
    });

  });

  describe("when disabled", () => {

    it("should not have a delete button", () => {
      setup({ disabled: true });
      const deleteButton = screen.queryByRole("button", { name: /Delete/i });
      expect(deleteButton).not.toBeInTheDocument();
    });

  });

});
