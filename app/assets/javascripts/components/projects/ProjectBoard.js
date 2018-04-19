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
          <div>
            <Column
              title = "Done"
              stories = {stories}
            />
          </div>

          <div>
            <Column
              title = "In Progress"
              stories = {stories}
            />
          </div>
          <div>
            <Column
              title = "BackLog"
              stories = {stories}
            />
          </div>
          <div>
            <Column
              title = "Search Results"
              stories = {stories}
            />
          </div>

          <div >
            <Column
              title = "Chilly Bin"
              stories = {stories}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  projectBoard,
  project,
  users,
  stories,
  columns
}) => ({
  projectBoard,
  project,
  users,
  stories,
  columns,
});

const mapDispatchToProps = {
  fetchProjectBoard
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectBoard);
