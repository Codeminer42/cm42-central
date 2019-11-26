import React from 'react';
import SideBarButton from './SideBarButton';
import { reverseColumns } from '../../../actions/projectBoard';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export const SideBar = ({
  reverseColumns
}) =>
  <div className="SideBar">
    <ul>
      <SideBarButton
        description={I18n.t('revert_columns_tooltip')}
        onClick={reverseColumns}
        data-id="reverse-button"
      >
        <i className="fas fa-redo-alt SideBar__icon"></i>
      </SideBarButton>
    </ul>
  </div>

const mapDispatchToProps = {
  reverseColumns
}

SideBar.propTypes = {
  reverseColumns: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(SideBar);
