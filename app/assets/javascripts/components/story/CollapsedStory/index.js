import React from 'react';
import classname from 'classnames';
import StoryPopover from '../StoryPopover';
import StoryDescriptionIcon from '../StoryDescriptionIcon';
import CollapsedStoryEstimate from './CollapsedStoryEstimate';
import CollapsedStoryStateActions from './CollapsedStoryStateActions';
import CollapsedStoryInfo from './CollapsedStoryInfo';
import StoryIcon from '../StoryIcon';
import * as Story from '../../../models/beta/story';
import { updateCollapsedStory, highlight } from '../../../actions/story';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CollapsedStoryFocusButon from './CollapsedStoryFocusButton';
import StoryPropTypes from '../../shapes/story';
import { Draggable } from 'react-beautiful-dnd'

const storyClassName = (story, additionalClassname = '', isDragging) => {
  const isStoryNotEstimated = Story.isStoryNotEstimated(story.storyType, story.estimate);
  const isRelease = Story.isRelease(story);

  return classname(
    'Story Story--collapsed',
    {
      'Story--release': isRelease,
      'Story--unestimated': isStoryNotEstimated,
      'Story--estimated': !isStoryNotEstimated,
      'Story--isDragging': isDragging
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
  provided
}) => (
  <div
    className={storyClassName(story, className, isDragging)}
    onClick={onToggle}
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

    <CollapsedStoryInfo story={story} />

    <CollapsedStoryStateActions story={story}
      onUpdate={(newAttributes) =>
        updateCollapsedStory(story.id, project.id, newAttributes)}
    />
    {
      isHighlightable &&
      <CollapsedStoryFocusButon onClick={() => highlight(story.id)} />
    }
  </div>
)

export const CollapsedStory = ({index, sprintIndex, ...other}) => {
  const {story} = {...other}
  return (
    <Draggable
      draggableId={JSON.stringify({id: story.id.toString(), sprintIndex})}
      index={index} 
      isDragDisabled={story.state === 'accepted'}
    >
      {(provided, snapshot) => (
        <Container {...other} provided={provided} isDragging={snapshot.isDragging}/>
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
  highlight: PropTypes.func
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
