import React from 'react';
import PropTypes from 'prop-types';
import Stories from '../stories/Stories';
import * as Story from '../../models/beta/story';

export const SearchHeader = ({ stories }) => (
  <div
    className="Sprint__header"
    data-id="search-header"
    data-testid="search-header-container"
  >
    {I18n.t('stories_found')}: {stories.length}
    <div>
      <span className="done-points">
        {I18n.t('projects.reports.points')}: {Story.totalPoints(stories)}
      </span>
    </div>
  </div>
);

const Search = ({ stories }) => (
  <div className="Sprint" data-testid="sprint-container">
    <SearchHeader stories={stories} />
    <div
      className="Sprint__body"
      data-id="stories-search"
      data-testid="stories-search-container"
    >
      <Stories
        columnId="search"
        stories={stories}
        from="search"
        isDropDisabled
      />
    </div>
  </div>
);

const propTypes = {
  stories: PropTypes.array.isRequired,
};

const defaultProps = {
  stories: [],
};

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;

export default Search;
