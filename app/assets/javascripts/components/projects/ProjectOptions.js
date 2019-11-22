import React from 'react';
import ProjectOption from './ProjectOption';
import { reverseColumnsProjectBoard } from '../../actions/projectBoard';
import { connect } from 'react-redux';

export const ProjectOptions = ({
  reverseColumnsProjectBoard
}) =>
  <div className="ProjectBoard__options">
    <ul>
      <ProjectOption
        description={I18n.t('revert_tooltip')} 
        onClick={reverseColumnsProjectBoard}
      >
        <i className="fas fa-redo-alt ProjectOption__icon"></i>
      </ProjectOption>
    </ul>
  </div>

const mapStateToProps = ({ }) => ({ });

const mapDispatchToProps = {
  reverseColumnsProjectBoard
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectOptions);
