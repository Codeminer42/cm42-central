import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryDescription from 'components/story/ExpandedStory/ExpandedStoryDescription/index';

describe('<ExpandedStoryDescription />', () => {
  const defaultProps = () => ({
    story: {},
    onEdit: vi.fn(),
    disabled: false,
  });

  it('renders component', () => {
    const story = { description: '', _editing: { description: '' } };

    const wrapper = shallow(
      <ExpandedStoryDescription {...defaultProps()} story={story} />
    );

    expect(wrapper).toExist();
  });
});
