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
      fetchPastStories: sinon.stub(),
      toggleColumn: sinon.stub(),
      createStory: sinon.stub(),
      visibleColumns: {},
      reverse: false,
    }

    return shallow(<Columns {...defaultProps} {...props } />);
  };

  it('renders the component', () => {
    const columns = render();

    expect(columns.exists()).toBeTruthy();
  });
});
