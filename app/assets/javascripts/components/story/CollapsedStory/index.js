import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import classname from 'classnames';
import PropTypes from 'prop-types';
import { updateCollapsedStory, highlight } from '../../../actions/story';
import StoryPopover from '../StoryPopover';
import StoryDescriptionIcon from '../StoryDescriptionIcon';
import CollapsedStoryEstimate from './CollapsedStoryEstimate';
import CollapsedStoryStateActions from './CollapsedStoryStateActions';
import CollapsedStoryInfo from './CollapsedStoryInfo';
import StoryIcon from '../StoryIcon';
import MDSpinner from "react-md-spinner";
import * as Story from '../../../models/beta/story';
import CollapsedStoryFocusButon from './CollapsedStoryFocusButton';
import StoryPropTypes from '../../shapes/story';

const storyClassName = (story, additionalClassname = '', isDragging, isDragDisabled) => {
  const isStoryNotEstimated = Story.isStoryNotEstimated(story.storyType, story.estimate);
  const isRelease = Story.isRelease(story);
  return classname(
    'Story Story--collapsed',
    {
      'Story--release': isRelease,
      'Story--unestimated': isStoryNotEstimated,
      'Story--estimated': !isStoryNotEstimated,
      'Story--isDragging': isDragging,
      'Story--cantBeMoved': story.loading || isDragDisabled,
    },
    additionalClassname
  );
};

export const Container = ({
  onToggle,
  story,
  updateCollapsedStory,
  project,
  className,
  title,
  highlight,
  isHighlightable,
  isDragging,
  provided,
  isDragDisabled,
  onLabelClick
}) => (
    <div
      className={storyClassName(story, className, isDragging, isDragDisabled)}
      onClick={!story.loading ? onToggle : () => { }}
      title={title}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
    >
      <StoryPopover story={story}>
        <div className='Story__icons-block'>
          <StoryIcon storyType={story.storyType} />
          <CollapsedStoryEstimate estimate={story.estimate} />
          <StoryDescriptionIcon description={story.description} />
        </div>
      </StoryPopover>

      <CollapsedStoryInfo story={story} onLabelClick={onLabelClick} />

      {
        story.loading ? (
          <MDSpinner size={20} singleColor={"#333"} />
        ) : (
            <CollapsedStoryStateActions story={story}
              onUpdate={(newAttributes) =>
                updateCollapsedStory(story.id, project.id, newAttributes)}
            />
          )
      }
      {
        isHighlightable &&
        <CollapsedStoryFocusButon onClick={() => highlight(story.id)} />
      }
    </div>
  )

export const CollapsedStory = ({ index, sprintIndex, columnId, ...props }) => {
  const { story } = { ...props }

  const isDragDisabled = useMemo(() =>
    story.state === 'accepted' || columnId === 'search' || story.loading, [story, columnId]
  );

  return (
    <Draggable
      draggableId={JSON.stringify({ id: story.id.toString(), sprintIndex })}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => (
        <Container {...props} provided={provided} isDragging={snapshot.isDragging} isDragDisabled={isDragDisabled} />
      )}
    </Draggable>
  )
}

CollapsedStory.propTypes = {
  story: StoryPropTypes,
  onToggle: PropTypes.func.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  from: PropTypes.string,
  highlight: PropTypes.func,
  index: PropTypes.number,
  sprintIndex: PropTypes.number,
  columnId: PropTypes.string,
  onLabelClick: PropTypes.func.isRequired
};

const mapStateToProps = ({
  project,
  stories
}, props) => ({
  project,
  stories,
  isHighlightable: Story.haveHighlightButton(Story.withScope(stories), props.story, props.from)
});

const mapDispatchToProps = { updateCollapsedStory, highlight }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollapsedStory);
