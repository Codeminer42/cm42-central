import React from 'react';
import PropTypes from 'prop-types';

const AddStoryButton = ({ onAdd }) => (
  <button
    className="btn btn-primary Column__btn-add-story"
    onClick={onAdd}
  >
    <i className="mi md-light md-18 md-add">add</i>
    {I18n.t('add story')}
  </button>
);

AddStoryButton.propTypes = {
  onAdd: PropTypes.func.isRequired
};

export default AddStoryButton;
