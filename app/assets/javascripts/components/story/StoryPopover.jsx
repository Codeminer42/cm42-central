import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Markdown from '../Markdown';
import Popover from 'components/jquery_wrappers/Popover';

export const StoryPopoverContent = ({ story }) => (
  <div className='popover__content'>
    <div className='popover__content__subtitle'>
      {
        I18n.t('requested by user on date', {
          user: story.requestedByName,
          date: moment(story.createdAt ,'YYYY/MM/DD').format('DD MM YYYY, h:mm a')
        })
      }

      <div className='text-right'>
        {I18n.t(`story.type.${story.storyType}`)}
      </div>
    </div>

    {
      Boolean(story.description) && (
        <Fragment>
          <h1 className='popover__content__title'>
            {I18n.t('description')}
          </h1>

          <div className='markdown-wrapper'>
            <Markdown source={story.description} />
          </div>
        </Fragment>
      )}

    {
      Boolean(story.notes.length) && (
        <Fragment>
          <h1 className='popover__content__title'>
            {I18n.t('notes')}
          </h1>

          { story.notes.map(({ note, id, userName, createdAt }) =>
            <div className='markdown-wrapper' key={id}>
              <Markdown source={note} />
              <div className='markdown-wrapper__text-right' data-test-id={id}>
                {`${userName} - ${createdAt}`}
              </div>
            </div>
          )}
        </Fragment>
      )}
  </div>
)

const StoryPopover = ({ story, children }) => (
  <Popover
    delay={200}
    trigger="hover"
    title={story.title}
    renderContent={({ ref }) => (
      <div ref={ref}>
        <StoryPopoverContent story={story}/>
      </div>
    )}
  >
    {
      ({ ref }) => (
        <div ref={ref}>
          { children }
        </div>
      )
    }
  </Popover>
);

StoryPopover.propTypes = {
  story: PropTypes.object.isRequired
};

export default StoryPopover;
