import { fireEvent, screen } from '@testing-library/react';
import ExpandedStoryControls from 'components/story/ExpandedStory/ExpandedStoryControls';
import React from 'react';
import { renderWithProviders } from '../../setupRedux';

describe('<ExpandedStoryControls />', () => {
  const controls = ['save', 'delete', 'cancel'];

  const renderComponent = props => {
    const defaultProps = {
      onSave: vi.fn(),
      onCancel: vi.fn(),
      isDirty: false,
      canSave: true,
      canDelete: true,
      onDelete: vi.fn(),
      disabled: false,
    };

    const mergedProps = { ...defaultProps, ...props };

    return renderWithProviders(<ExpandedStoryControls {...mergedProps} />);
  };

  it('renders all the control buttons', () => {
    const props = { readOnly: false };

    renderComponent(props);
    controls.forEach(control => {
      const controlButton = screen.getByText(I18n.t(control));

      expect(controlButton).toBeInTheDocument();
    });
  });

  describe('when the user clicks on save', () => {
    it('triggers the update callback', () => {
      const onSave = vi.fn();
      const props = { canSave: true, onSave };

      renderComponent(props);
      const saveButton = screen.getByText(I18n.t('save'));
      fireEvent.click(saveButton);

      expect(onSave).toHaveBeenCalled();
    });
  });

  describe('when the user clicks on delete', () => {
    beforeEach(() => {
      vi.spyOn(window, 'confirm').mockReturnValueOnce(true);
    });

    afterEach(() => {
      window.confirm.mockRestore();
    });

    it('triggers the delete callback after confirm', () => {
      const onDelete = vi.fn();
      const props = { canDelete: true, onDelete };

      renderComponent(props);
      const deleteButton = screen.getByText(I18n.t('delete'));
      fireEvent.click(deleteButton);

      expect(onDelete).toHaveBeenCalled();
    });
  });

  describe('when the user clicks on cancel', () => {
    beforeEach(() => {
      vi.spyOn(window, 'confirm').mockReturnValueOnce(true);
    });

    afterEach(() => {
      window.confirm.mockRestore();
    });

    it('triggers the toggle callback', () => {
      const handleCancel = vi.fn();
      const props = { onCancel: handleCancel };

      renderComponent(props);
      const cancelButton = screen.getByText(I18n.t('cancel'));
      fireEvent.click(cancelButton);

      expect(handleCancel).toHaveBeenCalled();
    });

    describe('when there is unsaved changes', () => {
      it('triggers a warning window', () => {
        const handleCancel = vi.fn();
        const props = {
          canSave: true,
          isDirty: true,
          onCancel: handleCancel,
        };

        renderComponent(props);
        const cancelButton = screen.getByText(I18n.t('cancel'));
        fireEvent.click(cancelButton);

        expect(window.confirm).toHaveBeenCalled();
        expect(handleCancel).toHaveBeenCalled();
      });
    });

    describe('when no changes were made', () => {
      it('does not trigger a warning window ', () => {
        const handleCancel = vi.fn();
        const props = {
          canSave: true,
          isDirty: false,
          onCancel: handleCancel,
        };

        renderComponent(props);
        const cancelButton = screen.getByText(I18n.t('cancel'));
        fireEvent.click(cancelButton);

        expect(window.confirm).not.toHaveBeenCalled();
      });
    });
  });

  describe('canDelete', () => {
    describe("when it's false", () => {
      let component;

      beforeEach(() => {
        component = renderComponent({ canDelete: false, canSave: true });
      });

      it('disable delete button', () => {
        const deleteButton = screen.getByText(I18n.t('delete'));

        expect(deleteButton).toBeDisabled();
      });

      it("don't disable save button ", () => {
        const saveButton = screen.getByText(I18n.t('save'));

        expect(saveButton).not.toBeDisabled();
      });

      it("don't set disable prop to cancel button ", () => {
        const cancelButton = screen.getByText(I18n.t('cancel'));

        expect(cancelButton).not.toBeDisabled();
      });
    });

    describe("when it's true", () => {
      let component;

      beforeEach(() => {
        component = renderComponent({ canDelete: true });
      });

      it("don't disable delete button", () => {
        const deleteButton = screen.getByText(I18n.t('delete'));

        expect(deleteButton).not.toBeDisabled();
      });
    });
  });

  describe('canSave', () => {
    describe("when it's false", () => {
      let component;

      beforeEach(() => {
        component = renderComponent({ canSave: false, canDelete: true });
      });

      it('disable save button', () => {
        const saveButton = screen.getByText(I18n.t('save'));

        expect(saveButton).toBeDisabled();
      });

      it("don't disable delete button ", () => {
        const deleteButton = screen.getByText(I18n.t('delete'));

        expect(deleteButton).not.toBeDisabled();
      });

      it("don't set disable prop to cancel button ", () => {
        const cancelButton = screen.getByText(I18n.t('cancel'));

        expect(cancelButton).not.toBeDisabled();
      });
    });

    describe("when it's true", () => {
      let component;

      beforeEach(() => {
        component = renderComponent({ canSave: true });
      });

      it("don't disable save button", () => {
        const saveButton = screen.getByText(I18n.t('save'));

        expect(saveButton).not.toBeDisabled();
      });
    });
  });

  describe('when prop disabled is false', () => {
    it('should not render ExpandedStoryToolTip', () => {
      const { container } = renderComponent();

      const tooltip = container.querySelector('.infoToolTip');
      expect(tooltip).toBeNull();
    });
  });

  describe('when prop disabled is true', () => {
    it('should render ExpandedStoryToolTip', () => {
      const { container } = renderComponent({ disabled: true });

      const tooltip = container.querySelector('.infoToolTip');
      expect(tooltip).not.toBeNull();
      expect(tooltip).toBeInTheDocument();
    });
  });
});
