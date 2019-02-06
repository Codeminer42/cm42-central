import React from 'react';
import { shallow } from 'enzyme';

import Checkbox from 'components/forms/Checkbox';

describe('<Checkbox />', function() {
  it("should accept a label and children elements", function() {
    const wrapper = shallow(
      <Checkbox name='checkbox' label='Label'>
        { 'Children' }
      </Checkbox>
    );
    expect(wrapper).toExist();
  });

  it("should not break if it has no children elements", function() {
    const onSubmit = sinon.stub().returns($.Deferred());
    const wrapper = shallow(
      <Checkbox name='checkbox' label='Label' />
    );
    expect(wrapper).toExist();
  });

});
