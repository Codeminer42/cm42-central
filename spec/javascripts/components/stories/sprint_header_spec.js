import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import SprintHeader from 'components/stories/SprintHeader';

const defaultProps = {
  number: 42,
  onClick: vi.fn(),
  startDate: '1420/01/01',
  isDone: false,
  points: 420,
  isClosed: false,
  completedPoints: 111,
};

const mergeProps = overrides => ({ ...defaultProps, ...overrides });

const renderWrapper = overrides =>
  render(<SprintHeader {...mergeProps(overrides)} />);

describe('<SprintHeader />', () => {
  it('Renders a div with class of "Sprint__header"', () => {
    const { container } = renderWrapper();
    const header = container.querySelector('div.Sprint__header');

    expect(header).toBeInTheDocument();
  });

  it('Calls onClick prop when div is clicked', () => {
    const onClick = vi.fn();
    const { container } = renderWrapper({ onClick });
    const header = container.querySelector('div.Sprint__header');

    fireEvent.click(header);

    expect(onClick).toHaveBeenCalled();
  });

  it('displays iteration number', () => {
    const { container } = renderWrapper();

    expect(container.innerHTML).toContain('42');
  });

  it('displays iteration start date', () => {
    const { container } = renderWrapper();
    const expected = I18n.l('date.formats.long', defaultProps.startDate);

    expect(container.innerHTML).toContain(expected);
  });

  describe('default sprints', () => {
    it('shows sprint points', () => {
      const { container } = renderWrapper();

      const defaultPoints = container.querySelector('div.default-points');

      expect(defaultPoints.innerHTML).toContain('420');
    });

    describe('when there are completed points', () => {
      it('shows completed points', () => {
        const { container } = renderWrapper();

        const defaultPoints = container.querySelector('div.default-points');

        expect(defaultPoints.innerHTML).toContain('111');
      });
    });
  });

  describe('done sprints', () => {
    describe('when sprint has points', () => {
      it('shows sprint points', () => {
        const { container } = renderWrapper({
          hasStories: true,
          isDone: true,
        });

        const donePoints = container.querySelector('span.done-points');

        expect(donePoints.innerHTML).toContain('420');
      });
    });

    describe('when sprint has no points', () => {
      it('does not show sprint points', () => {
        const { container } = renderWrapper({
          isClosed: true,
          hasStories: true,
          isDone: true,
          points: 0,
        });
        const donePoints = container.querySelector('span.done-points');

        expect(donePoints.children.length).toBe(0);
      });
    });

    describe('when sprint has stories', () => {
      it('shows expand icon', () => {
        const { container } = renderWrapper({
          isDone: true,
          hasStories: true,
          isClosed: true,
        });
        const icon = container.querySelector('i.Sprint__icon');

        expect(icon.innerHTML).toContain('chevron_right');
      });

      describe('when sprint is closed', () => {
        it('does not have expanded modifier class', () => {
          const { container } = renderWrapper({
            isDone: true,
            hasStories: true,
            isClosed: true,
          });
          const icon = container.querySelector('i.Sprint__icon');

          expect(icon).not.toHaveClass('Sprint__icon--expanded');
        });
      });

      describe('when sprint is expanded', () => {
        it('has expanded modifier class', () => {
          const { container } = renderWrapper({
            isDone: true,
            hasStories: true,
          });
          const icon = container.querySelector('i.Sprint__icon');

          expect(icon).toHaveClass('Sprint__icon--expanded');
        });
      });
    });

    describe('when sprint has no stories', () => {
      it('shows "-" icon', () => {
        const { container } = renderWrapper({
          isDone: true,
          hasStories: false,
          isClosed: true,
        });
        const icon = container.querySelector('i.Sprint__icon');

        expect(icon.innerHTML).toContain('remove');
      });

      describe('when isClosed prop is true', () => {
        it('does not have expanded modifier class', () => {
          const { container } = renderWrapper({
            isDone: true,
            hasStories: false,
            isClosed: true,
          });
          const icon = container.querySelector('i.Sprint__icon');

          expect(icon).not.toHaveClass('Sprint__icon--expanded');
        });
      });

      describe('when isClosed prop is false', () => {
        it('does not have expanded modifier class', () => {
          const { container } = renderWrapper({
            isDone: true,
            hasStories: false,
          });
          const icon = container.querySelector('i.Sprint__icon');

          expect(icon).not.toHaveClass('Sprint__icon--expanded');
        });
      });
    });
  });
});
