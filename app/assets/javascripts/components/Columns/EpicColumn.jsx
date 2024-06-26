import React from 'react';
import Column from './ColumnItem';
import Stories from '../stories/Stories';
import PropTypes from 'prop-types';
import StoryPropTypes from '../shapes/story';
import {
  totalPoints,
  donePoints,
  remainingPoints,
} from '../../models/beta/story';
import { EPIC } from '../../models/beta/column';
import { closeEpicColumn } from '../../actions/story';
import { connect } from 'react-redux';

export const EpicColumnHeader = ({ stories }) => (
  <div className="Sprint__header">
    {I18n.t('projects.show.done')}: {donePoints(stories)} /{' '}
    {I18n.t('remaining')}: {remainingPoints(stories)}
    <span className="done-points">
      {I18n.t('projects.reports.points')}: {totalPoints(stories)}
    </span>
  </div>
);

const EpicColumn = ({ stories, closeEpicColumn }) => (
  <Column
    onClose={closeEpicColumn}
    title={I18n.t('projects.show.epic')}
    canClose
    visible
  >
    <div className="Sprint">
      <EpicColumnHeader stories={stories} />
      <div className="Sprint__body">
        <Stories columnId="epic" stories={stories} isDropDisabled from={EPIC} />
      </div>
    </div>
  </Column>
);

EpicColumn.propTypes = {
  closeEpicColumn: PropTypes.func.isRequired,
  stories: PropTypes.arrayOf(StoryPropTypes),
};

EpicColumn.defaultProps = {
  stories: [],
};

const mapDispatchToProps = {
  closeEpicColumn,
};

export default connect(null, mapDispatchToProps)(EpicColumn);
