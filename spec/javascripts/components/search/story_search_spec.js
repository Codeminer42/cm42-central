import React from 'react';
import { shallow } from 'enzyme';
import StorySearch from 'components/search/StorySearch';

describe('<StorySearch />',  () => {
  it('renders the component', () => {
    const wrapper = shallow(
      <StorySearch 
        projectId={1}
        search={sinon.stub()}
        loading={false}
      />
    );

    expect(wrapper).toExist();
  });

  describe('loading', () => {
    describe('when loading is true', () => {
      let wrapper;
  
      beforeEach(() => {
        wrapper = shallow(
          <StorySearch 
            projectId={1}
            search={sinon.stub()}
            loading={true}
          />
        );
      });
  
      it('renders the spinner', () => {
        const spinner = wrapper.find('[data-id="spinner-loading"]');
  
        expect(spinner).toBeTruthy();
      });
    });
  });
});
