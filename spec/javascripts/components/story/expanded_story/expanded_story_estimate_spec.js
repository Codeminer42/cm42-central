import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryEstimate from 'components/story/ExpandedStory/ExpandedStoryEstimate';

describe('<ExpandedStoryEstimate />', () => {
  const defaultProps = () => ({
    story: {},
    project: {},
    onEdit: sinon.spy(),
    disabled: false
  });

  it("renders component with 'Fibonacci' point scale in select", () => {
    const project = { pointValues: ['1', '2', '3', '5', '8'] };
    const story = { estimate: null, _editing: { storyType: 'feature' } };

    const wrapper = shallow(
      <ExpandedStoryEstimate {...defaultProps()} project={project} story={story} />
    );
    const select = wrapper.find('select').text();

    project.pointValues.forEach((value) => {
      expect(select).toContain(value);
    });
  });

  it("renders component with 'Powers of two' point scale in select", () => {
    const project = { pointValues: ['1', '2', '4', '8'] };
    const story = { estimate: null, _editing: { storyType: 'feature' } };

    const wrapper = shallow(
      <ExpandedStoryEstimate {...defaultProps()} project={project} story={story} />
    );
    const select = wrapper.find('select').text();

    project.pointValues.forEach((value) => {
      expect(select).toContain(value);
    });
  });

  it("renders component with 'Linear' point scale in select", () => {
    const project = { pointValues: ['1', '2', '3', '4', '5'] };
    const story = { estimate: null, _editing: { storyType: 'feature' } };

    const wrapper = shallow(
      <ExpandedStoryEstimate {...defaultProps()} project={project} story={story} />
    );
    const select = wrapper.find('select').text();

    project.pointValues.forEach((value) => {
      expect(select).toContain(value);
    });
  });

  describe("When story.estimate is not null", () => {
    const pointValues = ['1', '2', '3', '5', '8'];

    pointValues.forEach((value) => {
      it(`sets the select defaultValue as ${value}`, () => {
        const project = { pointValues };
        const story = {
          _editing: {
            storyType: 'feature',
            estimate: value
          }
        };

        const wrapper = shallow(
          <ExpandedStoryEstimate {...defaultProps()} project={project} story={story} />
        );
        const select = wrapper.find('select');

        expect(select.prop('value')).toBe(value);
      });
    });
  });

  describe("When story.estimate is null", () => {
    it("sets the select defaultValue as null", () => {
      const project = { pointValues: ['1', '2', '3', '4', '5'] };
      const story = {
        _editing: {
          estimate: '',
          storyType: 'bug'
        }
      };

      const wrapper = shallow(
        <ExpandedStoryEstimate {...defaultProps()} project={project} story={story} />
      );
      const select = wrapper.find('select');

      expect(select.prop('value')).toBe('');
    });
  });

  describe("When change storyType", () => {
    describe("to a type that is not a feature", () => {
      const notFeatureTypes = ['bug', 'release', 'chore'];

      it("disables estimate select", () => {
        const project = { pointValues: ['1', '2', '3', '4', '5'] };

        notFeatureTypes.forEach((type) => {
          const story = { _editing: { storyType: type } };
          const wrapper = shallow(
            <ExpandedStoryEstimate {...defaultProps()} project={project} story={story} />
          );

          const select = wrapper.find('select');

          expect(select.prop('disabled')).toBe(true);
        });
      });
    });

    describe("to a feature", () => {
      const project = { pointValues: ['1', '2', '3', '4', '5'] };
      const story = { _editing: { storyType: 'feature' } };

      it("doesn't disable estimate select when disabled prop is false", () => {
        const wrapper = shallow(
          <ExpandedStoryEstimate 
            {...defaultProps()}
              project={project}
              story={story}
              disabled={false}
          />
        );
        const select = wrapper.find('select');

        expect(select.prop('disabled')).not.toBe(true);
      });

      describe('when component is disabled', () => {
        it("disables estimate select when disabled prop is true", () => {
          const wrapper = shallow(
            <ExpandedStoryEstimate
              {...defaultProps()}
              project={project}
              story={story}
              disabled={true}
            />
          );
          const select = wrapper.find('select');
          expect(select.prop('disabled')).toBe(true);
        });
      });
    });
  });
});
