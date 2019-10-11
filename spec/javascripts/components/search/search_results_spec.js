import React from 'react';
import { shallow } from 'enzyme';
import SearchResults from 'components/search/Search';

describe('<SearchResults />', () => {
  describe('when isEnabled is false', () => {
    it('do not render the component', () => {
      const wrapper = shallow(
        <SearchResults 
          isEnabled={false}
          searchResults={[]}
          closeSearch={sinon.stub()}
        />
      );
  
      expect(wrapper.instance()).toBeNull();
    });
  });

  describe('when isEnabled is true', () => {
    it('renders the component', () => {
      const wrapper = shallow(
        <SearchResults 
          isEnabled={true}
          searchResults={[]}
          closeSearch={sinon.stub()}
        />
      );
  
      expect(wrapper).toExist();
    });
  });
});
