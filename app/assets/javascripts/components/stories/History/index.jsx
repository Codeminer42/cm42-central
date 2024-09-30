import React from 'react';
import PropTypes from 'prop-types';
import HistoryItem from './HistoryItem';

const History = ({ history }) => (
  <div className="History">
    {history.map(item => (
      <HistoryItem
        key={item.activity.id}
        data-id="history-activity"
        title={I18n.t(`activity.actions.${item.activity.action}`)}
        date={item.activity.created_at}
        user={item.activity.user}
        changes={item.activity.changes}
      />
    ))}
  </div>
);

History.propTypes = {
  history: PropTypes.array.isRequired,
};

export default History;
