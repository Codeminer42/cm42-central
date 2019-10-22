import React from 'react';
import { shallow, mount } from 'enzyme';
import SearchTooltip from 'components/search/SearchTooltip';

describe('<SearchTooltip />', () => {
  it('renders the component', () => {
    const wrapper = shallow(<SearchTooltip />);
    
    expect(wrapper).toExist();
  });

  const aditionalClasses = ['foo','bar'];

  aditionalClasses.forEach(aditionalClass => {
    describe(`when aditionalClass is ${aditionalClass}`, () => {
      it(`render component with class ${aditionalClass}`, () => {
        const wrapper = mount(<SearchTooltip aditionalClass={aditionalClass} />);

        expect(wrapper.find('[data-id="search-tooltip"]').hasClass(aditionalClass)).toBeTruthy();
      });
    });
  });
});
