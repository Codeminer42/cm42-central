import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryControls from 'components/story/ExpandedStory/ExpandedStoryControls';

describe('<ExpandedStoryControls />', () => {
  const controls = ['save', 'delete', 'cancel'];

  it('renders all the control buttons', () => {
    const wrapper = shallow(<ExpandedStoryControls readOnly={false} />);

    controls.forEach(control => {
      expect(wrapper.find(`.${control}`).prop('value')).toBe(I18n.t(control))
    });
  });

  describe('when the user clicks on save', () => {
    it('triggers the update callback', () => {
      const onSave = sinon.spy();

      const wrapper = shallow(
        <ExpandedStoryControls
          readOnly={false}
          onSave={onSave}
        />
      );

      wrapper.find('.save').simulate('click');

      expect(onSave).toHaveBeenCalled();
    });
  });

  describe('when the user clicks on delete', () => {
    beforeEach(() => {
      sinon.stub(window, 'confirm').returns(true);
    });

    afterEach(() => {
      window.confirm.restore();
    });

    it('triggers the delete callback after confirm', () => {
      const onDelete = sinon.spy();

      const wrapper = shallow(
        <ExpandedStoryControls
          readOnly={false}
          onDelete={onDelete}
        />
      );

      wrapper.find('.delete').simulate('click');

      expect(onDelete).toHaveBeenCalled();
    });
  });

  describe('when the user clicks on cancel', () => {
    beforeEach(() => {
      sinon.stub(window, 'confirm')
    });

    afterEach(() => {
      window.confirm.restore();
    });

    it('triggers the toggle callback', () => {
      const handleCancel = sinon.spy();

      const wrapper = shallow(
        <ExpandedStoryControls
          readOnly={false}
          onCancel={handleCancel}
        />
      );

      wrapper.find('.cancel').simulate('click');

      expect(handleCancel).toHaveBeenCalled();
    });

    describe('when there is unsaved changes', () => {
      it('triggers a warning window ', () => {
        const handleCancel = sinon.spy();

        const wrapper = shallow(
          <ExpandedStoryControls
            readOnly={false}
            isDirty={true}
            onCancel={handleCancel}
          />
        );

        wrapper.find('.cancel').simulate('click');

        expect(window.confirm).toHaveBeenCalled();
        expect(handleCancel).not.toHaveBeenCalled();
      });
    });

    describe('when no changes were made', () => {
      it('does not trigger a warning window ', () => {
        const handleCancel = sinon.spy();

        const wrapper = shallow(
          <ExpandedStoryControls
            readOnly={false}
            isDirty={false}
            onCancel={handleCancel}
          />
        );

        wrapper.find('.cancel').simulate('click');

        expect(window.confirm).not.toHaveBeenCalled();
      });
    });
  });

  describe('readOnly', () => {
    describe("when it's true", () => {
      let wrapper;

      beforeEach(() => {
        wrapper = shallow(
          <ExpandedStoryControls
            readOnly={true}
          />
        );
      });

      it('disable save button', () => {
        const button = wrapper.find('.save');

        expect(button.prop('disabled')).toBe(true);
      });

      it('disable delete button', () => {
        const button = wrapper.find('.delete');

        expect(button.prop('disabled')).toBe(true);
      });

      it("don't set disable prop to cancel button", () => {
        const button = wrapper.find('.cancel');

        expect(button.prop('disabled')).toBe(undefined);
      });
    });

    describe("when it's false", () => {
      let wrapper;

      beforeEach(() => {
        wrapper = shallow(
          <ExpandedStoryControls
            readOnly={false}
          />
        );
      });

      it("don't disable save button", () => {
        const button = wrapper.find('.save');

        expect(button.prop('disabled')).toBe(false);
      });

      it("don't disable delete button", () => {
        const button = wrapper.find('.delete');

        expect(button.prop('disabled')).toBe(false);
      });
    });
  });
});
