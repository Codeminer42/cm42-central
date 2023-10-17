import React from "react";
import { connect } from "react-redux";
import { closeSearch } from "actions/projectBoard";
import Search from "./Search";
import {
  denormalizeStories,
  haveSearch,
  withScope,
} from "./../../models/beta/story";
import { storyScopes } from "./../../libs/beta/constants";
import Column from "./../Columns/ColumnItem";
import PropTypes from "prop-types";
import StoryPropTypes from "../shapes/story";

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
  isEnabled: haveSearch(stories),
  searchResults: denormalizeStories(withScope(stories, storyScopes.SEARCH)),
  projectBoard: projectBoard,
});

const mapDispatchToProps = {
  closeSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
