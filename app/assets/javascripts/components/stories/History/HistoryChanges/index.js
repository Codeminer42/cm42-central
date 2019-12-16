import React from 'react';
import PropTypes from 'prop-types';
import HistoryChange from './HistoryChange';

const HistoryChanges = ({ changes }) =>
  changes.map(change =>
    <HistoryChange
      key={change.key}
      oldValue={change.oldValue}
      newValue={change.newValue}
      title={I18n.t(`activerecord.attributes.story.${change.key}`)}
    />
  )

HistoryChanges.propTypes = {
  changes: PropTypes.array.isRequired
};

export default HistoryChanges;
