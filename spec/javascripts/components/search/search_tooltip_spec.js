import React from 'react';
import SearchTooltip from 'components/search/SearchTooltip';
import { render } from '@testing-library/react';

describe('<SearchTooltip />', () => {
  it('renders the component', () => {
    const { container } = render(<SearchTooltip />);

    expect(container).toBeInTheDocument();
  });

  const aditionalClasses = ['foo', 'bar'];

  aditionalClasses.forEach(aditionalClass => {
    describe(`when aditionalClass is ${aditionalClass}`, () => {
      it(`render component with class ${aditionalClass}`, () => {
        const { getByTestId } = render(
          <SearchTooltip aditionalClass={aditionalClass} />
        );

        expect(getByTestId('search-tooltip-component')).toHaveClass(
          aditionalClass
        );
      });
    });
  });
});
