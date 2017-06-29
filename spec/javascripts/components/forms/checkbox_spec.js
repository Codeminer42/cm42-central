import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import { shallow } from 'enzyme';

import Checkbox from 'components/forms/Checkbox';

describe('<Checkbox />', function() {

  beforeEach(jasmineEnzyme);

  it("should accept a label and children elements", function() {
    const wrapper = shallow(
      <Checkbox name='checkbox' label='Label'>
        { 'Children' }
      </Checkbox>
    );
    expect(wrapper).toBePresent();
  });

  it("should not break if it has no children elements", function() {
    const onSubmit = sinon.stub().returns($.Deferred());
    const wrapper = shallow(
      <Checkbox name='checkbox' label='Label' />
    );
    expect(wrapper).toBePresent();
  });

});
