import React from 'react';
import Column from './ColumnItem';
import PropTypes from 'prop-types';
import ColumnShape from '../shapes/column';

const Columns = ({
  columns
}) =>
  columns.map(column =>
    <Column
      title={column.title}
      renderAction={column.renderAction}
      key={column.title}
      visible={column.visible}
      onClose={column.onClose}
    >
      { column.children }
    </Column>
  )

Columns.propTypes = {
  columns: PropTypes.arrayOf(ColumnShape).isRequired
}

export default Columns;
