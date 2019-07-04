import React from "react";
import { mount } from "enzyme";
import SprintHeader from "components/stories/SprintHeader";

const defaultProps = {
  number: 42,
  onClick: sinon.stub(),
  startDate: '1420/01/01',
  isDone: false,
  points: 420,
  isClosed: false,
  completedPoints: 111
};

const mergeProps = overrides => ({ ...defaultProps, ...overrides });

const renderWrapper = overrides => mount(
  <SprintHeader {...mergeProps(overrides)} />
);

describe('<SprintHeader />', () => {
  let wrapper, onClick

  beforeEach(() => {
    onClick = sinon.stub();
    wrapper = renderWrapper({ onClick });
  });

  it('Renders a div with class of "Sprint__header"', () => {
    const header = wrapper.find('div.Sprint__header');

    expect(header.exists()).toBe(true);
  });

  it('Calls onClick prop when div is clicked', () => {
    const header = wrapper.find('div.Sprint__header');

    header.simulate('click');

    expect(onClick).toHaveBeenCalled();
  });

  it('displays iteration number', () => {
    expect(wrapper.html()).toContain('42');
  });

  it('displays iteration start date', () => {
    const expected = I18n.l("date.formats.long", defaultProps.startDate);

    expect(wrapper.html()).toContain(expected);
  })

  describe('default sprints', () => {
    it('shows sprint points', () => {
      expect(wrapper.find('div.default-points').html()).toContain('420');
    });

    describe('when there are completed points', () => {
      it('shows completed points', () => {
        expect(wrapper.find('div.default-points').html()).toContain('111');
      })
    });
  });

  describe('done sprints', () => {
    describe('when sprint has points', () => {
      beforeEach(() => {
        wrapper = renderWrapper({
          hasStories: true,
          isDone: true
        });
      });

      it('shows sprint points', () => {
        const donePoints = wrapper.find('span.done-points');

        expect(donePoints.html()).toContain('420');
      });
    });

    describe('when sprint has no points', () => {
      beforeEach(() => {
        wrapper = renderWrapper({
          isClosed: true,
          hasStories: true,
          isDone: true,
          points: 0
        });
      });

      it('does not show sprint points', () => {
        const donePoints = wrapper.find('span.done-points');

        expect(donePoints.children().length).toBe(0);
      });
    });

    describe('when sprint has stories', () => {
      beforeEach(() => {
        wrapper = renderWrapper({
          isDone: true,
          hasStories: true,
          isClosed: true
        });
      });

      it('shows expand icon', () => {
        const icon = wrapper.find('i.Sprint__icon');

        expect(icon.html()).toContain('chevron_right');
      });

      describe('when sprint is closed', () => {
        it('does not have expanded modifier class', () => {
          const icon = wrapper.find('i.Sprint__icon');

          expect(icon).not.toHaveClassName('Sprint__icon--expanded');
        });
      });

      describe('when sprint is expanded', () => {
        beforeEach(() => {
          wrapper = renderWrapper({
            isDone: true,
            hasStories: true,
          });
        });

        it('has expanded modifier class', () => {
          const icon = wrapper.find('i.Sprint__icon');

          expect(icon).toHaveClassName('Sprint__icon--expanded');
        });
      });
    });

    describe('when sprint has no stories', () => {
      beforeEach(() => {
        wrapper = renderWrapper({
          isDone: true,
          hasStories: false,
          isClosed: true
        });
      });

      it('shows "-" icon', () => {
        const icon = wrapper.find('i.Sprint__icon');

        expect(icon.html()).toContain('remove');
      });

      describe('when isClosed prop is true', () => {
        it('does not have expanded modifier class', () => {
          const icon = wrapper.find('i.Sprint__icon');

          expect(icon).not.toHaveClassName('Sprint__icon--expanded');
        });
      });

      describe('when isClosed prop is false', () => {
        beforeEach(() => {
          wrapper = renderWrapper({
            isDone: true,
            hasStories: false,
          });
        });

        it('does not have expanded modifier class', () => {
          const icon = wrapper.find('i.Sprint__icon');

          expect(icon).not.toHaveClassName('Sprint__icon--expanded');
        });
      });
    });
  });
});
