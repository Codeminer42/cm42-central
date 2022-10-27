import React from 'react';
import { render } from "@testing-library/react";
import { screen } from '@testing-library/dom';
import userEvent from "@testing-library/user-event";
import NoteComponent from 'components/notes/Note';
import Note from 'models/note.js';

window.document.getSelection = jest.fn()

global.document.createRange = () => ({
  setStart: () => { },
  setEnd: () => { },
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

describe('<Note />', () => {
  const setup = (disabled) => {
    let note;

    jest.spyOn(I18n, 't');
    jest.spyOn(window.md, 'makeHtml');
    note = new Note({ note: 'Test Note' });
    const handleDelete = jest.fn();

    render(<NoteComponent note={note} disabled={disabled} handleDelete={handleDelete}/>);

    return handleDelete;
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

  it("should be able to call handleDelete", async () => {
    const handleDelete = setup();
    const deleteButton = screen.getByTestId("delete-btn");
    await userEvent.click(deleteButton);
    expect(handleDelete).toHaveBeenCalled();
  });

  describe("when not disabled", () => {

    it("should have an delete button", () => {
      setup();
      const deleteButton = screen.getByTestId("delete-btn");
      expect(deleteButton).toBeInTheDocument();
    });

  });

  describe("when disabled", () => {

    it("should not have a delete button", () => {
      setup(true);
      const deleteButton = screen.queryByTestId("delete-btn");
      expect(deleteButton).not.toBeInTheDocument();
    });

  });

});
