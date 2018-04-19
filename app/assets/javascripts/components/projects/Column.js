import React from 'react'

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
  <div className="project-board__column">
    <div className="project-board__header">
      <h3 className="project-board__name">{title}</h3>
      <button type="button" className="project-board__btn-close">x</button>
    </div>
    <Stories stories={stories} />
  </div>
);

export default Column
