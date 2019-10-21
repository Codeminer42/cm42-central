import React from 'react';
import { shallow } from 'enzyme';
import Search from 'components/search/Search';

describe('<Search />', () => {
  describe('when have not stories', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<Search />);
    });

    it('renders the component', () => {
      expect(wrapper).toExist();
    });
  
    it('renders header', () => {
      expect(wrapper.find('[data-id="search-header"]')).toBeTruthy();
    });
  
    it('renders stories', () => {
      expect(wrapper.find('[data-id="stories-search"]')).toBeTruthy();
    });
  });

  const storiesAmount = [1, 10, 100];

  describe(`when have ${storiesAmount} stories`, () => {
    const stories = Array(storiesAmount).fill({ estimate: 2 });    
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<Search stories={stories} />);
    });

    it('renders the component', () => {
      expect(wrapper).toExist();
    });
  
    it('renders header', () => {
      expect(wrapper.find('[data-id="search-header"]')).toBeTruthy();
    });
  
    it('renders stories', () => {
      expect(wrapper.find('[data-id="stories-search"]')).toBeTruthy();
    });
  });
});

