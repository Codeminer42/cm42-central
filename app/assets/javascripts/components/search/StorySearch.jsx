import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { search } from 'actions/projectBoard';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import SearchTooltip from './SearchTooltip';

export const StorySearch = ({ projectId, search, loading }) => {
  const [keyWord, setKeyWord] = useState('');
  const [classPopup, setClassPopup] = useState('hidden');

  const handleChange = e => setKeyWord(e.target.value);

  const handleSearch = e => {
    e.preventDefault();

    search(keyWord, projectId);
  };

  const handleMouseOver = () => setClassPopup('show');

  const handleMouseOut = () => setClassPopup('hidden');

  return ReactDOM.createPortal(
    <form
      data-id="form-search-story"
      action="#"
      acceptCharset="UTF-8"
      method="post"
      onSubmit={handleSearch}
      className="StorySearch"
    >
      {loading && (
        <span
          className="StorySearch__spinner"
          data-id="spinner-loading"
          data-testid="story-search-spinner"
        >
          <i className="fa fa-spinner fa-spin"></i>
        </span>
      )}
      <div className="form-group">
        <input
          type="text"
          onChange={handleChange}
          placeholder={I18n.t('projects.search_story')}
          className="form-control input-sm StorySearch__input"
          value={keyWord}
          disabled={loading}
          required
        />
        <i
          className="mi md-20 drop-target"
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          help
        </i>
        <SearchTooltip aditionalClass={`StorySearch__tooltip ${classPopup}`} />
      </div>
    </form>,
    document.querySelector('[data-portal="search"]')
  );
};

StorySearch.propTypes = {
  projectId: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ project }) => ({ projectId: project.id });

export default connect(mapStateToProps, {
  search,
})(StorySearch);
