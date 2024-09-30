import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import { StorySearch } from 'components/search/StorySearch';

describe('<StorySearch />', () => {
  beforeAll(() => {
    ReactDOM.createPortal = vi.fn(element => {
      return element;
    });
  });

  beforeEach(() => {
    const divPortal = document.createElement('div');
    divPortal.setAttribute('data-portal', 'search');
    const body = document.querySelector('body');
    body.appendChild(divPortal);
  });

  describe('loading', () => {
    describe('when loading is true', () => {
      it('renders the spinner', () => {
        const { container } = render(
          <StorySearch projectId={1} search={vi.fn()} loading={true} />
        );

        expect(
          container.querySelector('.StorySearch__spinner')
        ).toBeInTheDocument();
      });
    });
  });

  it('renders the component', () => {
    const { container } = render(
      <StorySearch projectId={1} search={vi.fn()} loading={false} />
    );

    expect(container).toBeInTheDocument();
  });
});
