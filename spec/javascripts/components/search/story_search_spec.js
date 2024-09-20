import React from 'react';
import { render } from '@testing-library/react';
import { StorySearch } from 'components/search/StorySearch';

describe('<StorySearch />', () => {
  beforeEach(() => {
    const divPortal = global.document.createElement('div');
    divPortal.setAttribute('data-portal', 'search');
    const body = global.document.querySelector('body');
    body.appendChild(divPortal);
  });

  it('renders the component', () => {
    const { container } = render(
      <StorySearch projectId={1} search={vi.fn()} loading={false} />
    );

    expect(container).toBeInTheDocument();
  });

  describe('loading', () => {
    describe('when loading is true', () => {
      it('renders the spinner', () => {
        const { getByTestId } = render(
          <StorySearch projectId={1} search={vi.fn()} loading={true} />
        );

        expect(getByTestId('story-search-spinner')).toBeInTheDocument();
      });
    });
  });
});
