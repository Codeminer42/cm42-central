import React from "react";
import PropTypes from "prop-types";
import Stories from '../stories/Stories';
import * as Story from '../../models/beta/story';

export const Header = ({ stories }) =>
  <div className="Sprint__header" data-id="search-header">
    Stories found: {stories.length}

    <div>
      <span className="done-points">Points: {Story.totalPoints(stories)}</span>
    </div>
  </div>

const Search = ({ stories }) =>
  <div className="Sprint">
    <Header
      stories={stories}
    />
    <div className="Sprint__body" data-id="stories-search">
      <Stories stories={stories} from="search" />
    </div>
  </div>

const propTypes = {
  stories: PropTypes.array.isRequired
};

const defaultProps = {
  stories: []
};

Search.propTypes = propTypes;
Search.defaultProps = defaultProps;

export default Search;
