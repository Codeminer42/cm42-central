import { render, screen } from '@testing-library/react';
import CollapsedStoryStateActions from 'components/story/CollapsedStory/CollapsedStoryStateActions';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { describe, it } from 'vitest';
import storyFactory from '../../../support/factories/storyFactory';

const mockReducer = (state = {}, action) => state;
const createMockStore = (initialState = {}) => {
  return createStore(mockReducer, initialState);
};

describe('<CollapsedStoryStateActions />', () => {
  describe('When estimate is null', () => {
    it('renders <CollapsedStoryEstimateButton /> component', () => {
      const props = storyFactory({ estimate: null });
      const mockStore = createMockStore({
        project: {
          pointValues: [1, 2, 3, 5, 8],
        },
      });

      const { container } = render(
        <Provider store={mockStore}>
          <CollapsedStoryStateActions story={props} />
        </Provider>
      );

      expect(container).toBeInTheDocument();
    });
  });

  describe('When estimate is not null', () => {
    const states = [
      { state: 'started', actions: ['finish'] },
      { state: 'finished', actions: ['deliver'] },
      { state: 'delivered', actions: ['accept', 'reject'] },
      { state: 'rejected', actions: ['restart'] },
      { state: 'unstarted', actions: ['start'] },
      { state: '', actions: ['start'] },
    ];

    states.forEach(({ state, actions }) => {
      describe(`When state = ${state}`, () => {
        it('renders the <CollapsedStoryStateButton /> component', () => {
          const props = storyFactory({ state });
          const mockStore = createMockStore({
            project: {
              pointValues: [1, 2, 3, 5, 8],
            },
          });
          render(
            <Provider store={mockStore}>
              <CollapsedStoryStateActions story={props} />
            </Provider>
          );

          actions.forEach(action => {
            const stateButtons = screen.getAllByText(action, { exact: false });
            expect(stateButtons.length).toBeGreaterThan(0);

            stateButtons.forEach(stateButton => {
              expect(stateButton.closest('button')).toBeInTheDocument();
            });
          });
        });
      });
    });

    describe("When state =  'accepted' ", () => {
      it("Doesn't render <CollapsedStoryStateButton /> component", () => {
        const props = storyFactory({ state: 'accepted' });

        render(<CollapsedStoryStateActions story={props} />);
        const stateButtons = screen.queryAllByTestId(/^mocked-state-button/);

        expect(stateButtons).toHaveLength(0);
      });
    });
  });
});
