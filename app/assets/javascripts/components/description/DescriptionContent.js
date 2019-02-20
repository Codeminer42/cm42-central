import React from 'react';
import Parser from 'html-react-parser';
import memoize from 'memoizee';

import StoryLink from 'components/stories/StoryLink';

const editButton = isReadonly => {
  return(
    <input
      className={!isReadonly ? 'edit-description' : ''}
      name="edit-description"
      disabled={isReadonly}
      value={I18n.t('edit')}
      type="button"
    />
  );
}

const replaceStoryLink = (domNode, linkedStories) => {
  if (!domNode.attribs || !domNode.attribs['data-story-id']) return;
  const id = domNode.attribs['data-story-id'];
  const story = linkedStories[id];
  return( <StoryLink story={story} key={id} /> );
}

const DescriptionContent = ({ description, isReadonly, linkedStories, onClick }) => {
  const descriptionHTML = window.md.makeHtml(description);
  const isEmpty = !description || !description.length;

  description = Parser(descriptionHTML, { replace: domNode =>
    replaceStoryLink(domNode, linkedStories)
  });

  return(
    isEmpty ? editButton(isReadonly) : <div className='description'>{ description }</div>
  );
}

export default memoize(DescriptionContent);
