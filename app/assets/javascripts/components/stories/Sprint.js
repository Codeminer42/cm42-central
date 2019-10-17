import React, { Component } from "react";
import PropTypes from "prop-types";
import Stories from "./Stories";
import SprintHeader from './SprintHeader'
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
    this.state = { isClosed: this.isDone() };

    this.isDone = this.isDone.bind(this);
    this.needsFetch = this.needsFetch.bind(this);
    this.toggleSprint = this.toggleSprint.bind(this);
    this.onHeaderClick = this.onHeaderClick.bind(this);
  }

  isDone() {
    return this.props.sprint.hasOwnProperty('hasStories');
  }

  needsFetch() {
    const { hasStories, fetched, isFetching } = this.props.sprint;

    return hasStories && !(fetched || isFetching);
  }

  onHeaderClick() {
    const { sprint: { number, startDate, endDate }, fetchStories } = this.props;

    if (this.needsFetch()) {
      fetchStories(number, startDate, endDate);
      this.toggleSprint();
    } else {
      this.toggleSprint();
    }
  }

  toggleSprint() {
    this.setState(prevState => ({ isClosed: !prevState.isClosed }));
  }

  render() {
    const {
      number,
      points,
      stories,
      startDate,
      hasStories,
      completedPoints
    } = this.props.sprint;
    const { isClosed } = this.state;
    const closedStyle = isClosed && "Sprint__body--is-collapsed";
    const { column } = this.props;

    return (
      <div className="Sprint">
        <SprintHeader
          number={number}
          startDate={startDate}
          completedPoints={completedPoints}
          points={points}
          hasStories={hasStories}
          isDone={this.isDone()}
          onClick={this.onHeaderClick}
          isClosed={isClosed}
        />
        <div data-cy={ column ? column : 'done' } className={`Sprint__body ${closedStyle}`}>
          {stories && <Stories column={column} stories={stories} />}
        </div>
      </div>
    );
  }
}

Sprint.propTypes = propTypes;
Sprint.defaultProps = defaultProps;

export default Sprint;
