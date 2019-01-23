import { addAttachment, removeAttachment } from '../../../app/assets/javascripts/actions/attachment';
import { editStory } from '../../../app/assets/javascripts/actions/story';
import storyFactory from '../support/factories/storyFactory';

describe('addAttachment', () => {
  let story;
  const projectId = 42;

  beforeEach(() => {
    story = { ...storyFactory(), _editing: storyFactory() };
  });

  it('dispatch editStory with the new attachment', () => {
    const newAttachment = { id: 1 }

    const fakeDispatch = sinon.stub();

    const fakeGetState = sinon.stub();
    fakeGetState.returns({ stories: [story] });

    const documents = [
      ...story.documents,
      newAttachment
    ]

    addAttachment(story.id, projectId, newAttachment)(fakeDispatch, fakeGetState);

    expect(fakeDispatch).toHaveBeenCalledWith(editStory(story.id, { documents }));
  });
});

describe('removeAttachment', () => {
  let story;

  beforeEach(() => {
    story = { ...storyFactory(), _editing: storyFactory() };
  });

  it('dispatch editStory without the removed attachment', () => {
    const newAttachment = { id: 1 }
    story.documents = [newAttachment];

    const fakeDispatch = sinon.stub();

    const fakeGetState = sinon.stub();
    fakeGetState.returns({ stories: [story] });

    removeAttachment(story.id, newAttachment.id)(fakeDispatch, fakeGetState);

    expect(fakeDispatch).toHaveBeenCalledWith(editStory(story.id, { documents: [] }));
  });
});

