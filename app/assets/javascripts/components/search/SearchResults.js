import React from 'react';
import { connect } from 'react-redux';
import { closeSearch } from "actions/projectBoard";
import Search from './Search';
import { haveSearch, withScope } from './../../models/beta/story';
import { storyScopes } from './../../libs/beta/constants';
import Column from './../Columns/ColumnItem';

export const SearchResults = ({ isEnabled, searchResults, closeSearch, projectBoard }) => {
  if(!isEnabled) {
    return null;
  }

  return (
    <Column
      onClose={closeSearch}
      title={projectBoard.search.keyWord}
    >
      <Search stories={searchResults} from="search" />
    </Column>
  );
}

const mapStateToProps = ({ stories, projectBoard }) => ({
  isEnabled: haveSearch(stories),
  searchResults: withScope(stories, storyScopes.SEARCH),
  projectBoard: projectBoard
});

const mapDispatchToProps = {
  closeSearch
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
