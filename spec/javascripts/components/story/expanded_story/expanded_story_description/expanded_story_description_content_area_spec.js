import ExpandedStoryContentArea from 'components/story/ExpandedStory/ExpandedStoryDescription/ExpandedStoryContentArea';
import React from 'react';
import { renderWithProviders } from '../../../setupRedux';

describe('<ExpandedStoryContentArea />', () => {
  const markdownSpy = vi
    .spyOn(window.md, 'makeHtml')
    .mockReturnValue('<p>Test</p>');

  const renderComponent = props => {
    const defaultProps = {
      onClick: vi.fn(),
      description: '',
    };

    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(<ExpandedStoryContentArea {...mergedProps} />);
  };

  describe("when description isn't null", () => {
    const description = 'description example';

    it('renders <ExpandedStoryDescriptionContent />', () => {
      renderComponent({ description });

      expect(markdownSpy).toHaveBeenCalledWith(description);
    });
  });
});
