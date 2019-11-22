import React from 'react';
import ProjectOption from './ProjectOption';
import { reverseColumnsProjectBoard } from '../../actions/projectBoard';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export const ProjectOptions = ({
  reverseColumnsProjectBoard
}) =>
  <div className="ProjectBoard__options">
    <ul>
      <ProjectOption
        description={I18n.t('revert_tooltip')}
        onClick={reverseColumnsProjectBoard}
        data-id="reverse-button"
      >
        <i className="fas fa-redo-alt ProjectOption__icon"></i>
      </ProjectOption>
    </ul>
  </div>

const mapStateToProps = ({ }) => ({ });

const mapDispatchToProps = {
  reverseColumnsProjectBoard
}

ProjectOptions.propTypes = {
  reverseColumnsProjectBoard: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectOptions);
