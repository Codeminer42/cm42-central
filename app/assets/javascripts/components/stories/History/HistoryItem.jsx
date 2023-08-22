import React from 'react'
import HistoryHeader from './HistoryHeader';
import HistoryChanges from './HistoryChanges';
import PropTypes from "prop-types";

const HistoryItem = ({
  title,
  date,
  user,
  changes
}) =>
  <div className="HistoryItem">
    <HistoryHeader
      title={title}
      date={date}
      user={user}
      data-id="history-header"
    />
    <HistoryChanges data-id="history-changes" changes={changes} />
  </div>

HistoryItem.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  changes: PropTypes.array.isRequired
};

export default HistoryItem;
