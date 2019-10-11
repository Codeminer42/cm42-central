import React from 'react';
import { connect } from 'react-redux';
import { closeSearch } from "actions/projectBoard";
import Search from './Search';
import { haveSearch, withScope } from './../../models/beta/story';
import { storyScopes } from './../../libs/beta/constants';
import Column from './../Columns/ColumnItem';
import PropTypes from 'prop-types';
import { storyPropTypesShape } from './../../models/beta/story';

export const SearchResults = ({ isEnabled, searchResults, closeSearch, projectBoard }) => {
  if(!isEnabled) {
    return null;
  }

  return (
    <Column
      onClose={closeSearch}
      title={`"${projectBoard.search.keyWord}"`}
    >
      <Search stories={searchResults} from="search" />
    </Column>
  );
}

SearchResults.propTypes = {
  isEnabled: PropTypes.bool.isRequired,
  searchResults: PropTypes.arrayOf(storyPropTypesShape),
  closeSearch: PropTypes.func.isRequired
};

const mapStateToProps = ({ stories, projectBoard }) => ({
  isEnabled: haveSearch(stories),
  searchResults: withScope(stories, storyScopes.SEARCH),
  projectBoard: projectBoard
});

const mapDispatchToProps = {
  closeSearch
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
