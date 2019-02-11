import { addAttachment, addAttachmentToStory } from '../../../app/assets/javascripts/actions/attachment';
import storyFactory from '../support/factories/storyFactory';

describe('addAttachment', () => {
  let story;
  const projectId = 42;

  beforeEach(() => {
    story = { ...storyFactory(), _editing: storyFactory() };
  });

  it('dispatch addAttachmentToStory with the new attachment and update story', () => {
    const newAttachment = { id: 1 }

    const FakeStory = {
      update: sinon.stub().resolves(story)
    };

    const fakeDispatch = sinon.stub();

    const fakeGetState = sinon.stub();
    fakeGetState.returns({ stories: [story] });

    addAttachment(story.id, projectId, newAttachment)(fakeDispatch, fakeGetState, {Story: FakeStory});

    expect(fakeDispatch).toHaveBeenCalledWith(addAttachmentToStory(story.id, newAttachment));
    expect(FakeStory.update).toHaveBeenCalledWith(story._editing, projectId);
  });
});


