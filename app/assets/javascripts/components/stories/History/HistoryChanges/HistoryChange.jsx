import React from 'react';
import PropTypes from 'prop-types';
import { valueHistory } from '../../../shapes/history';

const HistoryChange = ({ oldValue, newValue, title }) => (
  <div className="HistoryChange">
    <div className="HistoryChange__action" data-id="history-change-title">
      {title}
    </div>
    <div className="HistoryChange__changes">
      <div data-id="history-old-value"> {oldValue || '---'} </div>
      <div>
        <i className="mi md-18">arrow_forward</i>
      </div>
      <div data-id="history-new-value"> {newValue || '---'} </div>
    </div>
  </div>
);

HistoryChange.propTypes = {
  oldValue: valueHistory,
  newValue: valueHistory,
  title: PropTypes.string.isRequired,
};

export default HistoryChange;
