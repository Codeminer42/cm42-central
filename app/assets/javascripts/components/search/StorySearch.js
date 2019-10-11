import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { search } from "actions/projectBoard";
import { connect } from "react-redux";
import ReactDOM from 'react-dom';

export const StorySearch = ({ projectId, search, loading }) => {
  const [keyWord, setKeyWord] = useState('');

  const handleChange = e => setKeyWord(e.target.value);

  const handleSearch = (e) => {
    e.preventDefault();

    search(keyWord, projectId);
  }
  
  return ReactDOM.createPortal(
    <form 
      action="#" 
      acceptCharset="UTF-8" 
      method="post"
      onSubmit={handleSearch}
    >
      {
        loading && 
          <span className="spinner-search">
            <i className="fa fa-spinner fa-spin"></i>
          </span>
      }
      <div className="form-group">
        <input 
          type="text" 
          onChange={handleChange} 
          placeholder="Search" 
          className="form-control input-sm"
          value={keyWord}
        />
      </div>
    </form>,
    document.querySelector('[data-portal="search"]')
  );
}

StorySearch.propTypes = {
  projectId: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = ({ project }) => ({ projectId: project.id });

export default connect(
  mapStateToProps,
  {
    search
  }
)(StorySearch);
