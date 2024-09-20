import { render, screen } from '@testing-library/react';
import CollapsedStoryStateActions from 'components/story/CollapsedStory/CollapsedStoryStateActions';
import React from 'react';
import { describe, it } from 'vitest';
import storyFactory from '../../../support/factories/storyFactory';
import { renderWithProviders } from '../../setupRedux';

describe('<CollapsedStoryStateActions />', () => {
  const renderComponent = props => {
    const defaultProps = { story: { estimate: null } };
    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(<CollapsedStoryStateActions {...mergedProps} />);
  };

  describe('When estimate is null', () => {
    it('renders <CollapsedStoryStateActions /> component', () => {
      const props = {
        project: {
          pointValues: [1, 2, 3, 5, 8],
        },
      };

      const { container } = renderComponent(props);

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
          const props = {
            story: storyFactory({ state }),
            project: { pointValues: [1, 2, 3, 5, 8] },
          };

          renderComponent(props);

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

        const { container } = render(
          <CollapsedStoryStateActions story={props} />
        );
        const stateButton = container.querySelector('.Story__btn');

        expect(stateButton).not.toBeInTheDocument();
      });
    });
  });
});
