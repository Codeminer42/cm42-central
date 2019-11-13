import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryContentArea from 'components/story/ExpandedStory/ExpandedStoryDescription/ExpandedStoryContentArea';

describe('<ExpandedStoryContentArea />', () => {
  const renderContent = propsOverride => {
    const wrapper = shallow (
      <ExpandedStoryContentArea
        onClick={sinon.stub()}
        {...propsOverride}
      />
    )
    const descriptionContent = wrapper.find('[data-id="description-content"]');
    const editButton = wrapper.find('[data-id="edit-button"]');

    return { wrapper, descriptionContent, editButton }
  }
    

  describe("when description isn't null", () => {
    const description = 'description example';

    it('renders <ExpandedStoryDescriptionContent />', () => {
      const {  descriptionContent } = renderContent({ description });
      expect(descriptionContent.exists()).toBeTruthy();
    });

    it('does not render <ExpandedStoryDescriptionEditButton />', () => {
      const { editButton } = renderContent({ description });
      expect(editButton.exists()).toBeFalsy();
    });
  });

  const invalidsDescriptions = [null, undefined, ''];
  invalidsDescriptions.forEach(description => {
    describe(`when description is ${description}`, () => {
      it('does not render <ExpandedStoryDescriptionContent />', () => {
        const { descriptionContent } = renderContent({ description });
        expect(descriptionContent.exists()).toBeFalsy();
      });
  
      it('renders <ExpandedStoryDescriptionEditButton />', () => {
        const { editButton } = renderContent({ description });
        expect(editButton.exists()).toBeTruthy();
      });
    });
  });
});
