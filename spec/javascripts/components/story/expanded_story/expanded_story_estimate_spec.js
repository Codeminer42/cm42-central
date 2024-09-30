import ExpandedStoryEstimate from 'components/story/ExpandedStory/ExpandedStoryEstimate';
import React from 'react';
import { renderWithProviders } from '../../setupRedux';

describe('<ExpandedStoryEstimate />', () => {
  const renderComponent = props => {
    const defaultProps = {
      story: {},
      project: {},
      onEdit: vi.fn(),
      disabled: false,
    };

    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(<ExpandedStoryEstimate {...mergedProps} />);
  };

  it("renders component with 'Fibonacci' point scale in select", () => {
    const props = {
      story: { estimate: null, _editing: { storyType: 'feature' } },
      project: { pointValues: [1, 2, 3, 5, 8] },
    };

    const { container } = renderComponent(props);
    const select = container.querySelector('select');

    props.project.pointValues.forEach(value => {
      expect(select).toHaveTextContent(value);
    });
  });

  it("renders component with 'Powers of two' point scale in select", () => {
    const props = {
      story: { estimate: null, _editing: { storyType: 'feature' } },
      project: { pointValues: [1, 2, 4, 8] },
    };

    const { container } = renderComponent(props);
    const select = container.querySelector('select');

    props.project.pointValues.forEach(value => {
      expect(select).toHaveTextContent(value);
    });
  });

  it("renders component with 'Linear' point scale in select", () => {
    const props = {
      story: { estimate: null, _editing: { storyType: 'feature' } },
      project: { pointValues: [1, 2, 3, 4, 5] },
    };

    const { container } = renderComponent(props);
    const select = container.querySelector('select');

    props.project.pointValues.forEach(value => {
      expect(select).toHaveTextContent(value);
    });
  });

  describe('When story.estimate is not null', () => {
    const pointValues = [1, 2, 3, 5, 8];

    pointValues.forEach(value => {
      it(`sets the select defaultValue as ${value}`, () => {
        const props = {
          project: { pointValues },
          story: {
            _editing: {
              storyType: 'feature',
              estimate: value,
            },
          },
        };

        const { container } = renderComponent(props);
        const select = container.querySelector('select');

        expect(select).toHaveValue(value.toString());
      });
    });
  });

  describe('When story.estimate is null', () => {
    it('sets the select defaultValue as null', () => {
      const props = {
        project: { pointValues: [1, 2, 3, 4, 5] },
        story: {
          _editing: {
            estimate: '',
            storyType: 'bug',
          },
        },
      };

      const { container } = renderComponent(props);
      const select = container.querySelector('select');

      expect(select).toHaveValue('');
    });
  });

  describe('When change storyType', () => {
    describe('to a type that is not a feature', () => {
      const notFeatureTypes = ['bug', 'release', 'chore'];

      it('disables estimate select', () => {
        notFeatureTypes.forEach(type => {
          const props = {
            project: { pointValues: [1, 2, 3, 4, 5] },
            story: { _editing: { storyType: type } },
          };

          const { container } = renderComponent(props);
          const select = container.querySelector('select');

          expect(select).toBeDisabled();
        });
      });
    });

    describe('to a feature', () => {
      const props = {
        project: { pointValues: [1, 2, 3, 4, 5] },
        story: { _editing: { storyType: 'feature' } },
        disabled: false,
      };

      it("doesn't disable estimate select when disabled prop is false", () => {
        const { container } = renderComponent(props);
        const select = container.querySelector('select');

        expect(select).not.toBeDisabled();
      });

      describe('when component is disabled', () => {
        it('disables estimate select when disabled prop is true', () => {
          const { container } = renderComponent({ ...props, disabled: true });
          const select = container.querySelector('select');

          expect(select).toBeDisabled();
        });
      });
    });
  });
});
