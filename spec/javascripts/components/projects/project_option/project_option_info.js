import React from 'react';
import { shallow } from 'enzyme';
import ProjectOptionInfo from 'components/projects/ProjectOption/ProjectOptionInfo';

describe('<ProjectOptionInfo />', () => {
  it('renders the component', () => {
    const wrapper = shallow(<ProjectOptionInfo description='' />);

    expect(wrapper).toExist();
  });

  const descriptions = ['foo','bar','lorem ipsum'];

  descriptions.forEach(description => {
    describe(`when description is ${description}`, () => {
      it('renders the component', () => {
        const wrapper = shallow(<ProjectOptionInfo description={description} />);

        expect(wrapper).toExist();
      });

      it(`render the text ${description}`, () => {
        const wrapper = shallow(<ProjectOptionInfo description={description} />);
        const span = wrapper.find('[data-id="project-option-info"]');

        expect(span.text()).toEqual(description);
      });
    });
  });
});
