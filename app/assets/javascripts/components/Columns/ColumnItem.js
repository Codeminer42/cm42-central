import React from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';

const Column = ({ title, children, renderAction, onClose, visible, canClose, columnId }) => (
  visible && (
    <Droppable droppableId={JSON.stringify({ columnId })} isDropDisabled={columnId === 'done'}>
      {provided => (
        <div className="Column" data-id="column" ref={provided.innerRef} {...provided.droppableProps}>
          <div className="Column__header">
            <h3 className="Column__name" data-id="column-title">{title}</h3>
            <div className="Column__actions">
              { renderAction() }
              {
                canClose &&
                  <button type="button" data-id="column-button" className="Column__btn-close" onClick={onClose}>
                    <i className="mi md-light md-16">close</i>
                  </button>
              }
            </div>
          </div>
          <div data-id="column-children" className="Column__body">
            { children }
          </div>
          { provided.placeholder }
        </div>
      )}
    </Droppable>
  )
);

Column.propTypes = {
  title: PropTypes.string.isRequired,
  renderAction: PropTypes.func,
  visible: PropTypes.bool,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  canClose: PropTypes.bool.isRequired
}

Column.defaultProps = {
  renderAction: () => null,
  visible: true,
  children: '',
}

export default Column;
