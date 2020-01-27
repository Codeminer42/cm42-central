import React from 'react';
import { shallow } from 'enzyme';
import { Column } from 'components/Columns/ColumnItem';

describe('<Column />', () => {
  const render = overrideProps => {
    const defaultProps = {
      title: '',
      onClose: sinon.stub(),
      canClose: true,
      children: '',
      renderAction: sinon.stub(),
      providedProps: { },
      placeholder: ''
    };

    const wrapper = shallow(<Column {...defaultProps} {...overrideProps} />);
    const column = wrapper.find('[data-id="column"]');
    const title = wrapper.find('[data-id="column-title"]');
    const button = wrapper.find('[data-id="column-button"]');
    const children = wrapper.find('[data-id="column-children"]');
    return { wrapper, title, button, children, column };
  };

  it('renders the component', () => {
    const { column } = render();

    expect(column.exists()).toBeTruthy();
  });

  it('renders the title', () => {
    const titleText = 'title';
    const { title } = render({ title: titleText });

    expect(title.text()).toBe(titleText);
  });

  it('renders the children', () => {
    const childrenContent = 'children!';
    const { children } = render({ children: childrenContent });

    expect(children.text()).toBe(childrenContent);
  });

  it('calls renderAction', () => {
    const renderAction = sinon.stub();
    render({ renderAction });

    expect(renderAction).toHaveBeenCalled();
  });

  describe('button', () => {
    describe('when canClose is true', () => {
      it('renders button', () => {
        const { button } = render();

        expect(button.exists()).toBeTruthy();
      });
    });

    describe('when canClose is false', () => {
      it('does not render the button', () => {
        const { button } = render({ canClose: false });

        expect(button.exists()).toBeFalsy();
      });

      describe('when button is clicked', () => {
        it('calls onClose', () => {
          const onClose = sinon.stub();
          const { button } = render({ onClose });
          button.simulate('click');
    
          expect(onClose).toHaveBeenCalled();
        });
      });
    });
  });
});
