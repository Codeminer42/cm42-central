import React from "react";
import { connect } from "react-redux";
import { closeSearch } from "actions/projectBoard";
import Search from "./Search";
import { haveSearch } from "./../../models/beta/story";
import { storyScopes } from "./../../libs/beta/constants";
import Column from "./../Columns/ColumnItem";
import PropTypes from "prop-types";
import StoryPropTypes from "../shapes/story";
import { getStories, getStoriesByScope } from "../../selectors/stories";

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

const mapStateToProps = ({ stories, projectBoard }) => ({
  isEnabled: haveSearch(getStories(stories)),
  searchResults: getStoriesByScope(stories, storyScopes.SEARCH),
  projectBoard: projectBoard,
});

const mapDispatchToProps = {
  closeSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
