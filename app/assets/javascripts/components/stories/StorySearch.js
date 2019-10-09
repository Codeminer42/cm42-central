import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { search } from "actions/story";
import { connect } from "react-redux";

export const StorySearch = ({ projectId, search }) => {
  const [keyWord, setKeyWord] = useState('');

  const handleChange = e => setKeyWord(e.target.value);

  const handleSearch = (e) => {
    e.preventDefault();

    search(keyWord, projectId);
  }
  
  return (
    <form 
      action="#" 
      acceptCharset="UTF-8" 
      method="post"
      onSubmit={handleSearch}
    >
      <div className="form-group">
        <input 
          type="text" 
          onChange={handleChange} 
          placeholder="Search" 
          className="form-control input-sm"
          value={keyWord}
        />
      </div>
    </form>
  );
}

StorySearch.propTypes = {
  projectId: PropTypes.number.isRequired
};

const mapStateToProps = ({ project }) => ({ projectId: project.id });

export default connect(
  mapStateToProps,
  {
    search
  }
)(StorySearch);
