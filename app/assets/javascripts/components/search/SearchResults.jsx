import React from "react";
import { connect } from "react-redux";
import { closeSearch } from "actions/projectBoard";
import Search from "./Search";
import { haveSearch } from "./../../models/beta/story";
import { storyScopes } from "./../../libs/beta/constants";
import Column from "./../Columns/ColumnItem";
import PropTypes from "prop-types";
import StoryPropTypes from "../shapes/story";
import { getStories, getStoriesWithScope } from "../../selectors/stories";
import { getProjectBoard } from "../../selectors/projectBoard";

export const SearchResults = ({
  isEnabled,
  searchResults,
  closeSearch,
  projectBoard,
}) => {
  if (!isEnabled) return null;

  return (
    <Column
      title={`"${projectBoard.search.keyWord}"`}
      visible
      onClose={closeSearch}
      canClose
    >
      <Search stories={searchResults} from="search" />
    </Column>
  );
};

SearchResults.propTypes = {
  isEnabled: PropTypes.bool.isRequired,
  searchResults: PropTypes.arrayOf(StoryPropTypes),
  closeSearch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isEnabled: haveSearch(getStories(state)),
  searchResults: getStoriesWithScope(state, storyScopes.SEARCH),
  projectBoard: getProjectBoard(state),
});

const mapDispatchToProps = {
  closeSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
