import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Column } from 'components/Columns/ColumnItem';

describe('<Column />', () => {
  const renderComponent = overrideProps => {
    const defaultProps = {
      title: '',
      onClose: vi.fn(),
      canClose: true,
      children: '',
      renderAction: vi.fn(),
      providedProps: {},
      placeholder: '',
    };

    const {
      getByTestId,
      queryByTestId,
      container: wrapper,
    } = render(<Column {...defaultProps} {...overrideProps} />);
    const column = getByTestId('column-container');
    const title = getByTestId('column-header-title');
    const button = queryByTestId('column-action-button');
    const children = getByTestId('column-children-content');

    return { wrapper, title, button, children, column };
  };

  it('renders the component', () => {
    const { column } = renderComponent();

    expect(column).toBeInTheDocument();
  });

  it('renders the title', () => {
    const titleText = 'title';
    const { title } = renderComponent({ title: titleText });

    expect(title.innerHTML).toBe(titleText);
  });

  it('renders the children', () => {
    const childrenContent = 'children!';
    const { children } = renderComponent({ children: childrenContent });

    expect(children.innerHTML).toBe(childrenContent);
  });

  it('calls renderAction', () => {
    const renderAction = vi.fn();
    renderComponent({ renderAction });

    expect(renderAction).toHaveBeenCalled();
  });

  describe('button', () => {
    describe('when canClose is true', () => {
      it('renders button', () => {
        const { button } = renderComponent();

        expect(button).toBeInTheDocument();
      });
    });

    describe('when canClose is false', () => {
      it('does not render the button', () => {
        const { button } = renderComponent({ canClose: false });

        expect(button).not.toBeInTheDocument();
      });

      describe('when button is clicked', () => {
        it('calls onClose', () => {
          const onClose = vi.fn();
          const { button } = renderComponent({ onClose });
          fireEvent.click(button);

          expect(onClose).toHaveBeenCalled();
        });
      });
    });
  });
});
