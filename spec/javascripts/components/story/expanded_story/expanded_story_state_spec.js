import { fireEvent, screen } from '@testing-library/dom';
import ExpandedStoryState from 'components/story/ExpandedStory/ExpandedStoryState';
import React from 'react';
import { storyTypes } from '../../../../../app/assets/javascripts/libs/beta/constants';
import {
  states,
  types,
} from '../../../../../app/assets/javascripts/models/beta/story';
import { renderWithProviders } from '../../setupRedux';

describe('<ExpandedStoryState />', () => {
  const renderComponent = props => {
    const defaultProps = {
      story: {
        _editing: { state: 'started' },
      },
      onEdit: vi.fn(),
      disabled: false,
    };

    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(<ExpandedStoryState {...mergedProps} />);
  };

  it('renders component title', () => {
    renderComponent();
    const title = screen.getByText(
      I18n.t('activerecord.attributes.story.state')
    );

    expect(title).toBeInTheDocument();
  });

  describe('states at select', () => {
    const noFeatureTypes = types.filter(type => type !== storyTypes.FEATURE);

    noFeatureTypes.forEach(noFeatureType => {
      describe(`when is no ${noFeatureType}`, () => {
        states.forEach(state => {
          describe(`and state is ${state}`, () => {
            const props = {
              story: {
                _editing: {
                  state,
                  estimate: 1,
                  storyType: noFeatureType,
                },
                state,
                estimate: 1,
                storyType: noFeatureType,
              },
              disabled: false,
            };

            let wrapper;

            beforeEach(() => {
              const { container } = renderComponent(props);
              wrapper = container;
            });

            it('renders all states', () => {
              expect(wrapper.querySelectorAll('option').length).toEqual(7);
            });

            it(`has to be ${state}`, () => {
              expect(wrapper.querySelector('select').value).toBe(state);
            });
          });
        });
      });
    });

    describe('when is unestimated feature', () => {
      let wrapper;
      const props = {
        story: {
          _editing: {
            state: states[0],
            estimate: null,
            storyType: storyTypes.FEATURE,
          },
        },
      };

      beforeEach(() => {
        const { container } = renderComponent(props);
        wrapper = container;
      });

      it('renders just one state', () => {
        expect(wrapper.querySelectorAll('option').length).toEqual(1);
      });

      it('has to be unscheduled', () => {
        expect(wrapper.querySelector('select').value).toBe(states[0]);
      });
    });

    states.forEach(state => {
      it(`sets select value as ${state}`, () => {
        const onEditSpy = vi.fn();

        const props = {
          story: {
            _editing: { state },
          },
        };

        const { container } = renderComponent(props);
        const select = container.querySelector('select');

        expect(select.value).toBe(state);
      });
    });
  });

  describe('when the user selects a state', () => {
    it('triggers the edit callback passing the story state', () => {
      const state = states[0];
      const change = states[1];
      const onEditSpy = vi.fn();
      const props = {
        story: {
          _editing: { state },
        },
        onEdit: onEditSpy,
      };

      const { container } = renderComponent(props);
      const select = container.querySelector('select');
      fireEvent.change(select, { target: { value: change } });

      expect(onEditSpy).toHaveBeenCalledWith(change);
    });
  });

  describe('when component is disabled', () => {
    it('select field is disabled', () => {
      const props = {
        story: { state: 'started', _editing: { state: 'started' } },
        disabled: true,
      };

      const { container } = renderComponent(props);
      const select = container.querySelector('select');

      expect(select).toBeDisabled();
    });
  });

  describe('when component is enabled', () => {
    it('select field is editable', () => {
      const props = {
        story: { state: 'started', _editing: { state: 'started' } },
        disabled: false,
      };

      const { container } = renderComponent(props);
      const select = container.querySelector('select');

      expect(select).not.toBeDisabled();
    });
  });

  describe('When change estimate', () => {
    describe('to no estimate', () => {
      it('disables state select', () => {
        const props = {
          story: {
            _editing: {
              estimate: '',
              storyType: 'feature',
              state: 'unscheduled',
            },
          },
        };

        const { container } = renderComponent(props);
        const select = container.querySelector('select');

        expect(select).toBeDisabled();
      });
    });

    describe('to a number', () => {
      it("doesn't disable state select when estimate is a number", () => {
        const props = {
          story: {
            _editing: { estimate: 1, storyType: 'feature', state: 'unstarted' },
          },
        };

        const { container } = renderComponent(props);
        const select = container.querySelector('select');

        expect(select).not.toBeDisabled();
      });
    });
  });
});
