import React, { useRef } from 'react';
import classname from 'classnames';
import { useDrag, useDrop } from 'react-dnd';
import StoryPopover from '../StoryPopover';
import StoryDescriptionIcon from '../StoryDescriptionIcon';
import CollapsedStoryEstimate from './CollapsedStoryEstimate';
import CollapsedStoryStateActions from './CollapsedStoryStateActions';
import CollapsedStoryInfo from './CollapsedStoryInfo';
import StoryIcon from '../StoryIcon';
import * as Story from '../../../models/beta/story';
import { dragDropStory, updateCollapsedStory, highlight } from '../../../actions/story';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CollapsedStoryFocusButon from './CollapsedStoryFocusButton';
import { storyPropTypesShape } from './../../../models/beta/story';
import { isDone } from '../../../models/beta/column';
import { getNewPosition, canChangePosition, isADropTarget, canChangeColumn, type } from '../../../models/beta/dragDrop';

const storyClassName = (story, additionalClassname = '') => {
  const isStoryNotEstimated = Story.isStoryNotEstimated(
    story.storyType,
    story.estimate
  )
  const isRelease = Story.isRelease(story)

  return classname(
    'Story Story--collapsed',
    {
      'Story--release': isRelease,
      'Story--unestimated': isStoryNotEstimated,
      'Story--estimated': !isStoryNotEstimated
    },
    additionalClassname
  )
}

export const CollapsedStory = ({
  onToggle,
  story,
  dragDropStory,
  project,
  className,
  title,
  index,
  stories,
  column,
  updateCollapsedStory,
  highlight,
  isHighlightable
}) => {
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: type.story,
    canDrop() {
      return isDone(column);
    },
    hover(item, monitor) {
      const storySource = monitor.getItem();
      const hoverIndex = index
      const storiesArray = storySource.stories;

      if (storySource.column !== column){
        return true
      };

      const newPosition = getNewPosition(item, story, storiesArray, index);

      if (canChangePosition(ref, monitor, storySource, hoverIndex, newPosition)) {
        return true;
      }

      dragDropStory(storySource.id, {
        position: newPosition
      })
    }
  })
  const [{ isDragging }, drag] = useDrag({
    item: { type: type.story, ...story, index, stories, column},
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag() {
      return story.state !== "accepted";
    },
    begin() {
      return { ...story, index, stories, column }
    },
    end(item, monitor) {
      if(isADropTarget(monitor)) return null;
      const {state, column} = monitor.getDropResult();

      if (canChangeColumn(state, column) && !Story.isUnestimatedFeature(story)) {
        dragDropStory(item.id, {
          state: column === 'backlog' ? 'unstarted' : 'unscheduled'
        });
      }
    }
  })
  drag(drop(ref))
  return (
    <div
      ref={ref}
      className={storyClassName(story, className)}
      onClick={onToggle}
      title={title}
      style={{
        opacity: isDragging ? 0 : 1
      }}
    >
      <StoryPopover story={story}>
        <div className="Story__icons-block">
          <StoryIcon storyType={story.storyType} />
          <CollapsedStoryEstimate estimate={story.estimate} />
          <StoryDescriptionIcon description={story.description} />
        </div>
      </StoryPopover>

      <CollapsedStoryInfo story={story} />

      <CollapsedStoryStateActions
        story={story}
        onUpdate={newAttributes =>
          updateCollapsedStory(story.id, project.id, newAttributes)
        }
      />
      {
        isHighlightable &&
        <CollapsedStoryFocusButon onClick={() => highlight(story.id)} />
      }
    </div>
  )
}

CollapsedStory.propTypes = {
  story: storyPropTypesShape,
  onToggle: PropTypes.func.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  index: PropTypes.number,
  stories: PropTypes.arrayOf(storyPropTypesShape),
  column: PropTypes.string,
  from: PropTypes.string,
  highlight: PropTypes.func
};

const mapStateToProps = ({
  project,
  stories
}, props) => ({
  project,
  isHighlightable: Story.haveHighlightButton(Story.withScope(stories), props.story, props.from)
});

const mapDispatchToProps = { dragDropStory, updateCollapsedStory, highlight }

export default connect(
mapStateToProps, mapDispatchToProps
)(CollapsedStory)
