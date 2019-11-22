import React from 'react';
import ProjectOption from './ProjectOption';
import { reverseColumns } from '../../actions/projectBoard';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export const ProjectOptions = ({
  reverseColumns
}) =>
  <div className="ProjectBoard__options">
    <ul>
      <ProjectOption
        description={I18n.t('revert_tooltip')}
        onClick={reverseColumns}
        data-id="reverse-button"
      >
        <i className="fas fa-redo-alt ProjectOption__icon"></i>
      </ProjectOption>
    </ul>
  </div>

const mapDispatchToProps = {
  reverseColumns
}

ProjectOptions.propTypes = {
  reverseColumns: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(ProjectOptions);
