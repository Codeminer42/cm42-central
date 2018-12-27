import React from 'react';
import { shallow } from 'enzyme';
import ExpandedStoryControls from 'components/story/ExpandedStory/ExpandedStoryControls';

describe('<ExpandedStoryControls />', () => {
  const controls = ['save', 'delete', 'cancel'];

  it('renders all the control buttons', () => {
    const wrapper = shallow(<ExpandedStoryControls readOnly={false} />);

    controls.map(control => {
      expect(wrapper.find(`.${control}`).prop('value')).toBe(I18n.t(control))
    })
  });

  describe('when the user click on save', () => {
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

  describe('when the user click on delete', () => {
    it('triggers the delete callback', () => {
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

  describe('when the user click on cancell', () => {
    it('triggers the toggle callback', () => {
      const onCancel = sinon.spy();

      const wrapper = shallow(
        <ExpandedStoryControls
          readOnly={false}
          onCancel={onCancel}
        />
      );

      wrapper.find('.cancel').simulate('click');

      expect(onCancel).toHaveBeenCalled();
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
