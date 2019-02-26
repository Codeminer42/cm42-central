import * as Story from 'models/beta/story';

describe('Story model', function () {
  describe('comparePosition', () => {

    describe('when position A is bigger then B', () => {
      it("return 1", () => {
        const storyA = {
          position: "10.7"
        };

        const storyB = {
          position: "4.3"
        }

        expect(Story.comparePosition(storyA, storyB)).toEqual(1)
      });
    });

    describe('when position A is lower then B', () => {
      it("return -1", () => {
        const storyA = {
          position: "3.4"
        };

        const storyB = {
          position: "5.3"
        }

        expect(Story.comparePosition(storyA, storyB)).toEqual(-1)
      });
    });

    describe('when position A is equal B', () => {
      it("return 0", () => {
        const storyA = {
          position: "5.0"
        };

        const storyB = {
          position: "5.0"
        }

        expect(Story.comparePosition(storyA, storyB)).toEqual(0)
      });
    });

  });

  describe('compareAcceptedAt', () => {

    describe('when date A is more recent then B', () => {
      it("return 1", () => {
        const storyA = {
          acceptedAt: "2018-08-07T16:36:20.811Z"
        };

        const storyB = {
          acceptedAt: "2018-08-06T16:36:20.811Z"
        }

        expect(Story.compareAcceptedAt(storyA, storyB)).toEqual(1)
      });
    });

    describe('when date A is older then B', () => {
      it("return -1", () => {
        const storyA = {
          acceptedAt: "2018-08-07T12:36:20.811Z"
        };

        const storyB = {
          acceptedAt: "2018-08-07T16:36:20.811Z"
        }

        expect(Story.compareAcceptedAt(storyA, storyB)).toEqual(-1)
      });
    });

    describe('when date A is equal B', () => {
      it("return 0", () => {
        const storyA = {
          acceptedAt: "2018-08-07T12:36:20.811Z"
        };

        const storyB = {
          acceptedAt: "2018-08-07T12:36:20.811Z"
        }

        expect(Story.compareAcceptedAt(storyA, storyB)).toEqual(0)
      });
    });

  });

  describe('compareStarteddAt', () => {

    describe('when date A is more recent then B', () => {
      it("return 1", () => {
        const storyA = {
          startedAt: "2018-08-07T16:36:20.811Z"
        };

        const storyB = {
          startedAt: "2018-08-06T16:36:20.811Z"
        }

        expect(Story.compareStartedAt(storyA, storyB)).toEqual(1)
      });
    });

    describe('when date A is older then B', () => {
      it("return -1", () => {
        const storyA = {
          startedAt: "2018-08-07T12:36:20.811Z"
        };

        const storyB = {
          startedAt: "2018-08-07T16:36:20.811Z"
        }

        expect(Story.compareStartedAt(storyA, storyB)).toEqual(-1)
      });
    });

    describe('when date A is equal B', () => {
      it("return 0", () => {
        const storyA = {
          startedAt: "2018-08-07T12:36:20.811Z"
        };

        const storyB = {
          startedAt: "2018-08-07T12:36:20.811Z"
        }

        expect(Story.compareStartedAt(storyA, storyB)).toEqual(0)
      });
    });

  });

  describe('compareDeliveredAt', () => {

    describe('when date A is more recent then B', () => {
      it("return 1", () => {
        const storyA = {
          deliveredAt: "2018-08-07T16:36:20.811Z"
        };

        const storyB = {
          deliveredAt: "2018-08-06T16:36:20.811Z"
        }

        expect(Story.compareDeliveredAt(storyA, storyB)).toEqual(1)
      });
    });

    describe('when date A is older then B', () => {
      it("return -1", () => {
        const storyA = {
          deliveredAt: "2018-08-07T12:36:20.811Z"
        };

        const storyB = {
          deliveredAt: "2018-08-07T16:36:20.811Z"
        }

        expect(Story.compareDeliveredAt(storyA, storyB)).toEqual(-1)
      });
    });

    describe('when date A is equal B', () => {
      it("return 0", () => {
        const storyA = {
          deliveredAt: "2018-08-07T12:36:20.811Z"
        };

        const storyB = {
          deliveredAt: "2018-08-07T12:36:20.811Z"
        }

        expect(Story.compareDeliveredAt(storyA, storyB)).toEqual(0)
      });
    });

    describe('is unestimated feature', () => {
      it('return a story if it is a feature and is unestimated', () => {
        const stories = [
          {
            id: 10,
            storyType: 'feature',
            estimate: null,
          },
          {
            id: 20,
            storyType: 'bug',
            estimate: null,
          },
          {
            id: 30,
            storyType: 'feature',
            estimate: 2,
          },
        ];

        const unestimated = stories.filter(Story.isUnestimatedFeature);

        expect(unestimated.length).toEqual(1);
        expect(unestimated[0].id).toEqual(10);
      });
    });
  });

  describe('toggleStory', () => {
    describe('When story is collapsed', () => {
      it('sets collapsed to false and copies the previous state to a _editing field', () => {
        const story = { collapsed: true };

        const expandedStory = Story.toggleStory(story);

        expect(expandedStory).toEqual({
          collapsed: false,
          _editing: {
            collapsed: true,
            loading: false,
            _isDirty: false
          }
        });
      });
    });

    describe('When story is expanded', () => {
      it('sets collapsed to true and sets _editing field to null', () => {
        const story = { collapsed: false };

        const collapsedStory = Story.toggleStory(story);

        expect(collapsedStory).toEqual({
          collapsed: true,
          _editing: null
        });
      });
    });
  });

  describe('editStory', () => {
    it('change story type and sets _isDirty to true', () => {
      const story = {
        estimate: '',
        _editing: {
          labels: [],
          storyType: 'bug',
          estimate: ''
        }
      };
      const newAttributes = { storyType: 'feature' };

      const changedStory = Story.editStory(story, newAttributes);

      expect(changedStory).toEqual({
        estimate: '',
        _editing: {
          labels: [],
          storyType: newAttributes.storyType,
          estimate: '',
          _isDirty: true
        }
      });
    });

    const notFeatureTypes = ['bug', 'release', 'chore'];

    notFeatureTypes.forEach(type => {
      it(`change story estimate to null when storyType is ${type} and sets _isDirty to true`, () => {
        const story = { _editing: { storyType: 'feature' } };
        const newAttributes = { storyType: type };

        const changedStory = Story.editStory(story, newAttributes);

        expect(changedStory).toEqual({
          _editing: {
            labels: [],
            storyType: type,
            estimate: '',
            _isDirty: true
          }
        });
      });
    })

    it('change story estimate and sets _isDirty to true', () => {
      const story = { _editing: { estimate: 1, storyType: 'feature' } };
      const newAttributes = { estimate: 2 };

      const changedStory = Story.editStory(story, newAttributes);

      expect(changedStory).toEqual({
        _editing: {
          labels: [],
          storyType: 'feature',
          estimate: newAttributes.estimate,
          _isDirty: true
        }
      });
    });
  });

  describe('updateStory', () => {
    it('update story type', () => {
      const story = { storyType: 'bug' };
      const newAttributes = { storyType: 'feature' };

      const changedStory = Story.updateStory(story, newAttributes);

      expect(changedStory).toEqual({
        storyType: newAttributes.storyType
      });
    });

    it('update story estimate', () => {
      const story = { estimate: 1 };
      const newAttributes = { estimate: 2 };

      const changedStory = Story.updateStory(story, newAttributes);

      expect(changedStory).toEqual({
        estimate: newAttributes.estimate
      });
    });
  });

  describe('setLoadingStory', () => {
    it('sets the loading state to true when false', () => {
      const story = { _editing: { loading: false } }

      const changedStory = Story.setLoadingStory(story);

      expect(changedStory._editing.loading).toEqual(true);
    });
  });

  describe('setLoadingValue', () => {
    it('sets the loading state to true', () => {
      const story = { loading: false  };

      const changedStory = Story.setLoadingValue(story, true);

      expect(changedStory.loading).toEqual(true);
    });

    it('sets the loading state to false', () => {
      const story = { loading: true };

      const changedStory = Story.setLoadingValue(story, false);

      expect(changedStory.loading).toEqual(false);
    });
  });

  describe('storyFailure', () => {
    it('sets loading to false', () => {
      const story = { _editing: { loading: true }, errors: [] }

      const changedStory = Story.storyFailure(story);

      expect(changedStory._editing.loading).toEqual(false);
    });

    it('put error to errors array', () => {
      const error = "error";
      const story = { _editing: { loading: true }, errors: [] }

      const changedStory = Story.storyFailure(story, error);

      expect(changedStory.errors).toEqual([error]);
    });
  });
});
