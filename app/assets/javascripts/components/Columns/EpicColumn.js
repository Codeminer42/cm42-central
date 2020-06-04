import React from 'react';
import Column from './ColumnItem';
import Stories from '../stories/Stories';
import PropTypes from "prop-types";
import StoryPropTypes from '../shapes/story';
import { totalPoints, donePoints, remainingPoints } from '../../models/beta/story';
import { EPIC } from '../../models/beta/column';
import { receiveStories } from '../../actions/story';
import { connect } from "react-redux";

export const EpicColumnHeader = ({ stories }) =>
  <div className="Sprint__header">
    {I18n.t('projects.show.done')}: { donePoints(stories) } / {I18n.t('remaining')}: { remainingPoints(stories) }

    <span className="done-points">{I18n.t('projects.reports.points')}: { totalPoints(stories) }</span>
  </div>

const EpicColumn = ({ stories, receiveStories }) => (
  <Column
    onClose={() => receiveStories([], EPIC)}
    title={I18n.t('projects.show.epic')}
    canClose
    visible
  >
    <div className="Sprint">
      <EpicColumnHeader
        stories={stories}
      />
      <div className="Sprint__body">
        <Stories columnId="epic" stories={stories} isDropDisabled from={EPIC} />
      </div>
    </div>
  </Column>
);

EpicColumn.propTypes = {
  receiveStories: PropTypes.func.isRequired,
  stories: PropTypes.arrayOf(StoryPropTypes)
}

EpicColumn.defaultProps = {
  stories: []
}

const mapDispatchToProps = {
  receiveStories
};

export default connect(
  null,
  mapDispatchToProps
)(EpicColumn);
