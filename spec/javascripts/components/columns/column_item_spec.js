import React from 'react';
import { shallow } from 'enzyme';

import ColumnItem from 'components/Columns/ColumnItem';

describe('<ColumnItem />', () => {
  const render = overrideProps => {
    const defaultProps = {
      title: '',
      visible: true,
      onClose: sinon.stub(),
      canCloseColumn: true
    };

    const wrapper = shallow(<ColumnItem {...defaultProps} {...overrideProps} />);
    const column = wrapper.find('[data-id="column"]');
    const title = wrapper.find('[data-id="column-title"]');
    const button = wrapper.find('[data-id="column-button"]');
    const children = wrapper.find('[data-id="column-children"]');
    return { wrapper, title, button, children, column };
  };

  describe('when visible is true', () => {
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
  });

  describe('button', () => {
    describe('when canCloseColumn is true', () => {
      it('renders button', () => {
        const { button } = render();

        expect(button.exists()).toBeTruthy();
      });
    });

    describe('when canCloseColumn is false', () => {
      it('does not render the button', () => {
        const { button } = render({ canCloseColumn: false });

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

  describe('when visible is false', () => {
    it('does not render the component', () => {
      const { column } = render({ visible: false });
  
      expect(column.exists()).toBeFalsy();
    });

    it('does not call renderAction', () => {
      const renderAction = sinon.stub();
      render({ renderAction, visible: false });

      expect(renderAction).not.toHaveBeenCalled();
    });
  });
});
