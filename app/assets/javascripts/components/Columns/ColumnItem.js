import React from 'react'
import { useDrop } from 'react-dnd';
import PropTypes from 'prop-types'

const type = {
  story: 'STORY'
}

const Column = ({
  title,
  children,
  renderAction,
  onClose,
  column
}) => {
  const [, drop] = useDrop({
    accept: type.story,
    canDrop() {
      return column !== 'done'
    },

    drop(item) {
      return {...item, column};
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  })
  return (
    <div ref={drop} className="Column">
      <div className="Column__header">
        <h3 className="Column__name">{title}</h3>
        <div className="Column__actions">
          {renderAction()}
          <button type="button" className="Column__btn-close" onClick={onClose}>
            <i className="mi md-light md-16">close</i>
          </button>
        </div>
      </div>
      <div data-cy={column==='chillyBin' ? column : null} className="Column__body">{children}</div>
    </div>
  );
}

Column.propTypes = {
  title: PropTypes.string.isRequired,
  renderAction: PropTypes.func
}

Column.defaultProps = {
  renderAction: () => null
}

export default Column;
