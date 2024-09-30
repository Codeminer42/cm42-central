import ExpandedStorySection from 'components/story/ExpandedStory/ExpandedStorySection';
import React from 'react';
import { renderWithProviders } from '../../setupRedux';

describe('<ExpandedStorySection />', () => {
  const renderComponent = props => {
    const defaultProps = {};

    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(<ExpandedStorySection {...mergedProps} />);
  };

  it('renders section-title with the right text', () => {
    const props = {
      title: 'my title',
      children: 'children',
    };

    const { container } = renderComponent(props);
    const title = container.querySelector('.Story__section-title');

    expect(title).toHaveTextContent(props.title);
  });

  it('renders with the right identifier className', () => {
    const props = {
      title: 'title',
      identifier: 'content',
      children: 'children',
    };

    const { container } = renderComponent(props);
    const section = container.querySelector('.Story__section__content');

    expect(section).toHaveClass(`Story__section__${props.identifier}`);
  });

  it('renders children', () => {
    const props = {
      title: 'title',
      children: <div>{'children'}</div>,
    };

    const { container } = renderComponent(props);
    const children = container.querySelector('.Story__section__content');

    expect(children).toHaveTextContent('children');
  });
});
