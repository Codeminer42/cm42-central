import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import jasmineEnzyme from 'jasmine-enzyme';

Enzyme.configure({ adapter: new Adapter() });

beforeEach(() => {
  jasmineEnzyme();
});

export * from 'enzyme';
