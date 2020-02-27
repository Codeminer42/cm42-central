import actionsTypes from "../../../app/assets/javascripts/actions/actionTypes";
import reducer from "../../../app/assets/javascripts/reducers/stories";
import { storyScopes } from '../../../app/assets/javascripts/libs/beta/constants';
import storyFactory from "../support/factories/storyFactory";

describe('Stories reducer', () => {
  describe('DEFAULT', () => {
    it('returns the initialState', () => {
      expect(reducer(undefined, {})).toEqual({
        [storyScopes.ALL]: [],
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('RECEIVE_STORIES', () => {
    it('adds stories to ALL scope', () => {
      const state = {
        [storyScopes.ALL]: [],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.RECEIVE_STORIES,
        from: storyScopes.ALL,
        data: [{ id: 1 }]
      };

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: [{ id: 1 }],
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('RECEIVE_PAST_STORIES', () => {
    it('adds past stories in ALL scope', () => {
      const state = {
        [storyScopes.ALL]: [{ id: 2 }, { id: 3 }],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.RECEIVE_PAST_STORIES,
        from: storyScopes.ALL,
        stories: [{ id: 1 }]
      };

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: [{ id: 2 }, { id: 3 }, { id: 1 }],
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('CREATE_STORY', () => {
    it('adds the new story in ALL scope', () => {
      const state = {
        [storyScopes.ALL]: [storyFactory({ title: 'title' })],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.CREATE_STORY,
        from: storyScopes.ALL,
        attributes: { title: 'teste' }
      };

      const expected = [expect.objectContaining({ title: 'title' }), expect.objectContaining({ title: 'teste' })];

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining(expected),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('ADD_STORY', () => {
    it('adds story in ALL scope', () => {
      const state = {
        [storyScopes.ALL]: [storyFactory({ title: 'title' })],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.ADD_STORY,
        from: storyScopes.ALL,
        story: storyFactory({ title: 'teste' })
      };

      const expected = [expect.objectContaining({ title: 'title' }), expect.objectContaining({ title: 'teste' })];

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining(expected),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('CLONE_STORY', () => {
    it('clones story to ALL scope', () => {
      const state = {
        [storyScopes.ALL]: [storyFactory({ title: 'title' })],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.CLONE_STORY,
        from: storyScopes.ALL,
        story: storyFactory({ title: 'title' })
      };

      const expected = [expect.objectContaining({ id: null, title: 'title' }), expect.objectContaining({ id: 42, title: 'title' })];

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining(expected),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('TOGGLE_STORY', () => {
    const state = {
      [storyScopes.ALL]: [storyFactory({ id: 42 })],
      [storyScopes.SEARCH]: []
    };

    it('when id is null', () => {
      const action = {
        type: actionsTypes.TOGGLE_STORY,
        from: storyScopes.ALL,
        id: null
      };

      const expected = [expect.objectContaining({ id: 42, collapsed: true })];

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining(expected),
        [storyScopes.SEARCH]: []
      });
    });


    it('when id is not null', () => {
      const action = {
        type: actionsTypes.TOGGLE_STORY,
        from: storyScopes.ALL,
        id: 42
      };

      const expected = [expect.objectContaining({ id: 42, collapsed: false })];

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining(expected),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('EDIT_STORY', () => {
    it('edits an story of ALL scope', () => {
      const state = {
        [storyScopes.ALL]: [{ ...storyFactory({ id: 42, title: 'title' }), _editing: { storyType: 'feature' } }],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.EDIT_STORY,
        from: storyScopes.ALL,
        id: 42,
        newAttributes: { title: 'editted' }
      };

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining([
          expect.objectContaining({
            id: 42,
            title: 'title',
            _editing: expect.objectContaining({ title: 'editted' })
          })
        ]),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('UPDATE_STORY_SUCCESS', () => {
    it('updates an story with success', () => {
      const state = {
        [storyScopes.ALL]: [storyFactory({ id: 42, title: 'title' })],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.UPDATE_STORY_SUCCESS,
        story: { id: 42, title: 'editted' }
      };

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining([
          expect.objectContaining({
            id: 42,
            title: 'editted',
          })
        ]),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('STORY_ERROR', () => {
    it('returns story with error', () => {
      const error = { error: 'boom' };

      const state = {
        [storyScopes.ALL]: [storyFactory({ id: 42, title: 'title' })],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.STORY_FAILURE,
        from: storyScopes.ALL,
        id: 42,
        error
      };

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining([
          expect.objectContaining({
            id: 42,
            title: 'title',
            errors: expect.objectContaining({
              error: 'boom'
            })
          })
        ]),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('SET_LOADING_STORY', () => {
    it('sets true to load the story', () => {
      const state = {
        [storyScopes.ALL]: [{ ...storyFactory({ id: 42 }), _editing: { loading: false } }],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.SET_LOADING_STORY,
        from: storyScopes.ALL,
        id: 42
      };

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining([
          expect.objectContaining({
            id: 42,
            _editing: expect.objectContaining({
              loading: true
            })
          })
        ]),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('ADD_TASK', () => {
    it('adds task to the story', () => {
      const state = {
        [storyScopes.ALL]: [storyFactory({ id: 42 })],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.ADD_TASK,
        from: storyScopes.ALL,
        storyId: 42,
        task: {
          name: 'task',
          done: false
        }
      };

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining([
          expect.objectContaining({
            id: 42,
            tasks: [{
              name: 'task',
              done: false
            }]
          })
        ]),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('REMOVE_TASK', () => {
    it('removes task from story', () => {
      const state = {
        [storyScopes.ALL]: [storyFactory({
          id: 42, tasks: [{
            id: 10,
            name: 'task',
            done: false
          }, {
            id: 12,
            name: 'task2',
            done: true
          }]
        })],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.REMOVE_TASK,
        from: storyScopes.ALL,
        storyId: 42,
        task: 10
      };

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining([
          expect.objectContaining({
            id: 42,
            tasks: expect.arrayContaining([
              expect.objectContaining({
                id: 12,
                name: 'task2',
                done: true
              }),
              expect.not.objectContaining({
                id: 10,
                name: 'task',
                done: false
              })
            ])
          })
        ]),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('TOGGLE_TASK', () => {
    it('toggles task', () => {
      const state = {
        [storyScopes.ALL]: [storyFactory({
          id: 42, tasks: [{
            id: 10,
            name: 'task',
            done: false
          }]
        })],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.TOGGLE_TASK,
        from: storyScopes.ALL,
        story: {
          id: 42
        },
        task: {
          id: 10,
          done: true
        }
      };

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining([
          expect.objectContaining({
            id: 42,
            tasks: [{
              id: 10,
              name: 'task',
              done: true
            }]
          })
        ]),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('DELETE_STORY_SUCCESS', () => {
    it('deletes an story from the ALL scope', () => {
      const state = {
        [storyScopes.ALL]: [storyFactory({ id: 42 }), storyFactory({ id: 43 })],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.DELETE_STORY_SUCCESS,
        from: storyScopes.ALL,
        id: 42
      };

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining([
          expect.objectContaining({
            id: 43,
          }),
          expect.not.objectContaining({
            id: 42
          })
        ]),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('ADD_NOTE', () => {
    it('adds a note to the story', () => {
      const story = storyFactory({ id: 42 });

      const state = {
        [storyScopes.ALL]: [story],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.ADD_NOTE,
        from: storyScopes.ALL,
        storyId: 42,
        note: {
          note: 'This is note 3'
        }
      };

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining([
          expect.objectContaining({
            id: 42,
            notes: [
              ...story.notes,
              { note: 'This is note 3' }
            ]
          })
        ]),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('HIGHLIGHT_STORY', () => {
    it('highlights an story', () => {
      const state = {
        [storyScopes.ALL]: [storyFactory({ id: 42 })],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.HIGHLIGHT_STORY,
        from: storyScopes.ALL,
        storyId: 42,
        highlighted: true
      };

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining([
          expect.objectContaining({
            id: 42,
            highlighted: true
          })
        ]),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('DELETE_NOTE', () => {
    it('deletes a note from the story', () => {
      const state = {
        [storyScopes.ALL]: [storyFactory({ id: 42 })],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.DELETE_NOTE,
        from: storyScopes.ALL,
        storyId: 42,
        noteId: 2
      };

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining([
          expect.objectContaining({
            id: 42,
            notes: expect.arrayContaining([
              expect.objectContaining({
                id: 1,
                note: 'This is note 1',
              }),
              expect.not.objectContaining({
                id: 2,
                note: 'This is note 2',
              })
            ])
          })
        ]),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('ADD_LABEL', () => {
    it('adds a label to the story', () => {
      const story = storyFactory({ id: 42, _editing: { labels: [] } });

      const state = {
        [storyScopes.ALL]: [story],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.ADD_LABEL,
        from: storyScopes.ALL,
        storyId: 42,
        label: {
          name: 'label'
        }
      };

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining([
          expect.objectContaining({
            id: 42,
            _editing: expect.objectContaining({
              labels: [{
                name: 'label'
              }]
            })
          })
        ]),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('REMOVE_LABEL', () => {
    it('removes a label from the story', () => {
      const story = storyFactory({ id: 42, _editing: { labels: [{ name: 'label' }, { name: 'label2' }] } });

      const state = {
        [storyScopes.ALL]: [story],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.DELETE_LABEL,
        from: storyScopes.ALL,
        storyId: 42,
        labelName: 'label'
      };

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining([
          expect.objectContaining({
            id: 42,
            _editing: expect.objectContaining({
              labels: expect.arrayContaining([
                expect.objectContaining({
                  name: 'label2'
                }),
                expect.not.objectContaining({
                  name: 'label'
                })
              ])
            })
          })
        ]),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('ADD_ATTACHMENT', () => {
    it('adds an attachment to the story', () => {
      const state = {
        [storyScopes.ALL]: [storyFactory({ id: 42, _editing: { documents: [] } })],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.ADD_ATTACHMENT,
        from: storyScopes.ALL,
        storyId: 42,
        attachment: {
          file: 'image.jpg'
        }
      };

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining([
          expect.objectContaining({
            _editing: expect.objectContaining({ documents: [{ file: 'image.jpg' }] }),
            id: 42
          })
        ]),
        [storyScopes.SEARCH]: []
      });
    });
  });

  describe('DELETE_ATTACHMENT', () => {
    it('deletes an attachment from the story', () => {
      const state = {
        [storyScopes.ALL]: [storyFactory({ id: 42, _editing: { documents: [{ id: 1, file: 'image.jpg' }, { id: 2, file: 'doc.pdf' }] } })],
        [storyScopes.SEARCH]: []
      };

      const action = {
        type: actionsTypes.DELETE_ATTACHMENT,
        from: storyScopes.ALL,
        storyId: 42,
        attachmentId: 1
      };

      expect(reducer(state, action)).toEqual({
        [storyScopes.ALL]: expect.arrayContaining([
          expect.objectContaining({
            _editing: expect.objectContaining({
              documents: expect.arrayContaining([
                expect.objectContaining({ id: 2, file: 'doc.pdf' }),
                expect.not.objectContaining({ id: 1, file: 'image.jpg' })
              ])
            }),
            id: 42
          })
        ]),
        [storyScopes.SEARCH]: []
      });
    });
  });
});
