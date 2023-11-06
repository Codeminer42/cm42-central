import React from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import { isDone } from '../../models/beta/column';

export const Column = ({
  title,
  children,
  renderAction,
  onClose,
  canClose,
  providedProps,
}) => (
  <div className="Column" data-cy="column" data-id="column" {...providedProps}>
    <div className="Column__header">
      <h3 className="Column__name" data-id="column-title">
        {title}
      </h3>
      <div className="Column__actions">
        {renderAction()}
        {canClose && (
          <button
            type="button"
            data-id="column-button"
            className="Column__btn-close"
            onClick={onClose}
          >
            <i className="mi md-light md-16">close</i>
          </button>
        )}
      </div>
    </div>
    <div data-id="column-children" className="Column__body">
      {children}
    </div>
  </div>
);

const DroppableColumn = ({
  title,
  children,
  renderAction,
  onClose,
  visible,
  canClose,
  columnId,
}) =>
  visible && (
    <Droppable
      droppableId={JSON.stringify({ columnId })}
      isDropDisabled={isDone(columnId)}
      type="column"
    >
      {provided => (
        <Column
          canClose={canClose}
          onClose={onClose}
          title={title}
          children={children}
          renderAction={renderAction}
          providedProps={{
            ref: provided.innerRef,
            ...provided.droppableProps,
          }}
        />
      )}
    </Droppable>
  );

Column.propTypes = {
  title: PropTypes.string.isRequired,
  renderAction: PropTypes.func,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  canClose: PropTypes.bool.isRequired,
  providedProps: PropTypes.object,
};

Column.defaultProps = {
  renderAction: () => null,
  visible: true,
  children: '',
  providedProps: {},
};

export default DroppableColumn;
