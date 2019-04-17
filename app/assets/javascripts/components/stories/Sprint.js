import React, { Component } from "react";
import PropTypes from "prop-types";
import Stories from "./Stories";
import { sprintPropTypesShape } from '../../models/beta/iteration';
import { pastIterationPropTypesShape } from '../../models/beta/pastIteration';

const propTypes = {
  fetchStories: PropTypes.func,
  sprint: PropTypes.oneOf([
    sprintPropTypesShape,
    pastIterationPropTypesShape
  ])
};

const defaultProps = {
  fetchStories: undefined,
  sprint: {
    number: 0,
    startDate: 0,
    points: 0,
    stories: []
  }
};

class Sprint extends Component {
  constructor(props) {
    super(props);
    this.state = { isClosed: false };
    this.toggleSprint = this.toggleSprint.bind(this);
  }

  toggleSprint() {
    const { fetchStories } = this.props;
    const { number, startDate, endDate, fetched, isFetching } = this.props.sprint;
    const needsFetch = !(fetched || isFetching);

    if (needsFetch && !!fetchStories) {
      fetchStories(number, startDate, endDate);
    } else {
      this.setState(prevState => ({ isClosed: !prevState.isClosed }));
    }
  }

  render() {
    const { number, startDate, points, completedPoints, stories } = this.props.sprint;
    const closedStyle = this.state.isClosed && "Sprint__body--is-collapsed";
    return (
      <div className="Sprint">
        <div className="Sprint__header" onClick={this.toggleSprint}>
          {number} - {I18n.l("date.formats.long", startDate)}
          <span className="Sprint__points">
            {completedPoints > 0 && `${completedPoints} / `}
            {points}
          </span>
        </div>
        <div className={`Sprint__body ${closedStyle}`}>
          {stories && <Stories stories={stories} />}
        </div>
      </div>
    );
  }
}

Sprint.propTypes = propTypes;
Sprint.defaultProps = defaultProps;

export default Sprint;
