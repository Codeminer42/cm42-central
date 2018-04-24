
import React from 'react'
import Story1 from './Story1'

const Story = ({ title }) => (
  <div>
    {title}
  </div>
);

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
    <Story1 name="features" icon="star" nameIcon="star" />
    <Story1 name="bugs" icon="bug" nameIcon="bug_report" />
    <Story1 name="chores" icon="dark" nameIcon="settings"/>
    <Story1 name="releases" icon="releae" nameIcon="bookmark"/>
    <Story1 name="estimate features"/>
    <Stories stories={stories} />
  </div>
);

export default Column
