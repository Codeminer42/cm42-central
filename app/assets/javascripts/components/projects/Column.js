
import React from 'react'
import Story from '../story/StoryItem'

const Stories = ({ stories }) => {
  if (!stories.length) {
    return null;
  }

  return (
    <div>
      {stories.map(story => (
        <Story
          key={story.id}
          {...story}
        />
      ))}
    </div>
  );
};

const Column = ({ title, stories }) => (
  <div className="Column">
    <div className="Column__header">
      <h3 className="Column__name">{title}</h3>
      <button type="button" className="Column__btn-close">x</button>
    </div>
    {/* <Story name="features" icon="star" nameIcon="star" />
    <Story name="bugs" icon="bug" nameIcon="bug_report" />
    <Story name="chores" icon="dark" nameIcon="settings"/>
    <Story name="releases" icon="releae" nameIcon="bookmark"/>
    <Story name="estimate features"/> */}
    <Stories stories={stories} />
  </div>
);

export default Column
