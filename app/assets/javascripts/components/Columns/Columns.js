import React from 'react';
import Column from './ColumnItem';
import PropTypes from 'prop-types';

const Columns = ({
  columns
}) =>
  columns.map(column =>
    <Column
      title={column.title}
      renderAction={column.renderAction}
      key={column.title}
    >
      { column.children }
    </Column>
  )

Columns.propTypes = {
  columns: PropTypes.array.isRequired
}

export default Columns;
