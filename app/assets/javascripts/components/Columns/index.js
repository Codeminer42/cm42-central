import React from 'react';
import Column from './ColumnItem';
import PropTypes from 'prop-types';
import ColumnShape from '../shapes/column';

const Columns = ({
  columns,
  canClose
}) =>
  columns.map(column =>
    <Column
      title={column.title}
      renderAction={column.renderAction}
      key={column.title}
      visible={column.visible}
      onClose={column.onClose}
      canClose={canClose}
    >
      { column.children }
    </Column>
  )

Columns.propTypes = {
  columns: PropTypes.arrayOf(ColumnShape).isRequired,
  canClose: PropTypes.bool.isRequired
}

export default Columns;
