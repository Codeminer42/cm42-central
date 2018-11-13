import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Markdown from '../Markdown';
import Popover from 'components/jquery_wrappers/Popover.js';

export const StoryPopoverContent = ({ description, notes, createdAt, storyType, requestedByName }) => (
  <div className='popover__content'>
    <div className='popover__content__subtitle'>
      {
        I18n.translate('requested by user on date', {
          user: requestedByName,
          date: moment(createdAt).format('DD MM YYYY, h:mm a')
        })
      }

      <div className='text-right'>
        { I18n.translate(`story.type.${storyType}`) }
      </div>
    </div>

    {
      Boolean(description) && (
        <div>
          <h1 className='popover__content__title'>
            { I18n.translate('description') }
          </h1>
          
          <div className='markdown-wrapper'>
            <Markdown source={description} />
          </div>
        </div>
      )}

    {
      Boolean(notes.length) && (
        <div>
          <h1 className='popover__content__title'>
            { I18n.translate('notes') }
          </h1>
          
          {notes.map(({ note, id, userName, createdAt }) => 
            <div className='markdown-wrapper' key={id}>
              <Markdown source={note} />
              <div className='markdown-wrapper__text-right' data-test-id={id}>
                { `${userName} - ${createdAt}` }
              </div>
            </div>
          )}
        </div>
      )}
  </div>
)

const StoryPopover = ({
  description,
  notes,
  createdAt,
  title,
  storyType,
  requestedByName,
  children }) => (

    <Popover
      delay={200}
      trigger="hover"
      title={title}
      renderContent={({ ref }) => (
        <div ref={ref}>
          <StoryPopoverContent
            description={description}
            notes={notes}
            createdAt={createdAt}
            storyType={storyType}
            requestedByName={requestedByName}
          />
        </div>
      )}
    >
      {
        ({ ref }) => (
          <bold ref={ref}>
            { children }
          </bold>
        )
      }
    </Popover>
  );

StoryPopover.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  storyType: PropTypes.string.isRequired,
  requestedByName: PropTypes.string,
  createdAt: PropTypes.string,
  notes: PropTypes.array,
};

export default StoryPopover;
