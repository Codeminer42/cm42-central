import React from 'react';
import SideBarButton from './SideBarButton';
import { reverseColumns, toggleColumn } from '../../../actions/projectBoard';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export const SideBar = ({
  reverseColumns,
  toggleColumn,
  projectBoard
}) =>
  <div className="SideBar">
    <ul>
      <SideBarButton
        description={I18n.t('revert_columns_tooltip')}
        onClick={reverseColumns}
        data-id="reverse-button"
        toggled={projectBoard.reverse}
      >
        <i className="fas fa-redo-alt SideBar__icon"></i>
      </SideBarButton>
      <SideBarButton
        description={I18n.t('toggle_column', { column: 'chilly bin' })}
        onClick={() => toggleColumn('chillyBin')}
        data-id="toggle-chilly-bin"
        toggled={projectBoard.visibleColumns.chillyBin}
      >
        <i className="fas fa-clock SideBar__icon"></i>
      </SideBarButton>
      <SideBarButton
        description={I18n.t('toggle_column', { column: 'backlog' })}
        onClick={() => toggleColumn('backlog')}
        data-id="toggle-backlog"
        toggled={projectBoard.visibleColumns.backlog}
      >
        <i className="fas fa-th-list SideBar__icon"></i>
      </SideBarButton>
      <SideBarButton
        description={I18n.t('toggle_column', { column: 'done' })}
        onClick={() => toggleColumn('done')}
        data-id="toggle-done"
        toggled={projectBoard.visibleColumns.done}
      >
        <i className="fas fa-check-circle SideBar__icon"></i>
      </SideBarButton>
    </ul>
  </div>

const mapDispatchToProps = {
  reverseColumns,
  toggleColumn
}

const mapStateToProps = ({
  projectBoard
}) => ({
  projectBoard
});

SideBar.propTypes = {
  reverseColumns: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
