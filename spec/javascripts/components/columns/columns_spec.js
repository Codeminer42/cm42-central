import React from 'react';
import { shallow } from 'enzyme';
import Columns from 'components/Columns';

describe('<Columns />', () => {
  const render = props => {
    const defaultProps = {
      canClose: true,
      chillyBinStories: [],
      backlogSprints: [],
      doneSprints: [],
      fetchPastStories: vi.fn(),
      toggleColumn: vi.fn(),
      createStory: vi.fn(),
      visibleColumns: {},
      reverse: false,
    };

    return shallow(<Columns {...defaultProps} {...props} />);
  };

  it('renders the component', () => {
    const columns = render();

    expect(columns.exists()).toBeTruthy();
  });
});
