/* eslint react/jsx-indent:"off" */
import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { shallow } from 'enzyme';

import Checkbox from 'components/forms/Checkbox';

describe('<Checkbox />', () => {
  beforeEach(jasmineEnzyme);

  it('should accept a label and children elements', () => {
    const wrapper = shallow(<Checkbox name="checkbox" label="Label">
      { 'Children' }
                            </Checkbox>);
    expect(wrapper).toBePresent();
  });

  it('should not break if it has no children elements', () => {
    const onSubmit = sinon.stub().returns($.Deferred());
    const wrapper = shallow(<Checkbox name="checkbox" label="Label" />);
    expect(wrapper).toBePresent();
  });
});
