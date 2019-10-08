import React from "react";
import PropTypes from "prop-types";
import Stories from './Stories';
import * as Story from './../../models/beta/story';

const propTypes = {
  stories: PropTypes.array.isRequired
};

const defaultProps = {
  stories: []
};

const Header = ({ stories }) =>
  <div className="Sprint__header">
    Stories found: {stories.length}

    <div>
      <span className="done-points">Points: {Story.totalPoints(stories)}</span>
    </div>
  </div>

const SearchedStories = ({ stories }) =>
  <div className="Sprint">
    <Header
      stories={stories}
    />
    <div className="Sprint__body">
      <Stories stories={stories} />
    </div>
  </div>

SearchedStories.propTypes = propTypes;
SearchedStories.defaultProps = defaultProps;

export default SearchedStories;
