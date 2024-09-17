import React from 'react';
import { render } from '@testing-library/react';
import Checkbox from 'components/forms/Checkbox';

describe('<Checkbox />', function () {
  it('should accept a label and children elements', function () {
    const { container } = render(
      <Checkbox name="checkbox" label="Label">
        {'Children'}
      </Checkbox>
    );

    expect(container).toBeInTheDocument();
  });

  it('should not break if it has no children elements', function () {
    const { container } = render(<Checkbox name="checkbox" label="Label" />);

    expect(container).toBeInTheDocument();
  });
});
