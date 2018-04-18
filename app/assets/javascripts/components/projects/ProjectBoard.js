import React from 'react';
import { connect } from 'react-redux';
import { fetchProjectBoard } from 'actions/projectBoard';
import Column from './Column'

class ProjectBoard extends React.Component {
  componentWillMount() {
    this.props.fetchProjectBoard(this.props.projectId);
  }

  render() {
    console.log(this.props.projectBoard.isFetched)
    if(!this.props.projectBoard.isFetched) {
      return <b>Loading</b>;
    }
    const stories = [
        {
          id: 1,
          title: 'Teste'
        }
      ]

    return (
      <div>
        <h1> {this.props.project.name} </h1>
        <div className='stories'>
          <Column
            title = "ToDo"
            stories = {stories}
          />
          <Column
            title = "ToDo"
            stories = {stories}
          />
          <Column
            title = "ToDo"
            stories = {stories}
          />
          <Column
            title = "ToDo"
            stories = {stories}
          />
        </div>

      </div>
    );
  }
}

const mapStateToProps = ({ projectBoard, project, users, stories }) => ({
  projectBoard,
  project,
  users,
  stories
});

const mapDispatchToProps = {
  fetchProjectBoard
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectBoard);
