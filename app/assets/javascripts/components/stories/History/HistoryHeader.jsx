import React from 'react';
import PropTypes from 'prop-types';

const HistoryHeader = ({ title, date, user }) => (
  <div className="HistoryHeader">
    <div className="HistoryHeader__title" data-id="history-header-title">
      {user} <b> {title} </b>
    </div>
    <div className="HistoryHeader__date" data-id="history-header-date">
      {I18n.l('date.formats.short', date)}
    </div>
  </div>
);

HistoryHeader.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
};

export default HistoryHeader;
