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

  describe("toggleStory", () => {
    describe("When story is collapsed", () => {
      it("expand story", () => {
        const story = { collapsed: true }

        const expandedStory = Story.toggleStory(story);

        expect(expandedStory.collapsed).toEqual(false);
      });
    });

    describe("When story is expanded", () => {
      it("collapse story", () => {
        const story = { collapsed: false }

        const collapsedStory = Story.toggleStory(story);

        expect(collapsedStory.collapsed).toEqual(true);
      });
    });
  });

  describe("editStory", () => {
    it("change story type", () => {
      const story = { _editing: { storyType: 'bug' } }
      const newAttributes = { storyType: 'feature' }

      const changedStory = Story.editStory(story, newAttributes);

      expect(changedStory._editing.storyType).toEqual(newAttributes.storyType);
    });

    const notFeatureTypes = ['bug', 'release', 'chore'];

    notFeatureTypes.forEach(type => {
      it(`change story estimate to null when storyType is ${type}`, () => {
        const story = { _editing: { storyType: 'feature' } }
        const newAttributes = { storyType: type }

        const changedStory = Story.editStory(story, newAttributes);

        expect(changedStory._editing.estimate).toEqual(null);
      });
    })

    it("change story estimate", () => {
      const story = { _editing: { estimate: 1, storyType: 'feature' } }
      const newAttributes = { estimate: 2 }

      const changedStory = Story.editStory(story, newAttributes);

      expect(changedStory._editing.estimate).toEqual(newAttributes.estimate);
    });
  });

  describe("updateStory", () => {
    it("update story type", () => {
      const story = { storyType: 'bug' }
      const newAttributes = { storyType: 'feature' }

      const changedStory = Story.updateStory(story, newAttributes);

      expect(changedStory.storyType).toEqual(newAttributes.storyType);
    });

    it("update story estimate", () => {
      const story = { estimate: 1 }
      const newAttributes = { estimate: 2 }

      const changedStory = Story.updateStory(story, newAttributes);

      expect(changedStory.estimate).toEqual(newAttributes.estimate);
    });
  });
});
