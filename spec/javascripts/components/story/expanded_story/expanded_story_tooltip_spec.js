import ExpandedStoryTooltip from 'components/story/ExpandedStory/ExpandedStoryToolTip';
import React from 'react';
import { renderWithProviders } from '../../setupRedux';

describe('<ExpandedStoryTooltip />', () => {
  it('renders <Popover />', () => {
    const { container } = renderWithProviders(<ExpandedStoryTooltip />);

    const tooltip = container.querySelector('.infoToolTip');

    expect(tooltip).toBeInTheDocument();
  });
});
