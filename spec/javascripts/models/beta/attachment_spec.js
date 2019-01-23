import * as Attachment from 'models/beta/attachment.js';

describe('Attachment model', () => {
  describe('addAttachment', () => {
    it('add a new attachment to story', () => {
      const story = {
        _editing: {
          documents: [
            { id: 1 }, { id: 2 }
          ]
        }
      };

      const newAttachment = { id: 3 };
      const expectedAttachments = [
        { id: 1 }, { id: 2 }, { id: 3 }
      ];

      const changedStory = Attachment.addAttachment(story, newAttachment);

      expect(changedStory).toEqual({
        _editing: {
          documents: expectedAttachments
        }
      });
    });
  });

  describe('removeAttachment', () => {
    it('remove one attachment from story and set _isDirty to true', () => {
      const story = { _editing: { documents: [{ id: 1 }, { id: 2 }] } };
      const expectedAttachments = [story._editing.documents[0]];

      const changedStory = Attachment.removeAttachment(story, story._editing.documents[1].id);

      expect(changedStory).toEqual({
        _editing: {
          documents: expectedAttachments,
          _isDirty: true
        }
      });
    });
  });
});
