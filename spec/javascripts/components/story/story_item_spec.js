import React from 'react';
import { renderWithProviders } from '../setupRedux';
import { StoryItem } from 'components/story/StoryItem';
import storyFactory from '../../support/factories/storyFactory';
import moment from 'moment';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

vi.mock('react-clipboard.js', () => ({
  default: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

describe('<StoryItem />', () => {
  vi.spyOn(window.md, 'makeHtml').mockReturnValue('<p>Test</p>');

  const renderComponent = props => {
    const { container: wrapper } = renderWithProviders(
      <DragDropContext onDragEnd={vi.fn}>
        <Droppable droppableId="story-item-test" key={50}>
          {provided => (
            <div ref={provided.innerRef}>
              <StoryItem {...props} toggleStory={vi.fn()} />
            </div>
          )}
        </Droppable>
      </DragDropContext>,
      {
        preloadedState: {
          project: {
            pointValues: [],
            labels: [],
          },
        },
      }
    );
    const expandedStory = wrapper.querySelector('.Story--expanded');

    return { wrapper, expandedStory };
  };

  it('renders the StoryItem component within a Collapsed Story', () => {
    const story = storyFactory({
      collapsed: true,
      _editing: {
        loading: false,
      },
    });
    const { wrapper } = renderComponent({ story, index: 1 });

    expect(wrapper.querySelector('.Story__icons-block')).toBeInTheDocument();
  });

  it('renders the StoryItem component within a Expanded Story', () => {
    const story = storyFactory({
      collapsed: false,
      _editing: {
        loading: false,
      },
    });
    const { wrapper } = renderComponent({ story });

    expect(wrapper.querySelector('.Story--expanded')).toBeInTheDocument();
  });

  describe('when the story is a release that is late', () => {
    it('put .Story--late-release on childrens prop className', () => {
      const story = storyFactory({
        collapsed: false,
        storyType: 'release',
        releaseDate: moment().subtract(3, 'days'),
        _editing: {
          loading: false,
        },
      });
      const className = 'Story--late-release';

      const { wrapper } = renderComponent({ story });

      const children = wrapper.querySelector('.Story--expanded');

      expect(children).toHaveClass(className);
    });

    it('put a late release message on childrens prop title', () => {
      const story = storyFactory({
        collapsed: false,
        storyType: 'release',
        releaseDate: moment().subtract(3, 'days'),
        _editing: {
          loading: false,
        },
      });
      const title = I18n.t('story.warnings.backlogged_release');

      const { wrapper } = renderComponent({ story });

      const children = wrapper.querySelector('.Story--expanded');

      expect(children.title).toBe(title);
    });
  });

  describe("when the story is a release that isn't late", () => {
    it('do not put a className on children components', () => {
      const DEFAULT_CLASSES_QTY = 2;
      const story = storyFactory({
        collapsed: false,
        storyType: 'release',
        releaseDate: moment().add(3, 'days'),
        _editing: {
          loading: false,
        },
      });

      const { wrapper } = renderComponent({ story });

      const children = wrapper.querySelector('.Story--expanded');

      expect(children.classList.length).toBe(DEFAULT_CLASSES_QTY);
    });

    it('do not put a title on children components', () => {
      const story = storyFactory({
        collapsed: false,
        storyType: 'release',
        releaseDate: moment().add(3, 'days'),
        _editing: {
          loading: false,
        },
      });
      const title = '';

      const { wrapper } = renderComponent({ story });

      const children = wrapper.querySelector('.Story--expanded');

      expect(children.title).toBe(title);
    });
  });

  describe('when the story is accepted', () => {
    it('puts .Story--accepted on childrens prop className', () => {
      const { expandedStory } = renderComponent({
        story: storyFactory({
          collapsed: false,
          state: 'accepted',
          _editing: {
            loading: false,
          },
        }),
      });

      expect(expandedStory).toHaveClass('Story--accepted');
    });
  });

  describe('when the story is not accepted', () => {
    it('does not put .Story--accepted on childrens prop className', () => {
      const { expandedStory } = renderComponent({
        story: storyFactory({
          collapsed: false,
          state: 'unscheduled',
          _editing: {
            loading: false,
          },
        }),
      });

      expect(expandedStory).not.toHaveClass('Story--accepted');
    });
  });
});
